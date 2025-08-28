# GraphQL API Integration for Dr. Fadil's Healthcare Profile

## Overview

This project now includes a GraphQL API powered by GraphQL Yoga, providing programmatic access to Dr. Fadil's healthcare services, professional information, and innovation portfolio.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Start the GraphQL Server
```bash
npm run dev
# or
npm start
```

The GraphQL API will be available at: `http://localhost:4000/graphql`

### GraphiQL Interface
Access the interactive GraphQL playground at: `http://localhost:4000/graphql`

## 📋 API Schema

### Queries Available

#### Professional Information
- `profile` - Complete doctor profile information
- `services` - Available medical services
- `specializations` - Areas of medical expertise
- `innovations` - Healthcare technology innovations
- `publications` - Medical research publications

#### Contact & Scheduling
- `contactInfo` - Contact details and clinic hours
- `availableSlots(date: String!)` - Available appointment slots

#### Health Information
- `healthTip` - Random health tip

### Mutations Available

#### Contact & Appointments
- `submitContactForm(input: ContactFormInput!)` - Submit contact form
- `requestAppointment(input: AppointmentInput!)` - Request medical appointment
- `subscribeNewsletter(email: String!)` - Subscribe to healthcare newsletter

## 🔍 Example Queries

### Get Doctor Profile
```graphql
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
    }
    certifications
    languages
  }
}
```

### Get Available Services
```graphql
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
```

### Submit Contact Form
```graphql
mutation SubmitContact {
  submitContactForm(input: {
    name: "John Doe"
    email: "john@example.com"
    subject: "General Inquiry"
    message: "I would like to learn more about your AI diagnostic services."
    isUrgent: false
  }) {
    success
    message
    referenceId
  }
}
```

### Request Appointment
```graphql
mutation RequestAppointment {
  requestAppointment(input: {
    name: "Jane Smith"
    email: "jane@example.com"
    phone: "+1-555-0123"
    preferredDate: "2024-02-15"
    preferredTime: "10:00"
    serviceType: "General Consultation"
    reason: "Regular checkup"
  }) {
    success
    message
    appointmentId
    confirmationSent
  }
}
```

### Check Available Slots
```graphql
query GetAvailableSlots {
  availableSlots(date: "2024-02-15") {
    time
    available
    duration
  }
}
```

## 🏥 Healthcare-Specific Features

### Medical Services Categories
- `CONSULTATION` - General and specialized consultations
- `DIAGNOSTIC` - AI-powered diagnostic services
- `TREATMENT` - Treatment planning and monitoring
- `INNOVATION` - Healthcare technology consulting
- `RESEARCH` - Medical research collaboration

### Professional Information
- Complete medical education history
- Board certifications and specializations
- Experience in healthcare innovation
- Published research and publications
- Healthcare technology innovations

### Contact & Scheduling
- Clinic hours and availability
- Emergency contact information
- Appointment scheduling system
- Contact form processing

## 🔧 Integration with Frontend

The GraphQL API is designed to integrate seamlessly with the existing static site. You can:

1. **Fetch dynamic content** using GraphQL queries from the frontend JavaScript
2. **Submit forms** using GraphQL mutations instead of traditional form submissions
3. **Display real-time information** like available appointment slots
4. **Show personalized content** based on user interactions

### Example Frontend Integration
```javascript
// Example: Fetch doctor profile in frontend
async function loadDoctorProfile() {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query GetProfile {
          profile {
            name
            title
            bio
            specializations
          }
        }
      `
    })
  });
  
  const data = await response.json();
  return data.data.profile;
}
```

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
The GraphQL server can be deployed alongside the static site:
```bash
npm start
```

### Environment Variables
- `PORT` - Server port (default: 4000)
- `NODE_ENV` - Environment (development/production)

## 🔒 CORS Configuration

The API is configured with CORS support for:
- Development: All origins allowed
- Production: Restricted to `thefadil.site` and `dr-fadil-profile.pages.dev`

## 📚 Healthcare Data Structure

The API provides structured access to:
- **Medical Services** with categories and availability
- **Professional Credentials** including certifications
- **Healthcare Innovations** with technology focus
- **Research Publications** with abstracts and links
- **Contact Information** with clinic hours
- **Appointment Scheduling** with time slot management

## 🤝 Contributing

When adding new healthcare-related features:
1. Follow medical data privacy best practices
2. Ensure HIPAA compliance considerations
3. Use appropriate medical terminology
4. Document new schema additions
5. Test thoroughly with healthcare use cases

## 📞 Support

For API support or healthcare technology inquiries:
- Email: contact@brainsait.io
- GraphQL Schema: Available via introspection
- Documentation: Built-in GraphiQL interface

---

**Dr. Mohamed El Fadil** - Physician & Healthcare Technology Innovator  
**BrainSAIT Healthcare Innovation Platform**