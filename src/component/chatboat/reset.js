import React, { useState } from 'react';
import axios from 'axios';
import './forgot.css';
import { useNavigate } from 'react-router-dom';
import Apis from '../Apis';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem('resetEmail');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(Apis.Reset_password, { email, newPassword });
      alert('Password reset successfully');
      localStorage.removeItem('resetEmail');
      navigate('/login');
    } catch (err) {
      alert(err.response.data?.message || 'Failed to reset password');
    
    }
  };

  return (
    <div className="forgot-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit} className="forgot-form">
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Reset</button>
      </form>
    </div>
  );
};

export default ResetPassword;
