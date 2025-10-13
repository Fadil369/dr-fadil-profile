# Accessibility Statement

## Overview

The Dr. Mohamed El Fadil portfolio website (thefadil.site) is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.

## Conformance Status

This website strives to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible for people with disabilities and user-friendly for everyone.

## Accessibility Features

### 1. Keyboard Navigation
- **Skip Link**: A "Skip to main content" link is provided at the top of the page, visible on keyboard focus
- **Focus Indicators**: All interactive elements have visible focus indicators (3px cyan outline with 2px offset)
- **Tab Order**: Logical tab order through all interactive elements
- **No Keyboard Traps**: Users can navigate through and away from all components using only the keyboard

### 2. Screen Reader Support
- **ARIA Labels**: All icon-only buttons have descriptive aria-label attributes
- **Decorative Icons**: All decorative Font Awesome icons have `aria-hidden="true"` (113 icons)
- **Semantic HTML**: Proper use of semantic elements (nav, main, section, article, header)
- **Language Declaration**: HTML lang attribute properly set and dynamically updated for EN/AR switching
- **Alternative Text**: Meaningful content conveyed through text alternatives

### 3. Visual Accessibility

#### Color Contrast
All text meets WCAG 2.1 Level AAA contrast requirements:
- Primary text (#ffffff) on dark background (#0a0a0f): 21:1 ratio ✓
- Secondary text (#e2e8f0) on dark background: 16:1 ratio ✓
- Muted text (#cbd5e1) on dark background: 12:1 ratio ✓
- Minimum requirement (WCAG AA): 4.5:1 for normal text, 3:1 for large text

#### Visual Preferences
- **High Contrast Mode**: Automatic adjustments when browser high contrast mode is detected
- **Reduced Motion**: Respects `prefers-reduced-motion` media query
  - Disables animations when user prefers reduced motion
  - Simplifies transitions to prevent vestibular issues
  - All animations set to 0.01ms duration when reduced motion is preferred

### 4. Responsive Design
- **Mobile-First**: Optimized for all screen sizes from 320px to 4K displays
- **Touch Targets**: Minimum 44×44px touch targets on mobile devices
- **Responsive Breakpoints**: 480px, 768px, 1200px
- **Viewport Configuration**: Proper meta viewport tag with user scaling allowed

### 5. Multilingual Support
- **Bilingual Interface**: Full English and Arabic language support
- **RTL Support**: Proper right-to-left layout for Arabic content
- **Language Switching**: Dynamic language attribute updates (`lang="en"` / `lang="ar"`)
- **Direction Switching**: Automatic `dir="ltr"` / `dir="rtl"` updates

### 6. Form Accessibility
- **Labels**: All form inputs have associated labels
- **Error Messages**: Clear error messages for form validation
- **Required Fields**: Properly marked with asterisks and ARIA attributes
- **Submission Feedback**: Clear confirmation messages

### 7. Structured Content
- **Heading Hierarchy**: Logical heading structure (H1 → H2 → H3)
- **Landmarks**: Proper ARIA landmark roles
- **Lists**: Semantic list markup for navigation and content lists
- **Links**: Descriptive link text that makes sense out of context

## Known Limitations

### Current Limitations
1. **Inline Event Handlers**: The site uses inline `onclick`, `onchange`, etc. handlers which require 'unsafe-inline' in the Content Security Policy. Future versions will migrate to external event listeners.
2. **Real-time Metrics**: The impact dashboard currently displays placeholder data (zeros). This will be updated with live API data in future releases.
3. **Automated Testing**: While manual accessibility testing has been performed, comprehensive automated testing with tools like Axe or WAVE is recommended.

## Compatibility

### Tested Browsers
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Safari (latest)
- Microsoft Edge (latest)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

### Screen Readers
The site has been designed to work with:
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

## Feedback

We welcome your feedback on the accessibility of this website. Please let us know if you encounter accessibility barriers:

- **Email**: brainsait@hotmail.com
- **GitHub Issues**: [Report an accessibility issue](https://github.com/Fadil369/dr-fadil-profile/issues)

We aim to respond to accessibility feedback within 3 business days.

## Technical Specifications

### Standards & Guidelines
- WCAG 2.1 Level AA
- ARIA 1.2 (where applicable)
- HTML5 semantic elements
- CSS3 media queries for accessibility

### Accessibility Testing Tools Used
- Manual keyboard testing
- Color contrast analyzers
- HTML validation (HTMLHint)
- Browser developer tools accessibility audits

## Continuous Improvement

We are continuously working to improve the accessibility of our website. Recent improvements include:
- Added aria-hidden to all decorative icons (October 2025)
- Enhanced Content Security Policy (October 2025)
- Added structured data for better search engine understanding (October 2025)
- Documented accessibility features (October 2025)

## Legal

This accessibility statement was created on October 13, 2025, and last updated on October 13, 2025.

---

**Last Updated**: October 13, 2025  
**Contact**: brainsait@hotmail.com  
**Website**: https://thefadil.site
