import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Viewprofile.module.css';
import { FaEdit, FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa';
import { MdLocationOn, MdEmail, MdPhone } from 'react-icons/md';
import useAuth from '../../utils/Auth';
import Apis from '../Apis';
import { useNavigate, useParams } from 'react-router-dom';

import { FaTools, FaGraduationCap, FaUniversity, FaFileAlt, FaCheckCircle, FaLink } from 'react-icons/fa';

function ViewProfile() {
  const [users, setUser] = useState(null);
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [educationList, setEducationList] = useState([]);
  const [skillList, setSkilllist] = useState([]);
  const { idd } = useParams();
  const id = user.userId || user.id;
  const userIdToFetch = idd || id;
  console.log(user)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${Apis.Get_profile}${userIdToFetch}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(res.data);
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };
    fetchUser();
    fetchEducation();
    fetchSkill();
  }, []);

  const fetchEducation = async () => {
    try {
      const res = await axios.get(`${Apis.Get_Eductaion}${userIdToFetch}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(res.data.education)
      setEducationList(res.data.education);

    } catch (err) {
      console.log("fetching education error", err);
    }
  }

  const fetchSkill = async () => {
    try {
      const res = await axios.get(`${Apis.Get_Skills}${userIdToFetch}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      setSkilllist(res.data.skills);


    } catch (err) {
      console.log("fetching skill error", err);
    }
  }


  if (!users) return <div className={styles.loading}>Loading profile...</div>;



  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.avatarBox}>
          <img
            src={
              users.profile_photo
                ? `https://buildbridge-bakend.onrender.com${users.profile_photo}`
                : `https://ui-avatars.com/api/?name=${users?.name}&background=random`
            }
            alt="avatar"
            className={styles.avatar}
          />
        </div>
        <div className={styles.info}>
          <div className={styles.nameRow}>
            <h2>{users.name}</h2>
          </div>
          <p className={styles.bio}>{users.bio || 'No bio available.'}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h3><MdEmail style={{ marginRight: '6px' }} /> Contact Info</h3>
        <p><MdEmail /> {users.email}</p>
        {users.contact_number && <p><MdPhone /> {users.contact_number}</p>}
        {users.location && <p><MdLocationOn /> {users.location}</p>}
      </div>

      <div className={styles.section}>
        <h3><FaLink style={{ marginRight: '6px' }} /> Social Links</h3>
        <div className={styles.links}>
          {users.github && (
            <a href={users.github} target="_blank" rel="noopener noreferrer">
              <FaGithub /> GitHub
            </a>
          )}
          {users.linkedin && (
            <a href={users.linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedin /> LinkedIn
            </a>
          )}
          {users.portfolio && (
            <a href={users.portfolio} target="_blank" rel="noopener noreferrer">
              <FaGlobe /> Portfolio
            </a>
          )}
        </div>
      </div>

      {users.resume && (
        <div className={styles.section}>
          <h3><FaFileAlt style={{ marginRight: '6px' }} /> Resume</h3>
          <a
            href={`https://buildbridge-bakend.onrender.com${users.resume?.replace(/\\/g, '/')}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.resumeBtn}
          >
            View Resume
          </a>
        </div>
      )}

      {skillList.length > 0 && (
        <div className={styles.section}>
          <h3><FaTools style={{ marginRight: '6px' }} /> Skills</h3>
          <div className={styles.cardGrid}>
            {skillList.map((skill) => (
              <div className={styles.card} key={skill.skillId}>
                <h4><FaCheckCircle style={{ marginRight: '6px', color: '#0073b1' }} /> {skill.skillName}</h4>
                <p>Proficiency: {skill.proficiencyLevel}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {educationList.length > 0 && (
        <div className={styles.section}>
          <h3><FaGraduationCap style={{ marginRight: '6px' }} /> Education</h3>
          <div className={styles.cardGrid}>
            {educationList.map((edu) => (
              <div className={styles.card} key={edu.educationId}>
                <h4><FaUniversity style={{ marginRight: '6px', color: '#0073b1' }} /> {edu.degree}</h4>
                <p>{edu.institution_name}</p>
                <p>{edu.field_of_study}</p>
                <p>{edu.start_date?.slice(0, 10)} - {edu.end_date?.slice(0, 10)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProfile;
