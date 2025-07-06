const STORAGE_KEYS = {
  USERS: 'dental_users',
  PATIENTS: 'dental_patients',
  INCIDENTS: 'dental_incidents',
  CURRENT_USER: 'dental_current_user',
};

// Initialize default data if not exists
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultUsers = [
      { 
        id: '1', 
        role: 'Admin', 
        email: 'admin@entnt.in', 
        password: 'admin123',
        name: 'Dr. Smith'
      },
      { 
        id: '2', 
        role: 'Patient', 
        email: 'john@entnt.in', 
        password: 'patient123', 
        patientId: 'p1',
        name: 'John Doe'
      },
      { 
        id: '3', 
        role: 'Patient', 
        email: 'jane@entnt.in', 
        password: 'patient123', 
        patientId: 'p2',
        name: 'Jane Smith'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    const defaultPatients = [
      {
        id: 'p1',
        name: 'John Doe',
        dob: '1990-05-10',
        contact: '1234567890',
        email: 'john@entnt.in',
        healthInfo: 'No known allergies. History of dental anxiety.',
        address: '123 Main St, City, State 12345',
        emergencyContact: '0987654321',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'p2',
        name: 'Jane Smith',
        dob: '1985-08-22',
        contact: '2345678901',
        email: 'jane@entnt.in',
        healthInfo: 'Allergic to penicillin. Regular dental checkups.',
        address: '456 Oak Ave, City, State 12345',
        emergencyContact: '1987654321',
        createdAt: '2024-01-20T14:30:00Z',
        updatedAt: '2024-01-20T14:30:00Z'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(defaultPatients));
  }

  if (!localStorage.getItem(STORAGE_KEYS.INCIDENTS)) {
    const defaultIncidents = [
      {
        id: 'i1',
        patientId: 'p1',
        title: 'Routine Cleaning',
        description: 'Regular dental cleaning and checkup',
        comments: 'Patient reports no pain or discomfort',
        appointmentDate: '2025-01-25T10:00:00Z',
        cost: 120,
        treatment: 'Dental prophylaxis, fluoride treatment',
        status: 'Scheduled',
        files: [],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'i2',
        patientId: 'p1',
        title: 'Toothache Treatment',
        description: 'Upper molar pain, sensitivity to cold',
        comments: 'Cavity detected, filling required',
        appointmentDate: '2024-12-15T14:00:00Z',
        cost: 180,
        treatment: 'Composite filling, local anesthesia',
        status: 'Completed',
        nextAppointmentDate: '2025-03-15T14:00:00Z',
        files: [],
        createdAt: '2024-12-10T09:00:00Z',
        updatedAt: '2024-12-15T15:00:00Z'
      },
      {
        id: 'i3',
        patientId: 'p2',
        title: 'Teeth Whitening',
        description: 'Professional teeth whitening treatment',
        comments: 'Patient wants brighter smile for wedding',
        appointmentDate: '2025-01-30T11:00:00Z',
        cost: 250,
        status: 'Scheduled',
        files: [],
        createdAt: '2024-01-20T14:30:00Z',
        updatedAt: '2024-01-20T14:30:00Z'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(defaultIncidents));
  }
};

export const getUsers = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
};

export const getPatients = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]');
};

export const savePatients = (patients) => {
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
};

export const getIncidents = () => {
  initializeData();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.INCIDENTS) || '[]');
};

export const saveIncidents = (incidents) => {
  localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};