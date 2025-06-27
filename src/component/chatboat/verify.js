import React, { useState } from 'react';
import axios from 'axios';
import './forgot.css';
import { useNavigate } from 'react-router-dom';
import Apis from '../Apis';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem('resetEmail');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(Apis.VerifyOtp, { email, otp });
      navigate('/reset-password');
    } catch (err) {
      alert(err.response.data.message || 'Invalid OTP');
    }
  };

  return (
    <div className="forgot-container">
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit} className="forgot-form">
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default VerifyOtp;
