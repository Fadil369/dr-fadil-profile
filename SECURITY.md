# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| main    | ✔️                 |

## Security Features

### Content Security Policy (CSP)

The site implements a robust Content Security Policy to protect against XSS and code injection attacks:

- **script-src**: Allows scripts from self, LinkedIn Platform, CDN.jsdelivr.net, and CDNjs. Includes 'unsafe-inline' for inline event handlers (onclick, onchange, etc.)
- **style-src**: Allows styles from self, Google Fonts, and CDNjs with 'unsafe-inline' for inline styles
- **font-src**: Allows fonts from Google Fonts and CDNjs
- **img-src**: Allows images from any HTTPS source and data URIs
- **frame-src**: Restricts iframes to LinkedIn Platform only
- **default-src**: Defaults to 'self' for all other resource types

**Note on 'unsafe-inline'**: The site currently uses inline event handlers (e.g., `onclick="function()"`) for interactive features. Future improvements should migrate these to external event listeners to remove the need for 'unsafe-inline' and strengthen the CSP.

### Additional Security Headers

- **X-Frame-Options**: DENY - Prevents clickjacking attacks
- **X-Content-Type-Options**: nosniff - Prevents MIME type sniffing
- **X-XSS-Protection**: 1; mode=block - Legacy XSS protection
- **Strict-Transport-Security**: HTTPS enforcement with 1-year max-age
- **Referrer-Policy**: strict-origin-when-cross-origin - Protects user privacy
- **Permissions-Policy**: Restricts access to browser features

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please **do not create a public issue**. Instead, report it privately so we can address it promptly and responsibly.

**How to report:**
- Please email [security@brainsait.io] with details of the vulnerability.
- Include a description, steps to reproduce, and any relevant logs or screenshots.
- We will respond within 3 business days and work with you to resolve the issue quickly.

## Security Updates

- We will announce security fixes in the [Releases](../../releases) section and update this document if our policy changes.
- Please ensure your software is kept up to date for the latest security patches.

## Disclosure Policy

We request responsible disclosure:
- Please avoid publicly disclosing the vulnerability until we have addressed it.
- We will acknowledge your responsible disclosure if desired.

## Further Security Resources

- [GitHub Security Advisories](https://docs.github.com/en/code-security/security-advisories)
- [OpenSSF Best Practices](https://openssf.org/)

---

Thank you for helping keep this project and its users secure!
