import React, { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { generateTimeOptions } from '../../utils/generateTimeOptions';

const AppointmentModal = ({ isOpen, onClose, onSave, patients, appointment, selectedSlot }) => {
  const timeOptions = useMemo(() => generateTimeOptions(), []);

  const [formData, setFormData] = useState({
    patientId: '',
    title: '',
    description: '',
    comments: '',
    date: '',
    startTime: '',
    endTime: '',
    cost: '',
    treatment: '',
    status: 'Scheduled',
    files: [],
  });

  useEffect(() => {
    if (appointment) {
      const apptDate = new Date(appointment.appointmentDate);
      const startTimeStr = apptDate.toLocaleTimeString('en-US', {
        hour: 'numeric', minute: '2-digit', hour12: true,
      });
      const endTimeStr = appointment.endTime
        ? new Date(appointment.endTime).toLocaleTimeString('en-US', {
          hour: 'numeric', minute: '2-digit', hour12: true,
        })
        : '';

      setFormData({
        patientId: appointment.patientId || '',
        title: appointment.title || '',
        description: appointment.description || '',
        comments: appointment.comments || '',
        date: apptDate.toISOString().slice(0, 10),
        startTime: startTimeStr,
        endTime: endTimeStr,
        cost: appointment.cost?.toString() || '',
        treatment: appointment.treatment || '',
        status: appointment.status || 'Scheduled',
        files: appointment.files || [],
      });
    } else if (selectedSlot) {
      
      const slotDateStr = selectedSlot.toISOString().slice(0, 10);
      const startTimeStr = selectedSlot.toLocaleTimeString('en-US', {
        hour: 'numeric', minute: '2-digit', hour12: true,
      });

      const index = timeOptions.indexOf(startTimeStr);
      const endTimeStr = timeOptions[index + 1] || '';

      setFormData(prev => ({
        ...prev,
        date: slotDateStr,
        startTime: startTimeStr,
        endTime: endTimeStr,
      }));
    } else {
      setFormData({
        patientId: '', title: '', description: '', comments: '',
        date: '', startTime: '', endTime: '', cost: '',
        treatment: '', status: 'Scheduled', files: [],
      });
    }
  }, [isOpen, selectedSlot, appointment, timeOptions]);

  const validateForm = () => {
    if (!formData.patientId || !formData.title || !formData.date || !formData.startTime || !formData.endTime) {
      toast.error('Please fill out all required fields.');
      return false;
    }
    const startIndex = timeOptions.indexOf(formData.startTime);
    const endIndex = timeOptions.indexOf(formData.endTime);
    if (endIndex <= startIndex) {
      toast.error('End time must be after start time.');
      return false;
    }
    if (formData.cost && parseFloat(formData.cost) < 0) {
      toast.error('Cost must be greater than or equal to $0.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSave({
      ...formData,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      cost: formData.cost ? parseFloat(formData.cost) : undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {appointment ? 'Edit Appointment' : 'Add Appointment'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Patient *</label>
              <select
                required
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
              >
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Title *"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
          />

          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description"
            rows={2}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
          />

          <textarea
            value={formData.comments}
            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            placeholder="Comments"
            rows={2}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
            />

            <div className="grid grid-cols-2 gap-2">
              <select
                required
                value={formData.startTime}
                onChange={(e) => {
                  const startTime = e.target.value;
                  const startIndex = timeOptions.indexOf(startTime);
                  const nextSlot = timeOptions[startIndex + 1] || '';
                  setFormData((prev) => ({ ...prev, startTime, endTime: nextSlot }));
                }}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
              >
                <option value="">Start Time</option>
                {timeOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <select
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
              >
                <option value="">End Time</option>
                {timeOptions.filter((_, i) => i > timeOptions.indexOf(formData.startTime)).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <input
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            placeholder="Cost (e.g., 100.00)"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
          />

          <input
            type="text"
            value={formData.treatment}
            onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
            placeholder="Treatment"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700"
          />

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 border rounded-md">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              {appointment ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
