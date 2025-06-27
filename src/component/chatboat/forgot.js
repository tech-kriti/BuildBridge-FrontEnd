import React, { useState } from 'react';
import axios from 'axios';
import './forgot.css';
import { useNavigate } from 'react-router-dom';
import Apis from '../Apis';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(Apis.Forgot_Password, { email }); // use your correct endpoint
      localStorage.setItem('resetEmail', email); // save email temporarily
      navigate('/verify-otp');
    } catch (err) {
      alert(err.response.data.message || 'Failed to send OTP');
    }
  };

  return (
    <div className="forgot-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} className="forgot-form">
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send OTP</button>
      </form>
    </div>
  );
};

export default ForgotPassword;