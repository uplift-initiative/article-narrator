# Uplift Narrator

Drop-in audio narration for any article. Transform your written content into engaging audio experiences with one line of code.

**Uplift AI** specializes in voice models for underserved languages, making content accessible to global audiences in their native tongues.

## Quick Start

1. **Register your domain** at [upliftai.org](https://upliftai.org)
2. **Add the script** to your page:

```html
<script src="https://d3bh4trxpt2avf.cloudfront.net/uplift-narrator.min.js"></script>
<uplift-narrator></uplift-narrator>
```

That's it! The player automatically narrates the current page.

## Usage Examples

### Basic HTML
```html
<!DOCTYPE html>
<html>
<body>
  <article>
    <h1>Your Article Title</h1>
    <p>Your content here...</p>
  </article>
  
  <script src="https://d3bh4trxpt2avf.cloudfront.net/uplift-narrator.min.js"></script>
  <uplift-narrator></uplift-narrator>
</body>
</html>
```

### WordPress
Add to your theme's `single.php` or `page.php`:

```php
<?php if (is_single()) : ?>
  <script src="https://d3bh4trxpt2avf.cloudfront.net/uplift-narrator.min.js"></script>
  <uplift-narrator></uplift-narrator>
<?php endif; ?>
```

## Attributes

| Attribute | Default | Description |
|-----------|---------|-------------|
| `url` | Current page URL | Article URL to narrate |
| `voice-id` | `"v_meklc281"` | Voice selection ([more voices](https://docs.upliftai.org/orator_voices)) |

## Features

- 🎯 Zero configuration required
- 📱 Responsive design
- ⚡ Lightweight
- 🎨 Clean, minimal interface
- ⌨️ Keyboard accessible
- 🚀 No dependencies

## Browser Support

Works in all modern browsers (Chrome 63+, Firefox 67+, Safari 12.1+, Edge 79+).

## License

MIT

## Support

- Issues: [GitHub](https://github.com/uplift-ai/uplift-narrator/issues)
- founders@upliftai.org