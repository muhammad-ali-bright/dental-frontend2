# Dental Center Management Dashboard

A comprehensive dental center management system built with React, JaavaScript, and Tailwind CSS. This application provides role-based access for administrators (dentists) and patients, with complete appointment management, patient records, and file handling capabilities.

## Features

### Admin Features
- **Dashboard**: Overview of practice statistics, upcoming appointments, and key metrics
- **Patient Management**: Add, edit, delete, and view patient records with comprehensive health information
- **Appointment Management**: Schedule, modify, and track appointments with treatment details
- **Calendar View**: Monthly calendar interface showing all scheduled appointments
- **File Management**: Upload and manage treatment files, invoices, and medical records

### Patient Features
- **Personal Dashboard**: Overview of upcoming appointments and treatment history
- **Appointment History**: View past and upcoming appointments with detailed information
- **Document Access**: Download and view treatment files and medical records
- **Treatment Timeline**: Track treatment progress and costs

### Core Functionality
- **Authentication**: Secure login system with role-based access control
- **Data Persistence**: All data stored in localStorage for demo purposes
- **Responsive Design**: Fully responsive across all device sizes
- **File Upload**: Support for PDF, images, and document uploads with base64 storage
- **Search & Filter**: Advanced search and filtering capabilities across all data

## Technology Stack

- **Frontend**: React 18 with JavaScript
- **Styling**: Tailwind CSS for modern, responsive design
- **Routing**: React Router DOM for navigation
- **Icons**: Lucide React for consistent iconography
- **Build Tool**: Vite for fast development and building

##  Project Structure

```
src/
├── components/
│   ├── Auth/                 # Authentication components
│   ├── Layout/               # Layout components (Navbar, Layout)
│   ├── Dashboard/            # Dashboard-specific components
│   ├── Patients/             # Patient management components
│   ├── Appointments/         # Appointment management components
│   └── Calendar/             # Calendar view components
├── contexts/
│   ├── AuthContext.jsx       # Authentication state management
│   └── DataContext.jsx       # Data management (patients, appointments)
├── pages/
│   ├── LoginPage.jsx         # Login page
│   ├── DashboardPage.jsx     # Admin dashboard
│   ├── PatientsPage.jsx      # Patient management
│   ├── AppointmentsPage.jsx  # Appointment management
│   ├── CalendarPage.jsx      # Calendar view
│   ├── PatientDashboardPage.jsx     # Patient dashboard
│   └── PatientAppointmentsPage.jsx  # Patient appointments view
├── types/
│   └── index.js              # JavaScript type definitions
├── utils/
│   ├── storage.js            # localStorage utilities
│   ├── dateUtils.js          # Date formatting utilities
│   └── fileUtils.js          # File handling utilities
└── App.jsx                   # Main application component
```

##  Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dental-center-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

##  Demo Accounts

### Admin Account (Dentist)
- **Email**: admin@entnt.in
- **Password**: admin123
- **Access**: Full system access including patient management, appointments, and calendar

### Patient Account
- **Email**: john@entnt.in
- **Password**: patient123
- **Access**: Personal dashboard and appointment history

##  Architecture & Design Decisions

### State Management
- **Separation of Concerns**: AuthContext for authentication, DataContext for application data
- **Persistent Storage**: localStorage for data persistence across browser sessions

### Component Architecture
- **Modular Design**: Each component has a single responsibility
- **Reusable Components**: Shared components for consistency (StatsCard, Modal components)
- **Page-Level Components**: Each route has its own page component for clear separation

### Data Structure
- **Normalized Data**: Separate entities for users, patients, and incidents
- **Relational Links**: Proper foreign key relationships between entities
- **File Storage**: Base64 encoding for file storage in localStorage

### Security Considerations
- **Role-Based Access**: Different interfaces and permissions for Admin vs Patient roles
- **Route Protection**: Protected routes prevent unauthorized access
- **Data Isolation**: Patients can only access their own data

##  Design Philosophy

- **Clean & Professional**: Medical-grade interface design
- **Accessibility**: Proper contrast ratios, keyboard navigation support
- **Responsive**: Mobile-first approach with tablet and desktop optimizations
- **User Experience**: Intuitive navigation and clear information hierarchy

##  Data Models

### User
```javascript
interface User {
  id: string;
  role: 'Admin' | 'Patient';
  email: string;
  password: string;
  patientId?: string;
  name?: string;
}
```

### Patient
```javascript
interface Patient {
  id: string;
  name: string;
  dob: string;
  contact: string;
  email: string;
  healthInfo: string;
  address?: string;
  emergencyContact?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Incident (Appointment)
```javascript
interface Incident {
  id: string;
  patientId: string;
  title: string;
  description: string;
  comments: string;
  appointmentDate: string;
  cost?: number;
  treatment?: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  nextAppointmentDate?: string;
  files: FileAttachment[];
  createdAt: string;
  updatedAt: string;
}
```

##  Future Enhancements

- **Print Functionality**: Generate printable reports and invoices
- **Email Notifications**: Appointment reminders and confirmations
- **Advanced Analytics**: Detailed practice analytics and reporting
- **Multi-location Support**: Support for multiple clinic locations
- **Insurance Integration**: Insurance claim management
- **Backup & Restore**: Data backup and restoration capabilities

##  Deployment

The application is ready for deployment on platforms like:
- **Netlify**: Static hosting with automatic deployments
- **Website Link**: https://entnt-dentalcaremanagement.netlify.app/

##  Mobile Responsiveness

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

##  Testing

The application includes comprehensive error handling and input validation:
- **Form Validation**: All forms include proper validation
- **Error Boundaries**: Graceful error handling
- **User Feedback**: Clear success and error messages
