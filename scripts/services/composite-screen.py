#!/usr/bin/env python3
"""Put a real UI capture onto the phone in a photograph.
usage: composite-screen.py PHOTO SCREEN OUT [--mode dark|bright] [--top t|b|l|r] [--bezel 0.035] [--radius 0.12] [--corners x0,y0,x1,y1,x2,y2,x3,y3]
  dark  = the phone's screen is OFF in the photo (whole phone is a dark blob; the screen = that quad inset by --bezel of its width)
  bright= the phone's screen is a plain white rectangle (the blob IS the screen)
  --top = which edge of the detected quad is the screen's top (default t = the upper edge)
  --corners = skip detection, give TL,TR,BR,BL in photo pixels
Writes OUT (png) and OUT-preview.jpg (1200px wide)."""
import sys, argparse, numpy as np, cv2

ap = argparse.ArgumentParser()
ap.add_argument("photo"); ap.add_argument("screen"); ap.add_argument("out")
ap.add_argument("--mode", default="dark"); ap.add_argument("--top", default="t")
ap.add_argument("--bezel", type=float, default=0.035); ap.add_argument("--radius", type=float, default=0.12)
ap.add_argument("--corners", default=None); ap.add_argument("--glare", type=float, default=None); ap.add_argument("--island", type=int, default=1); ap.add_argument("--statusbar", default=None, help="dark|light: draw an iOS status bar (9:41, signal, wifi, battery) in the screen's top strip")
a = ap.parse_args()

photo = cv2.imread(a.photo, cv2.IMREAD_COLOR); H, W = photo.shape[:2]
screen = cv2.imread(a.screen, cv2.IMREAD_COLOR)

def order(pts):
    pts = np.array(pts, dtype=np.float32); s = pts.sum(1); d = np.diff(pts, axis=1).ravel()
    return np.array([pts[np.argmin(s)], pts[np.argmin(d)], pts[np.argmax(s)], pts[np.argmax(d)]], dtype=np.float32)  # TL,TR,BR,BL

if a.corners:
    v = [float(x) for x in a.corners.split(",")]; quad = np.array(v, dtype=np.float32).reshape(4, 2)
else:
    hsv = cv2.cvtColor(photo, cv2.COLOR_BGR2HSV)
    if a.mode == "dark":
        m = ((hsv[..., 2] < 60) & (hsv[..., 1] < 90)).astype(np.uint8) * 255
    elif a.mode == "green":   # chroma-key screen: hue 45-75 (OpenCV 0-180), saturated, bright
        m = ((hsv[..., 0] > 40) & (hsv[..., 0] < 80) & (hsv[..., 1] > 90) & (hsv[..., 2] > 90)).astype(np.uint8) * 255
    else:
        m = ((hsv[..., 2] > 225) & (hsv[..., 1] < 40)).astype(np.uint8) * 255
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, k); m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, k)
    cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    best = None
    for c in sorted(cnts, key=cv2.contourArea, reverse=True)[:8]:
        area = cv2.contourArea(c)
        if area < 0.02 * W * H: break
        hull = cv2.convexHull(c)
        rect = cv2.minAreaRect(hull); box = cv2.boxPoints(rect)
        fill = area / max(1.0, cv2.contourArea(box))
        ar = max(rect[1]) / max(1.0, min(rect[1]))
        if fill > 0.75 and 1.3 < ar < 3.6:  # a phone-shaped, well-filled blob (foreshortening stretches ar)
            best = (hull, box); break
    if best is None: sys.exit("no phone-shaped blob found — pass --corners")
    keymask = m
    hull, box = best
    # 4 corners: simplify the hull to a quadrilateral, then order in the blob's OWN frame
    peri = cv2.arcLength(hull, True); eps = 0.01; poly = hull
    while len(poly) > 4 and eps < 0.2:
        poly = cv2.approxPolyDP(hull, eps * peri, True); eps += 0.01
    pts = poly.reshape(-1, 2).astype(np.float32) if len(poly) == 4 else box.astype(np.float32)
    (cx, cy), (rw, rh), ang = cv2.minAreaRect(hull)
    if rw < rh: ang += 90  # make the long side horizontal in the unrotated frame
    R = cv2.getRotationMatrix2D((float(cx), float(cy)), ang, 1.0)
    un = cv2.transform(pts.reshape(1, -1, 2), R).reshape(-1, 2)
    idx = [int(np.argmin(un.sum(1))), int(np.argmin(np.diff(un, axis=1).ravel())), int(np.argmax(un.sum(1))), int(np.argmax(np.diff(un, axis=1).ravel()))]
    quad = pts[idx]  # TL,TR,BR,BL along the blob's long axis
    # normalise so TL->TR is the PHYSICAL top edge (the edge whose centre is highest in the image);
    # --top then refers to edges as seen in the photo: t = that edge, l = the edge to its left, etc.
    edges = [(quad[i] + quad[(i + 1) % 4]) / 2 for i in range(4)]
    k = int(np.argmin([e[1] for e in edges]))
    quad = np.array([quad[(k + j) % 4] for j in range(4)], dtype=np.float32)
    if a.mode == "dark":  # inset the body quad to the screen
        cen = quad.mean(0); wid = (np.linalg.norm(quad[1]-quad[0]) + np.linalg.norm(quad[2]-quad[3])) / 2
        quad = cen + (quad - cen) * (1 - 2 * a.bezel * wid / wid * 1.0)  # uniform inset by bezel fraction of width
        quad = cen + (quad - cen) * (1 - a.bezel * 2)

