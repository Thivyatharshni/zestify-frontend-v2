# Hero Section Video Assets

This directory contains the cinematic food video files used in the HeroVideoSection component.

## Status: Temporary External Videos Active 🎥

**Currently using external video URLs** for immediate functionality. Replace with local video files for production.

### To Replace with Local Videos:
1. Download actual MP4/WebM video files
2. Replace placeholder files in this directory
3. Update `HeroVideoSection.jsx` to use local imports instead of URLs
4. Remove the temporary URL constants and uncomment the ES6 imports

## Required Video Files

### Primary Video: `food-sizzle-pan.mp4` & `food-sizzle-pan.webm`
- **Content**: Close-up of sizzling pan with steam rising, sauce drizzle, warm lighting
- **Style**: Slow-motion, cinematic, shallow depth of field
- **Duration**: Loopable (preferably 10-20 seconds)
- **Resolution**: 1080p (1920x1080)
- **Format**: MP4 (H.264) and WebM for optimal performance

### Fallback Video: `food-cheese-pull.mp4` & `food-cheese-pull.webm`
- **Content**: Pizza cheese pull close-up, melted cheese stretching
- **Style**: Slow-motion, warm golden lighting
- **Duration**: Loopable (preferably 10-20 seconds)
- **Resolution**: 1080p (1920x1080)
- **Format**: MP4 (H.264) and WebM for optimal performance

## Technical Specifications
- **Codec**: H.264 for MP4, VP8/VP9 for WebM
- **Frame Rate**: 24-30 fps
- **Bitrate**: Optimized for web (2-5 Mbps)
- **File Size**: Keep under 10MB per video for fast loading
- **Aspect Ratio**: 16:9 (landscape)

## Video Sources
Recommended sources for high-quality food videos:
- Pexels (free)
- Coverr.co (free)
- Pixabay (free)
- Shutterstock (paid, high quality)

## Implementation Notes
- Videos auto-play, loop, and are muted by default
- Poster image fallback: `/src/assets/images/hero-food-light.png`
- Preload set to "metadata" for performance
- Multiple format support for cross-browser compatibility
- Component imports videos using ES6 imports for Vite bundling
