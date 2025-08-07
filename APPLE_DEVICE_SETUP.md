# Official Apple Device Frames Setup

## Download Official Apple Device Bezels

1. **Visit Apple Design Resources**
   - Go to: https://developer.apple.com/design/resources/
   - Scroll to "Product Bezels" section
   - No Apple Developer account required for bezels!

2. **Download Options Available:**
   - **MacBook Pro** - Download as PNG (171 MB)
   - **MacBook Air** - Download as PNG (86.7 MB)
   - **iPad Pro** - Download as PNG (multiple sizes)
   - **iPhone 15 Pro** - Download as PNG (56.2 MB)

3. **Quick Setup Instructions:**
   ```bash
   # 1. Download the MacBook Pro PNG from Apple
   # 2. Place it in: public/devices/macbook-pro.png
   # 3. Use in your component:
   ```

4. **Implementation Example:**
   ```jsx
   <div className="relative">
     {/* Official Apple MacBook Frame */}
     <img 
       src="/devices/macbook-pro.png" 
       alt="MacBook Pro"
       className="w-full h-auto"
     />
     
     {/* Your website content positioned absolutely */}
     <div className="absolute" style={{
       top: '5.8%',    // Adjust to fit screen area
       left: '11.5%',   // Adjust to fit screen area
       width: '77%',    // Adjust to fit screen area
       height: '78%',   // Adjust to fit screen area
     }}>
       <iframe src={projectUrl} className="w-full h-full" />
     </div>
   </div>
   ```

## Alternative: Use Apple's Exact Dimensions

MacBook Pro 14" (M3) Specifications:
- Screen: 3024 × 1964 pixels
- Aspect Ratio: 14:9 (approximately)
- Bezel: 3.5mm sides, 3.5mm top (excluding notch)
- Notch: 124px wide × 32px height
- Corner Radius: 10px

## Recommended Approach

Since you want EXACT Apple devices, I recommend:

1. **Immediate Solution**: Download the official PNG bezels from Apple
2. **Best Integration**: Use the PNG as a background with positioned content
3. **Most Flexible**: Convert the PNG to SVG using a tool like:
   - Adobe Illustrator
   - Figma (import PNG, trace, export as SVG)
   - Online converters

## Legal Note
Apple's bezels come with usage guidelines. Review:
https://developer.apple.com/design/human-interface-guidelines/marketing