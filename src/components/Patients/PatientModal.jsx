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

  useEffect(() => {
    if (isOpen) {
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

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  const renderInput = (label, field, type = 'text', required = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}{required && ' *'}
      </label>
      <input
        type={type}
        value={formData[field]}
        onChange={handleChange(field)}
        required={required}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none 
          focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
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
          {renderInput('Full Name', 'name', 'text', true)}
          {renderInput('Date of Birth', 'dob', 'date', true)}
          {renderInput('Contact Number', 'contact', 'tel', true)}
          {renderInput('Email Address', 'email', 'email', true)}
          {renderTextarea('Address', 'address', 2)}
          {renderInput('Emergency Contact', 'emergencyContact', 'tel')}
          {renderTextarea('Health Information', 'healthInfo', 3, 'Allergies, medical conditions, medications, etc.')}

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