# Dr. Mohamed El Fadil - Professional Portfolio

A modern, responsive professional portfolio website for Dr. Mohamed El Fadil, featuring healthcare technology expertise and BrainSAIT innovations.

## Features

- **PWA Support**: Installable Progressive Web App with offline functionality
- **SEO Optimized**: Structured data, meta tags, and sitemap
- **Performance Optimized**: DNS prefetch, preconnect, and lazy loading
- **Security Headers**: Comprehensive security headers via Cloudflare Pages
- **Responsive Design**: Mobile-first approach with smooth animations
- **Bilingual Ready**: Infrastructure for English/Arabic support

## Deployment to Cloudflare Pages

### Method 1: Direct Upload (Quick Start)

1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Click "Create a project" → "Upload assets"
3. Upload the entire `dr-fadil-profile` folder
4. Set project name: `dr-fadil-profile`
5. Deploy!

### Method 2: Git Integration (Recommended)

1. Push this repository to GitHub
2. In Cloudflare Pages Dashboard:
   - Connect to your GitHub account
   - Select your repository
   - Configure build settings:
     - Framework preset: None
     - Build command: (leave empty)
     - Build output directory: `/`
   
3. Set up GitHub Secrets for automatic deployment:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

### Custom Domain Setup

1. In Cloudflare Pages project settings
2. Go to "Custom domains"
3. Add `fadil369.dev` or your preferred domain
4. Follow DNS configuration instructions

## Local Development

Simply open `index.html` in a web browser or use a local server:

```bash
python -m http.server 8000
# or
npx serve
```

## File Structure

```
dr-fadil-profile/
├── index.html          # Main portfolio page
├── manifest.json       # PWA manifest
├── sw.js              # Service worker for offline support
├── robots.txt         # Search engine directives
├── sitemap.xml        # Sitemap for SEO
├── _headers           # Cloudflare Pages security headers
├── README.md          # This file
└── .github/
    └── workflows/
        └── deploy.yml # GitHub Actions deployment
```

## Security Features

- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict Transport Security (HSTS)
- Referrer Policy
- Permissions Policy

## Performance Features

- DNS Prefetch for external resources
- Font preconnect optimization
- Service Worker caching strategy
- Proper cache headers for static assets
- Minimal JavaScript footprint

## Future Enhancements

- Complete Arabic translation
- Dark/Light theme toggle
- Blog integration
- Dynamic project loading
- Contact form integration

## License

© 2025 Dr. Mohamed El Fadil | BrainSAIT | All Rights Reserved