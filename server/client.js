/**
 * GraphQL API Client for Dr. Fadil's Healthcare Profile
 * Frontend integration utilities for the static site
 */

class HealthcareGraphQLClient {
  constructor(endpoint = '/graphql') {
    this.endpoint = endpoint;
    this.baseUrl = window.location.origin;
  }

  /**
   * Execute GraphQL query or mutation
   */
  async execute(query, variables = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors.map(e => e.message).join(', '));
      }

      return result.data;
    } catch (error) {
      console.error('GraphQL request failed:', error);
      throw error;
    }
  }

  /**
   * Get complete doctor profile
   */
  async getDoctorProfile() {
    const query = `
      query GetDoctorProfile {
        profile {
          name
          title
          specializations
          bio
          experience
          education {
            degree
            institution
            year
            location
          }
          certifications
          languages
        }
      }
    `;
    
    const data = await this.execute(query);
    return data.profile;
  }

  /**
   * Get available medical services
   */
  async getMedicalServices() {
    const query = `
      query GetServices {
        services {
          id
          name
          description
          duration
          category
          isAvailable
        }
      }
    `;
    
    const data = await this.execute(query);
    return data.services;
  }

  /**
   * Get contact information and clinic hours
   */
  async getContactInfo() {
    const query = `
      query GetContactInfo {
        contactInfo {
          email
          phone
          address
          clinicHours {
            day
            openTime
            closeTime
            isOpen
          }
          emergencyContact
        }
      }
    `;
    
    const data = await this.execute(query);
    return data.contactInfo;
  }

  /**
   * Get available appointment slots for a specific date
   */
  async getAvailableSlots(date) {
    const query = `
      query GetAvailableSlots($date: String!) {
        availableSlots(date: $date) {
          time
          available
          duration
        }
      }
    `;
    
    const data = await this.execute(query, { date });
    return data.availableSlots;
  }

  /**
   * Get healthcare innovations
   */
  async getInnovations() {
    const query = `
      query GetInnovations {
        innovations {
          id
          title
          description
          category
          date
          link
        }
      }
    `;
    
    const data = await this.execute(query);
    return data.innovations;
  }

  /**
   * Get research publications
   */
  async getPublications() {
    const query = `
      query GetPublications {
        publications {
          id
          title
          journal
          date
          authors
          abstract
          link
        }
      }
    `;
    
    const data = await this.execute(query);
    return data.publications;
  }

  /**
   * Get a random health tip
   */
  async getHealthTip() {
    const query = `
      query GetHealthTip {
        healthTip
      }
    `;
    
    const data = await this.execute(query);
    return data.healthTip;
  }

  /**
   * Submit contact form
   */
  async submitContactForm(formData) {
    const mutation = `
      mutation SubmitContactForm($input: ContactFormInput!) {
        submitContactForm(input: $input) {
          success
          message
          referenceId
        }
      }
    `;
    
    const data = await this.execute(mutation, { input: formData });
    return data.submitContactForm;
  }

  /**
   * Request appointment
   */
  async requestAppointment(appointmentData) {
    const mutation = `
      mutation RequestAppointment($input: AppointmentInput!) {
        requestAppointment(input: $input) {
          success
          message
          appointmentId
          confirmationSent
        }
      }
    `;
    
    const data = await this.execute(mutation, { input: appointmentData });
    return data.requestAppointment;
  }

  /**
   * Subscribe to newsletter
   */
  async subscribeNewsletter(email) {
    const mutation = `
      mutation SubscribeNewsletter($email: String!) {
        subscribeNewsletter(email: $email) {
          success
          message
        }
      }
    `;
    
    const data = await this.execute(mutation, { email });
    return data.subscribeNewsletter;
  }
}

/**
 * Healthcare API Helper Functions
 */
class HealthcareAPIHelpers {
  constructor(client) {
    this.client = client || new HealthcareGraphQLClient();
  }

