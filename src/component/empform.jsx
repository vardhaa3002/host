

import React, { useState } from 'react';
import axios from 'axios';

const Frontend = () => {
  const [formData, setFormData] = useState({
    EmployeeID: '',
    Name: '',
    Email: '',
    PhoneNumber: '',
    Department: '',
    DateOfJoining: '',
    Role: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.EmployeeID || formData.EmployeeID.length > 10) newErrors.EmployeeID = 'Employee ID must be <= 10 characters';
    if (!formData.Email.includes('@')) newErrors.Email = 'Valid Email is required';
    if (formData.PhoneNumber.length !== 10) newErrors.PhoneNumber = 'Phone number must be 10 digits';
    if (!formData.Department) newErrors.Department = 'Department is required';
    if (!formData.DateOfJoining || new Date(formData.DateOfJoining) > new Date()) newErrors.DateOfJoining = 'Date cannot be in the future';
    if (!formData.Role) newErrors.Role = 'Role is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const res = await axios.post('http://localhost:5000/employees', formData);
        setMessage(res.data.message);
        setErrors({});
        setFormData({
          EmployeeID: '',
          Name: '',
          Email: '',
          PhoneNumber: '',
          Department: '',
          DateOfJoining: '',
          Role: '',
        });
      } catch (err) {
        setMessage(err.response?.data?.message || 'Submission failed');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-4"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center">Add Employee</h1>
        {message && <div className="text-green-500 text-center mb-2">{message}</div>}

        {/* Input fields */}
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label className="block mb-1 font-medium capitalize" htmlFor={key}>
              {key.replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              id={key}
              type={key === 'DateOfJoining' ? 'date' : 'text'}
              value={formData[key]}
              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${
                errors[key] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors[key] && <p className="text-red-500 text-sm mt-1">{errors[key]}</p>}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Frontend;