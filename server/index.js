const { createServer } = require('node:http');
const { createYoga, createSchema } = require('graphql-yoga');

/**
 * GraphQL Yoga Server for Dr. Fadil's Healthcare Profile
 * Provides API endpoints for medical services, contact, and professional information
 */

const yoga = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      type Query {
        # Professional Information
        profile: DoctorProfile!
        services: [MedicalService!]!
        specializations: [Specialization!]!
        
        # Contact and Appointment
        contactInfo: ContactInfo!
        availableSlots(date: String!): [TimeSlot!]!
        
        # Health and Innovation
        innovations: [Innovation!]!
        publications: [Publication!]!
        
        # General Health Query
        healthTip: String!
      }
      
      type Mutation {
        # Contact and Appointment
        submitContactForm(input: ContactFormInput!): ContactFormResponse!
        requestAppointment(input: AppointmentInput!): AppointmentResponse!
        
        # Newsletter and Updates
        subscribeNewsletter(email: String!): SubscriptionResponse!
      }
      
      # Core Types
      type DoctorProfile {
        name: String!
        title: String!
        specializations: [String!]!
        bio: String!
        experience: Int!
        education: [Education!]!
        certifications: [String!]!
        languages: [String!]!
      }
      
      type MedicalService {
        id: ID!
        name: String!
        description: String!
        duration: Int!
        category: ServiceCategory!
        isAvailable: Boolean!
      }
      
      type Specialization {
        id: ID!
        name: String!
        description: String!
        experience: Int!
      }
      
      type ContactInfo {
        email: String!
        phone: String!
        address: String!
        clinicHours: [ClinicHours!]!
        emergencyContact: String!
      }
      
      type TimeSlot {
        time: String!
        available: Boolean!
        duration: Int!
      }
      
      type Innovation {
        id: ID!
        title: String!
        description: String!
        category: String!
        date: String!
        link: String
      }
      
      type Publication {
        id: ID!
        title: String!
        journal: String!
        date: String!
        authors: [String!]!
        abstract: String!
        link: String
      }
      
      type Education {
        degree: String!
        institution: String!
        year: Int!
        location: String!
      }
      
      type ClinicHours {
        day: String!
        openTime: String!
        closeTime: String!
        isOpen: Boolean!
      }
      
      # Input Types
      input ContactFormInput {
        name: String!
        email: String!
        subject: String!
        message: String!
        isUrgent: Boolean = false
      }
      
      input AppointmentInput {
        name: String!
        email: String!
        phone: String!
        preferredDate: String!
        preferredTime: String!
        serviceType: String!
        reason: String!
      }
      
      # Response Types
      type ContactFormResponse {
        success: Boolean!
        message: String!
        referenceId: String
      }
      
      type AppointmentResponse {
        success: Boolean!
        message: String!
        appointmentId: String
        confirmationSent: Boolean!
      }
      
      type SubscriptionResponse {
        success: Boolean!
        message: String!
      }
      
      # Enums
      enum ServiceCategory {
        CONSULTATION
        DIAGNOSTIC
        TREATMENT
        INNOVATION
        RESEARCH
      }
    `,
    resolvers: {
      Query: {
        profile: () => ({
          name: "Dr. Mohamed El Fadil",
          title: "Physician & Healthcare Technology Innovator",
          specializations: ["Family Medicine", "Healthcare AI", "Medical Innovation", "Digital Health"],
          bio: "Leading healthcare technology innovator dedicated to transforming medical practice through AI and digital solutions. Founder of BrainSAIT platform, specializing in intelligent healthcare systems.",
          experience: 15,
          education: [
            {
              degree: "Doctor of Medicine (MD)",
              institution: "University of Medical Sciences",
              year: 2008,
              location: "Sudan"
            },
            {
              degree: "Master in Healthcare Technology",
              institution: "International Institute of Technology",
              year: 2015,
              location: "Online"
            }
          ],
          certifications: [
            "Board Certified Family Physician",
            "Healthcare AI Specialist",
            "Digital Health Innovation Certificate",
            "Medical Device Development"
          ],
          languages: ["Arabic", "English", "French"]
        }),
        
        services: () => [
          {
            id: "1",
            name: "General Consultation",
            description: "Comprehensive medical consultation and health assessment",
            duration: 45,
            category: "CONSULTATION",
            isAvailable: true
          },
          {
            id: "2", 
            name: "AI-Powered Diagnostic",
            description: "Advanced diagnostic using artificial intelligence tools",
            duration: 60,
            category: "DIAGNOSTIC",
            isAvailable: true
          },
          {
            id: "3",
            name: "Healthcare Innovation Consulting",
            description: "Consulting for healthcare technology development",
            duration: 90,
            category: "INNOVATION",
            isAvailable: true
          },
          {
            id: "4",
            name: "Telemedicine Consultation",
            description: "Remote medical consultation via secure video call",
            duration: 30,
            category: "CONSULTATION",
            isAvailable: true
          }
        ],
        
        specializations: () => [
          {
            id: "1",
            name: "Family Medicine",
            description: "Comprehensive primary care for patients of all ages",
            experience: 15
          },
          {
            id: "2",
            name: "Healthcare AI",
            description: "Artificial intelligence applications in medical practice",
            experience: 8
          },
          {
            id: "3",
            name: "Digital Health",
            description: "Digital transformation of healthcare delivery",
            experience: 10
          }
        ],
        
        contactInfo: () => ({
          email: "contact@brainsait.io",
          phone: "+1-555-MEDICAL",
          address: "BrainSAIT Healthcare Innovation Center",
          clinicHours: [
            { day: "Monday", openTime: "09:00", closeTime: "17:00", isOpen: true },
            { day: "Tuesday", openTime: "09:00", closeTime: "17:00", isOpen: true },
            { day: "Wednesday", openTime: "09:00", closeTime: "17:00", isOpen: true },
            { day: "Thursday", openTime: "09:00", closeTime: "17:00", isOpen: true },
            { day: "Friday", openTime: "09:00", closeTime: "15:00", isOpen: true },
            { day: "Saturday", openTime: "10:00", closeTime: "14:00", isOpen: true },
            { day: "Sunday", openTime: "00:00", closeTime: "00:00", isOpen: false }
          ],
          emergencyContact: "Emergency: +1-555-URGENT"
        }),
        
        availableSlots: (_, { date }) => {
          // Simple mock data - in real implementation, this would check actual availability
          const slots = [];
          for (let hour = 9; hour <= 16; hour++) {
            slots.push({
              time: `${hour.toString().padStart(2, '0')}:00`,
              available: Math.random() > 0.3, // Random availability for demo
              duration: 45
            });
          }
          return slots;
        },
        
        innovations: () => [
          {
            id: "1",
            title: "BrainSAIT AI Diagnostic Platform",
            description: "Revolutionary AI-powered diagnostic system for early disease detection",
            category: "Artificial Intelligence",
            date: "2024-01-15",
            link: "https://brainsait.io/innovations/ai-diagnostic"
          },
          {
            id: "2",
            title: "Telemedicine Integration System",
            description: "Seamless telemedicine platform for remote patient care",
            category: "Digital Health",
            date: "2023-11-20",
            link: "https://brainsait.io/innovations/telemedicine"
          },
          {
            id: "3",
            title: "Medical IoT Monitoring",
            description: "Internet of Things solutions for continuous patient monitoring",
            category: "IoT Healthcare",
            date: "2023-08-10",
            link: "https://brainsait.io/innovations/iot-monitoring"
          }
        ],
        
        publications: () => [
          {
            id: "1",
            title: "AI in Primary Care: Transforming Healthcare Delivery",
            journal: "Journal of Medical Innovation",
            date: "2024-03-15",
            authors: ["Dr. Mohamed El Fadil", "Dr. Sarah Johnson"],
            abstract: "Comprehensive study on the integration of artificial intelligence in primary healthcare settings...",
            link: "https://journals.medical-innovation.org/ai-primary-care"
          },
          {
            id: "2",
            title: "Digital Health Transformation in Developing Countries",
            journal: "Global Health Technology Review",
            date: "2023-12-05",
            authors: ["Dr. Mohamed El Fadil"],
            abstract: "Analysis of digital health implementation challenges and solutions in resource-limited settings...",
            link: "https://global-health-tech.org/digital-transformation"
          }
        ],
        
        healthTip: () => {
          const tips = [
            "Stay hydrated - drink at least 8 glasses of water daily for optimal health.",
            "Regular exercise for 30 minutes daily can reduce risk of chronic diseases by 50%.",
            "Adequate sleep (7-8 hours) is crucial for immune system function and mental health.",
            "Include colorful fruits and vegetables in your diet for essential vitamins and antioxidants.",
            "Practice stress management techniques like meditation or deep breathing exercises.",
            "Schedule regular health checkups - prevention is better than cure.",
            "Maintain good hygiene habits to prevent infections and stay healthy."
          ];
          return tips[Math.floor(Math.random() * tips.length)];
        }
      },
      
      Mutation: {
        submitContactForm: (_, { input }) => {
          // In real implementation, this would process the form and send notifications
          console.log('Contact form submitted:', input);
          return {
            success: true,
            message: "Thank you for your message. Dr. Fadil will respond within 24 hours.",
            referenceId: `REF-${Date.now()}`
          };
        },
        
        requestAppointment: (_, { input }) => {
          // In real implementation, this would integrate with scheduling system
          console.log('Appointment requested:', input);
          return {
            success: true,
            message: "Appointment request received. You will receive confirmation within 2 hours.",
            appointmentId: `APT-${Date.now()}`,
            confirmationSent: true
          };
        },
        
        subscribeNewsletter: (_, { email }) => {
          // In real implementation, this would add to mailing list
          console.log('Newsletter subscription:', email);
          return {
            success: true,
            message: "Successfully subscribed to Dr. Fadil's healthcare innovation newsletter."
          };
        }
      }
    }
  }),
  graphiql: {
    title: 'Dr. Fadil Healthcare API',
    defaultQuery: /* GraphQL */ `
      # Welcome to Dr. Fadil's Healthcare API
      # Try these example queries:
      
      query GetDoctorProfile {
        profile {
          name
          title
          specializations
          bio
          experience
        }
      }
      
      query GetServices {
        services {
          name
          description
          duration
          category
          isAvailable
        }
      }
      
      query GetHealthTip {
        healthTip
      }
    `,
  },
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://thefadil.site', 'https://dr-fadil-profile.pages.dev']
      : true,
    credentials: true
  }
});

const server = createServer(yoga);

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`🚀 Dr. Fadil's Healthcare GraphQL API running on http://localhost:${port}${yoga.graphqlEndpoint}`);
  console.log(`📊 GraphiQL interface available at http://localhost:${port}${yoga.graphqlEndpoint}`);
  console.log(`🏥 Healthcare innovation API ready!`);
});

module.exports = { yoga, server };