  /**
   * Load and display doctor profile on page
   */
  async loadProfileSection() {
    try {
      const profile = await this.client.getDoctorProfile();
      
      // Update profile section if it exists
      const profileSection = document.querySelector('#doctor-profile');
      if (profileSection) {
        profileSection.innerHTML = `
          <h2>${profile.name}</h2>
          <h3>${profile.title}</h3>
          <p class="bio">${profile.bio}</p>
          <div class="specializations">
            <h4>Specializations:</h4>
            <ul>
              ${profile.specializations.map(spec => `<li>${spec}</li>`).join('')}
            </ul>
          </div>
          <div class="experience">
            <p><strong>Experience:</strong> ${profile.experience} years</p>
          </div>
        `;
      }
      
      return profile;
    } catch (error) {
      console.error('Failed to load profile:', error);
      this.showError('Unable to load doctor profile at this time.');
    }
  }

  /**
   * Load and display medical services
   */
  async loadServicesSection() {
    try {
      const services = await this.client.getMedicalServices();
      
      const servicesSection = document.querySelector('#medical-services');
      if (servicesSection) {
        servicesSection.innerHTML = `
          <h3>Medical Services</h3>
          <div class="services-grid">
            ${services.map(service => `
              <div class="service-card ${service.isAvailable ? 'available' : 'unavailable'}">
                <h4>${service.name}</h4>
                <p>${service.description}</p>
                <div class="service-details">
                  <span class="duration">${service.duration} minutes</span>
                  <span class="category">${service.category}</span>
                  <span class="availability">${service.isAvailable ? 'Available' : 'Not Available'}</span>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
      
      return services;
    } catch (error) {
      console.error('Failed to load services:', error);
      this.showError('Unable to load medical services at this time.');
    }
  }

  /**
   * Enhance contact form with GraphQL submission
   */
  enhanceContactForm() {
    const contactForm = document.querySelector('#contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject') || 'General Inquiry',
        message: formData.get('message'),
        isUrgent: formData.get('urgent') === 'on'
      };

      try {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        const result = await this.client.submitContactForm(contactData);
        
        if (result.success) {
          this.showSuccess(`Message sent successfully! Reference: ${result.referenceId}`);
          contactForm.reset();
        } else {
          this.showError(result.message || 'Failed to send message');
        }
      } catch (error) {
        console.error('Contact form submission failed:', error);
        this.showError('Unable to send message at this time. Please try again later.');
      } finally {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
      }
    });
  }

  /**
   * Load daily health tip
   */
  async loadHealthTip() {
    try {
      const tip = await this.client.getHealthTip();
      
      const tipElement = document.querySelector('#health-tip');
      if (tipElement) {
        tipElement.innerHTML = `
          <div class="health-tip-card">
            <h4>💡 Daily Health Tip</h4>
            <p>${tip}</p>
          </div>
        `;
      }
      
      return tip;
    } catch (error) {
      console.error('Failed to load health tip:', error);
    }
  }

  /**
   * Show success message
   */
  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  /**
   * Show error message
   */
  showError(message) {
    this.showNotification(message, 'error');
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      z-index: 10000;
      max-width: 400px;
      background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
    
    // Allow manual dismissal
    notification.addEventListener('click', () => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    });
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeHealthcareAPI();
  });
} else {
  initializeHealthcareAPI();
}

function initializeHealthcareAPI() {
  // Only initialize if we're on the main site (not in GraphiQL)
  if (!window.location.pathname.includes('/graphql')) {
    const client = new HealthcareGraphQLClient();
    const helpers = new HealthcareAPIHelpers(client);
    
    // Make available globally
    window.HealthcareAPI = {
      client,
      helpers
    };
    
    // Auto-enhance the page
    helpers.loadProfileSection();
    helpers.loadServicesSection();
    helpers.enhanceContactForm();
    helpers.loadHealthTip();
    
    console.log('🏥 Healthcare GraphQL API initialized');
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HealthcareGraphQLClient, HealthcareAPIHelpers };
}