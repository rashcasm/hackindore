// Login Component
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'user', // Default user type
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting login data:", formData); // Add logging
      const response = await axios.post('http://localhost:5000/login', formData);
      console.log("Response:", response); // Add logging
      alert(response.data.message);
      
      // Redirect based on user type
      if (response.data.user.userType === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/admin';
      }
    } catch (error) {
      console.error("Error logging in user:", error); // Add logging
      alert('Error logging in user');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select
          name="userType"
          value={formData.userType}
          onChange={handleChange}
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;