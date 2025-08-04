/**
 * BrainSAIT Dr. Fadil Profile - Main JavaScript
 * Modern ES6+ implementation with performance optimizations
 */

class BrainSAITApp {
  constructor() {
    this.config = {};
    this.isInitialized = false;
    this.modules = new Map();
    
    this.init();
  }
  
  async init() {
    try {
      await this.loadConfiguration();
      this.setupEventListeners();
      this.initializeModules();
      this.setupPerformanceOptimizations();
      
      this.isInitialized = true;
      this.dispatchEvent('app:initialized');
      
    } catch (error) {
      console.error('Failed to initialize BrainSAIT App:', error);
    }
  }
  
  async loadConfiguration() {
    // Load configuration from external file or API
    this.config = {
      emailService: {
        serviceId: 'service_brainsait',
        templateId: 'template_contact',
        publicKey: 'user_brainsait_public_key'
      },
      animations: {
        enabled: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        duration: 300
      },
      performance: {
        enableLazyLoading: true,
        enableServiceWorker: true
      }
    };
  }
  
  setupEventListeners() {
    // Intersection Observer for lazy loading
    if (this.config.performance.enableLazyLoading) {
      this.setupLazyLoading();
    }
    
    // Service Worker registration
    if (this.config.performance.enableServiceWorker && 'serviceWorker' in navigator) {
      this.registerServiceWorker();
    }
    
    // Form submission handling
    this.setupFormHandlers();
    
    // Navigation handling
    this.setupNavigationHandlers();
  }
  
  setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  async registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
  
  setupFormHandlers() {
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', this.handleFormSubmission.bind(this));
    }
  }
  
  async handleFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    try {
      // Here you would integrate with EmailJS or your email service
      await this.sendEmail(formData);
      
      this.showNotification('Message sent successfully!', 'success');
      form.reset();
      
    } catch (error) {
      this.showNotification('Failed to send message. Please try again.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
    }
  }
  
  async sendEmail(formData) {
    // EmailJS integration would go here
    // This is a placeholder for the actual implementation
    return new Promise((resolve) => {
      setTimeout(resolve, 1000); // Simulate API call
    });
  }
  
  setupNavigationHandlers() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
  
  setupPerformanceOptimizations() {
    // Debounced scroll handler for performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(() => {
        this.handleScroll();
      }, 16); // ~60fps
    }, { passive: true });
    
    // Preload critical resources
    this.preloadCriticalResources();
  }
  
  handleScroll() {
    const scrollTop = window.pageYOffset;
    // Add scroll-based animations or effects here
  }
  
  preloadCriticalResources() {
    // Preload critical CSS
    const criticalCSS = document.createElement('link');
    criticalCSS.rel = 'preload';
    criticalCSS.as = 'style';
    criticalCSS.href = '/src/assets/css/critical.css';
    document.head.appendChild(criticalCSS);
  }
  
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }
  
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new BrainSAITApp();
  });
} else {
  new BrainSAITApp();
}

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BrainSAITApp;
}
