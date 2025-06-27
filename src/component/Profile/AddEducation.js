// src/components/AddEducation.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Apis from '../Apis';
import useAuth from '../../utils/Auth';
import "./AddEducation.css"

function AddEducation() {
    const { token, user } = useAuth();
    console.log(token)
    const [education, setEducation] = useState({
        degree: '',
        institution_name: '',
        field_of_study: '',
        start_date: '',
        end_date: ''
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [educationList, setEducationList] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchEducation();
    }, []);

    const fetchEducation = async () => {
        try {
            const res = await axios.get(`${Apis.Get_Eductaion}${user.userId}`, {
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



    const handleChange = (e) => {
        setEducation({ ...education, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { degree, institution_name, start_date, end_date } = education;

        if (!degree || !institution_name || !start_date || !end_date) {
            return setError('All fields are required');
        }

        try {
            if (isEditing) {
                // Update request
                await axios.put(`${Apis.Update_Education}${editId}`, education, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMessage('Education updated successfully');
            }
            else {
                const res = await axios.post(Apis.Add_Education, education, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMessage('Education added successfully');


            }
            setError('');
            setEducation({
                degree: '',
                institution_name: '',
                field_of_study: '',
                start_date: '',
                end_date: ''
            });
            setIsEditing(false);
            setEditId(null);
            fetchEducation();
        } catch (err) {
            setMessage('');
            console.log(err)
            setError(err.response?.data?.error || 'Something went wrong');
        }
    };
    const handleEdit = (edu) => {
        setIsEditing(true);
        setEditId(edu.eduId);
        setEducation({
            degree: edu.degree,
            institution_name: edu.institution_name,
            field_of_study: edu.field_of_study,
            start_date: edu.start_date?.slice(0, 10),
            end_date: edu.end_date?.slice(0, 10)
        });
    };
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this education?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${Apis.Delete_Education}${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchEducation(); // Refresh list
        } catch (err) {
            console.log("Delete error:", err);
        }
    };
    console.log(educationList)

    return <>
        <div className="edu-container">
            <h3>Add Education</h3>
            {message && <p className="success">{message}</p>}
            {Array.isArray(error) ? (
                error.map((err, idx) => (
                    <p key={idx} className="error">{err.msg}</p>
                ))
            ) : (
                error && <p className="error">{error}</p>
            )}

            <form onSubmit={handleSubmit}>
                <input type="text" name="degree" placeholder="Degree" value={education.degree} onChange={handleChange} />
                <input type="text" name="institution_name" placeholder="Institution" value={education.institution_name} onChange={handleChange} />
                <input type="text" name="field_of_study" placeholder="field of study" value={education.field_of_study} onChange={handleChange} />
                <input type="date" name="start_date" placeholder="Start Year" value={education.start_date} onChange={handleChange} />
                <input type="date" name="end_date" placeholder="End Year" value={education.end_date} onChange={handleChange} />
                <button type="submit" style={{ marginTop: "20px" }}>{editId ? "Update Education" : "Add Education "}</button>
            </form>
        </div >

        <div className="education-section">
            <h3>Your Education</h3>
            <div className="education-list">
                {educationList.length > 0 ? (
                    educationList.map((edu) => (
                        <div className="education-card" key={edu.eduId}>
                            <div className="edu-header">
                                <h4 className="degree">{edu.degree}</h4>
                                <p className="field">{edu.field_of_study}</p>
                            </div>

                            <p className="institution">
                                <strong>Institution:</strong> {edu.institution_name}
                            </p>

                            <p className="duration">
                                <strong>Duration:</strong> {edu.start_date?.slice(0, 10)} → {edu.end_date?.slice(0, 10)}
                            </p>

                            <div className="actions">
                                <button className="edit-btn" onClick={() => handleEdit(edu)}> Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(edu.eduId)}> Delete</button>
                            </div>
                        </div>

                    ))
                ) : (
                    <p className="no-edu">No education records found.</p>
                )}
            </div>
        </div>
    </>
};

export default AddEducation;
