import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Apis from '../Apis';
import useAuth from '../../utils/Auth';
import styles from './UpdateProfile.module.css';

const UpdateProfile = () => {
  const { token,user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    github: '',
    linkedin: '',
    portfolio: '',
    location: '',
    contact_number: '',
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name ?? '',
        email: user.email ?? '',
        bio: user.bio ?? '',
        github: user.github ?? '',
        linkedin: user.linkedin ?? '',
        portfolio: user.portfolio ?? '',
        location: user.location ?? '',
        contact_number: user.contact_number ?? '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'profile_photo') setProfilePhoto(files[0]);
    if (name === 'resume') setResume(files[0]);
  };

  const validateInputs = () => {
    const phoneRegex = /^[0-9]{10}$/;
    const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*\/?$/;

    if (!formData.name.trim()) return 'Name is required';
    if (formData.contact_number && !phoneRegex.test(formData.contact_number))
      return 'Invalid phone number';
    if (formData.github && !urlRegex.test(formData.github))
      return 'Invalid GitHub URL';
    if (formData.linkedin && !urlRegex.test(formData.linkedin))
      return 'Invalid LinkedIn URL';
    if (formData.portfolio && !urlRegex.test(formData.portfolio))
      return 'Invalid Portfolio URL';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validateInputs();
    if (errorMsg) return setError(errorMsg);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (profilePhoto) data.append('profile_photo', profilePhoto);
    if (resume) data.append('resume', resume);

    try {
      const res = await axios.patch(Apis.Update_profile, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Profile updated successfully!');
      setError('');
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Update Your Profile</h2>
      {message && <p className={styles.success}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" />
        <input type="text" name="github" value={formData.github} onChange={handleChange} placeholder="GitHub Profile URL" />
        <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn URL" />
        <input type="text" name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="Portfolio URL" />
        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
        <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="10-digit Mobile Number" />
        <div className={styles.fileInputs}>
          <label>Upload Profile Photo:</label>
          <input type="file" name="profile_photo" onChange={handleFileChange} />
        </div>
        <div className={styles.fileInputs}>
          <label>Upload Resume:</label>
          <input type="file" name="resume" onChange={handleFileChange} />
        </div>
        <button type="submit" className={styles.submitBtn}>Update Profile</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
