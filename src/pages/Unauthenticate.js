import React from 'react';
import { Container, Row, Col, Button, Navbar, Nav } from 'react-bootstrap';

import "./unauthentiote.css";

import { FaProjectDiagram, FaUserFriends, FaComments, FaUserPlus, FaHandsHelping ,FaEnvelope, FaPhone, FaMapMarkerAlt} from 'react-icons/fa';
import Footer from '../component/Footer.js';
import Header from '../component/navbars/unauthnavbar.js';
import { useNavigate } from 'react-router-dom';

export default function UnauthDashboard() {
    const navigate = useNavigate();
    return (
        <>
            {/* Navbar */}
           <Header/>


         
            {/* Hero Section */}
            <section className="hero-section d-flex align-items-center">
                <div className="container text-center text-md-start">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <h1 className="hero-title">Collaborate. Build. Launch.</h1>
                            <p className="hero-subtitle">
                                Connect with developers and bring your project ideas to life — together.
                            </p>
                            <button className="btn btn-primary btn-lg mt-3" onClick={()=>{navigate("/login")}}>Get Started</button>
                        </div>
                        <div className="col-md-6 mt-4 mt-md-0">
                            <img
                                src="img.jpg"
                                alt="Collaboration"
                                className="img-fluid hero-image"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="features-section py-5 bg-light">
                <div className="container text-center">
                    <h2 className="mb-5">Core Features</h2>
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <div className="feature-card p-4 shadow-sm h-100">
                                <FaProjectDiagram className="feature-icon mb-3" />
                                <h5>Create Projects</h5>
                                <p>Easily create and manage your project details, team size, tech stack, and more.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="feature-card p-4 shadow-sm h-100">
                                <FaUserFriends className="feature-icon mb-3" />
                                <h5>Find Collaborators</h5>
                                <p>Connect with like-minded developers, designers, and contributors to join your team.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="feature-card p-4 shadow-sm h-100">
                                <FaComments className="feature-icon mb-3" />
                                <h5>Real-time Chat</h5>
                                <p>Communicate and brainstorm in real-time with team members for better collaboration.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="how-it-works-section py-5">
                <div className="container text-center">
                    <h2 className="mb-5">How It Works</h2>
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <div className="step-card p-4 shadow-sm h-100">
                                <FaUserPlus className="step-icon mb-3" />
                                <h5>Register</h5>
                                <p>Create your free account and set up your profile with your skills.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="step-card p-4 shadow-sm h-100">
                                <FaProjectDiagram className="step-icon mb-3" />
                                <h5>Create or Join Projects</h5>
                                <p>Start a new project or request to join existing ones that match your interest.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="step-card p-4 shadow-sm h-100">
                                <FaHandsHelping className="step-icon mb-3" />
                                <h5>Collaborate</h5>
                                <p>Work together using built-in messaging and share your progress in real time.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="about" className="about-us-section py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 mb-4 mb-md-0">
                            <img src="teamwork.avif" alt="About us" className="img-fluid rounded shadow" />
                        </div>
                        <div className="col-md-6">
                            <h2 className="mb-3">About Project Collaboration Hub</h2>
                            <p className="text-muted">
                                Our mission is to connect developers, designers, and innovators to build impactful
                                projects together. Whether you're just getting started or looking for teammates with
                                complementary skills, our platform simplifies collaboration through seamless
                                communication and team management tools.
                            </p>
                            <p className="text-muted">
                                Join our community and turn ideas into reality—one project at a time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>

        
        </>
    );
}
