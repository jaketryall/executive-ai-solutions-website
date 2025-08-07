# Device Frame Options for Your Website

## Option 1: React Device Frames (Recommended)
```bash
npm install react-device-frames
```

This gives you pixel-perfect Apple device frames:
```jsx
import { MacBook, IPad, IPhone } from 'react-device-frames';
import 'react-device-frames/styles/style.css';

<MacBook>
  <iframe src="your-website.com" />
</MacBook>
```

## Option 2: Device Frames CSS Library
```bash
npm install devices.css
```

Provides pure CSS device frames:
```jsx
<div className="device device-macbook-pro">
  <div className="device-frame">
    <div className="device-screen">
      {/* Your content */}
    </div>
  </div>
</div>
```

## Option 3: Figma/Sketch Export
1. Get free device frames from Figma Community:
   - https://www.figma.com/community/file/1125798347304294441
2. Export as SVG
3. Use as React component

## Option 4: Apple Design Resources (Official)
1. Go to: https://developer.apple.com/design/resources/
2. Download official templates (requires Apple ID)
3. Export device frames as PNG/SVG

## Option 5: Use Premium Services
- **Rotato**: https://rotato.app (3D device mockups)
- **Mockuuups Studio**: https://mockuuups.studio
- **Angle**: https://angle.sh

## Current Implementation
I've created a custom MacBook Pro frame with:
- Camera notch (like newer MacBooks)
- Realistic gradients
- Base/keyboard section
- Trackpad

To make it even more realistic, we could:
1. Add keyboard keys
2. Use actual device dimensions
3. Add Apple logo
4. Include speaker grilles

Would you like me to:
1. Install a device frame library for pixel-perfect accuracy?
2. Enhance the current custom CSS version?
3. Switch back to iPad or try iPhone frame?