# orientation: rotate the screen so its top lands on the requested edge
sh, sw = screen.shape[:2]
rot = {"t": None, "r": cv2.ROTATE_90_CLOCKWISE, "b": cv2.ROTATE_180, "l": cv2.ROTATE_90_COUNTERCLOCKWISE}[a.top]
if a.statusbar:  # iOS status bar in screen space; colour by --statusbar dark|light (ink colour)
    from PIL import Image, ImageDraw, ImageFont
    ink = (245, 245, 247) if a.statusbar == "light" else (10, 10, 11)
    im = Image.fromarray(cv2.cvtColor(screen, cv2.COLOR_BGR2RGB)); d = ImageDraw.Draw(im)
    fs = int(sw * 0.048); font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", fs)
    cy = int(sh * 0.0215); d.text((int(sw * 0.115), cy - fs // 2 - int(fs * 0.08)), "9:41", fill=ink, font=font)
    # signal bars, wifi, battery on the right
    x = int(sw * 0.70); bw, gap = int(sw * 0.012), int(sw * 0.006)
    for i in range(4):
        h = int(sh * 0.006) + i * int(sh * 0.003); d.rounded_rectangle((x + i * (bw + gap), cy + int(sh * 0.006) - h, x + i * (bw + gap) + bw, cy + int(sh * 0.006)), radius=1, fill=ink)
    wx = x + 4 * (bw + gap) + int(sw * 0.02); r0 = int(sw * 0.026)
    for k, rr in enumerate([r0, int(r0 * 0.66), int(r0 * 0.33)]):
        d.arc((wx - rr, cy - rr + int(sh*0.004), wx + rr, cy + rr + int(sh*0.004)), start=225, end=315, fill=ink, width=max(2, int(sw * 0.006)))
    d.ellipse((wx - int(sw*0.004), cy + int(sh*0.002), wx + int(sw*0.004), cy + int(sh*0.006)), fill=ink)
    bx = wx + int(sw * 0.045); bwid, bh = int(sw * 0.066), int(sh * 0.0115)
    d.rounded_rectangle((bx, cy - bh // 2, bx + bwid, cy + bh // 2), radius=int(bh * 0.3), outline=ink, width=max(2, int(sw * 0.004)))
    d.rounded_rectangle((bx + int(sw*0.006), cy - bh // 2 + int(sw*0.006), bx + int(bwid * 0.88), cy + bh // 2 - int(sw*0.006)), radius=int(bh * 0.2), fill=ink)
    d.rounded_rectangle((bx + bwid + int(sw*0.003), cy - bh // 5, bx + bwid + int(sw*0.008), cy + bh // 5), radius=1, fill=ink)
    screen = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)
if a.island:  # dynamic island at the top of the screen, in the screen's own orientation
    iw, ih = int(sw * 0.31), int(sh * 0.0195); ix, iy = (sw - iw) // 2, int(sh * 0.012)
    cv2.rectangle(screen, (ix + ih // 2, iy), (ix + iw - ih // 2, iy + ih), (8, 8, 10), -1)
    cv2.circle(screen, (ix + ih // 2, iy + ih // 2), ih // 2, (8, 8, 10), -1); cv2.circle(screen, (ix + iw - ih // 2, iy + ih // 2), ih // 2, (8, 8, 10), -1)
src = screen if rot is None else cv2.rotate(screen, rot)
sh, sw = src.shape[:2]
# quad is TL,TR,BR,BL of the photo's screen; if the quad is landscape and the screen is portrait, the rotation above made src landscape too
srcpts = np.array([[0, 0], [sw, 0], [sw, sh], [0, sh]], dtype=np.float32)
Hm = cv2.getPerspectiveTransform(srcpts, quad)
warped = cv2.warpPerspective(src, Hm, (W, H), flags=cv2.INTER_AREA if sw > W else cv2.INTER_CUBIC)
# rounded-rect alpha in screen space, warped with the same homography
mask = np.zeros((sh, sw), np.uint8); r = int(a.radius * min(sw, sh))
cv2.rectangle(mask, (r, 0), (sw - r, sh), 255, -1); cv2.rectangle(mask, (0, r), (sw, sh - r), 255, -1)
for cx, cy in [(r, r), (sw - r, r), (r, sh - r), (sw - r, sh - r)]: cv2.circle(mask, (cx, cy), r, 255, -1)
alpha = cv2.warpPerspective(mask, Hm, (W, H), flags=cv2.INTER_LINEAR).astype(np.float32) / 255.0
if a.mode == "green" and not a.corners:  # cover every keyed pixel (edges, rounded corners), feathered, plus spill suppression outside
    km = cv2.dilate(keymask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))).astype(np.float32) / 255.0
    alpha = np.maximum(alpha, cv2.GaussianBlur(km, (5, 5), 0))
    ring = (cv2.dilate(keymask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (25, 25))) > 0)
    b, g, r = cv2.split(photo); g2 = np.minimum(g, ((r.astype(np.int32) + b.astype(np.int32)) // 2).astype(np.uint8))
    g = np.where(ring, g2, g); photo = cv2.merge([b, g, r])
alpha = cv2.GaussianBlur(alpha, (3, 3), 0)[..., None]
p = photo.astype(np.float32) / 255.0; w = warped.astype(np.float32) / 255.0
if a.mode == "dark":
    g = 0.3 if a.glare is None else a.glare
    glare = 1 - (1 - w) * (1 - p * g)          # screen-blend the photo's highlights back over the UI
    comp = glare
elif a.mode == "green":
    comp = w                                     # clean key: the UI as-is (add --glare later if wanted)
else:
    g = 0.25 if a.glare is None else a.glare
    lum = cv2.cvtColor(photo, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255.0
    comp = w * ((1 - g) + g * lum[..., None])   # carry the photo's shading onto the white UI
out = p * (1 - alpha) + comp * alpha
out8 = np.clip(out * 255, 0, 255).astype(np.uint8)
cv2.imwrite(a.out, out8)
pv = cv2.resize(out8, (1200, int(H * 1200 / W)), interpolation=cv2.INTER_AREA)
cv2.imwrite(a.out.rsplit(".", 1)[0] + "-preview.jpg", pv, [cv2.IMWRITE_JPEG_QUALITY, 82])
print("quad TL,TR,BR,BL:", quad.round(1).tolist())
