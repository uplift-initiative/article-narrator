Create a professional web component library for an audio article narrator player.

## Project Requirements

Build an npm package called "uplift-narrator" that provides a drop-in web component for article narration. This will be used by news websites and blogs.

## Technical Specifications

### Web Component
- Custom element: `<uplift-narrator>`
- Should be a single, self-contained JavaScript file that defines the web component
- No external dependencies (vanilla JS only)
- Should work in all modern browsers

### API Integration
- Default endpoint: `https://api.upliftai.org/v1/article-narration?voiceId=v_meklc281&url={current_page_url}`
- Attributes to override:
  - `base-url` (default: "https://api.upliftai.org")
  - `voice-id` (default: "v_meklc281")
  - `url` (default: current page URL from window.location.href)

### Design Requirements
- Clean, minimalist audio player design
- Include play/pause button, progress bar, time display, volume control
- "Powered by Uplift AI" text with small logo
- Download and embed this logo as base64: https://framerusercontent.com/images/gJd24YHjRpCUU0tlJVM42Fhgsk.png
- Responsive design that works on mobile and desktop
- Player should be styled using Shadow DOM to prevent style conflicts
- Modern, professional appearance suitable for news sites

### Player Features
- Show loading state while fetching audio
- Handle errors gracefully (domain not authorized, network errors)
- Keyboard accessibility (space for play/pause, arrow keys for seek)
- Remember volume preference in localStorage
- Show buffering progress
- Optional: playback speed control

### Package Structure
uplift-narrator/
├── package.json
├── README.md
├── LICENSE (MIT)
├── dist/
│   ├── uplift-narrator.js (unminified)
│   └── uplift-narrator.min.js (minified)
├── src/
│   └── index.js (source code)
├── examples/
│   └── index.html (demo page)
└── scripts/
└── build.js (build script using esbuild or similar)

### Code Quality Requirements
- Write clean, maintainable code with clear comments
- Use modern JavaScript (ES6+) but ensure ALL browser and device compatibility
- Implement proper error handling
- Follow web component best practices
- Make it production-ready
- Include JSDoc comments for the component API

### Build System
- Set up npm scripts for building and minifying
- Use esbuild or rollup for bundling
- Generate both minified and unminified versions
- Ensure the logo image is embedded as base64 in the build

### Documentation
Create a comprehensive README.md with:
- Installation instructions (npm, CDN via unpkg, direct script tag)
- Usage examples
- API documentation (all attributes)
- Customization guide
- Browser compatibility info
- License information

### Example Usage (create the readme for it, it should say to use this, register your domain at upliftai.org)
The end user should be able to simply add:
```html
<script src="https://unpkg.com/uplift-narrator"></script>
<uplift-narrator></uplift-narrator>
Or with overrides:
html<uplift-narrator 
  voice-id="v_different" 
  url="https://example.com/article">
</uplift-narrator>
Implementation Notes

The player should be completely self-contained
No external CSS files - all styles in Shadow DOM
Gracefully handle CORS (audio element will handle cross-origin)

Create this as a production-ready package that news organizations can confidently deploy on their websites. Focus on reliability, performance, and ease of integration.
