import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const INITIAL_FORM_STATE = {
  name: '',
  dob: '',
  contact: '',
  email: '',
  healthInfo: '',
  address: '',
  emergencyContact: ''
};

const PatientModal = ({ isOpen, onClose, onSave, patient }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormErrors({});
      setFormData({
        name: patient?.name || '',
        dob: patient?.dob?.slice(0, 10) || '',
        contact: patient?.contact || '',
        email: patient?.email || '',
        healthInfo: patient?.healthInfo || '',
        address: patient?.address || '',
        emergencyContact: patient?.emergencyContact || ''
      });
    }
  }, [isOpen, patient]);

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.dob) errors.dob = 'Date of birth is required';

    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.dob)) {
      errors.dob = 'Date must be in YYYY-MM-DD format';
    }

    if (!formData.contact.trim()) errors.contact = 'Contact number is required';
    if (!/^\+?\d{7,15}$/.test(formData.contact.trim())) {
      errors.contact = 'Enter a valid phone number (7-15 digits)';

    }

    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Invalid email format';
    }

    if (formData.emergencyContact && !/^\+?\d{7,15}$/.test(formData.emergencyContact.trim())) {
      errors.emergencyContact = 'Invalid emergency contact number';
    }

    return errors;
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  const renderInput = (label, field, type = 'text', required = false, placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}{required && ' *'}
      </label>
      <input
        type={type}
        value={formData[field]}
        onChange={handleChange(field)}
        required={required}
        placeholder={placeholder}
        className={`w-full border rounded-md px-3 py-2 focus:outline-none 
        focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
        ${formErrors[field] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
      />
      {formErrors[field] && (
        <p className="mt-1 text-sm text-red-500">{formErrors[field]}</p>
      )}
    </div>
  );

  const renderTextarea = (label, field, rows = 3, placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <textarea
        rows={rows}
        placeholder={placeholder}
        value={formData[field]}
        onChange={handleChange(field)}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none 
          focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            {patient ? 'Edit Patient' : 'Add New Patient'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {renderInput('Full Name', 'name', 'text', true, 'e.g. John Doe')}
          {renderInput('Date of Birth', 'dob', 'date', true)}
          {renderInput('Contact Number', 'contact', 'tel', true, 'e.g. +1234567890')}
          {renderInput('Email Address', 'email', 'email', true, 'e.g. john@example.com')}
          {renderTextarea('Address', 'address', 2, 'Street, City, ZIP')}
          {renderInput('Emergency Contact', 'emergencyContact', 'tel', false, 'e.g. +1987654321')}
          {renderTextarea('Health Information', 'healthInfo', 3, 'Allergies, medical conditions, etc.')}

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 
              rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {patient ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientModal;