import React, { useState } from "react";
import "./chatboatRegi.css";
import Header from "../navbars/unauthnavbar.js";

import axios from "axios";
import Apis from "../Apis.js";
import { useNavigate } from "react-router-dom";


const ChatbotRegister = () => {
    const [step, setStep] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [triedToProceed, setTriedToProceed] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const navigate= useNavigate();

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const isCurrentStepValid = () => {
        if (step === 0) return formData.name.trim() !== "";
        if (step === 1) return formData.email.trim() !== "" && isValidEmail(formData.email);
        if (step === 2) return formData.password.trim() !== "";
        if (step === 3) return formData.confirmPassword.trim() !== "" && formData.password === formData.confirmPassword;
        return false;
    };

    const nextStep = () => {
        setTriedToProceed(true);
        if (!isCurrentStepValid()) return;

        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            if (step < 3) setStep(step + 1);
        }, 800);
    };
    const handleSubmit = () => {
    setTriedToProceed(true);
    if (!isCurrentStepValid()) return;

    setIsTyping(true);
    setTimeout(() => {
        axios.post(Apis.Register, {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword:formData.confirmPassword
        })
        .then(res => {
            setIsTyping(false);
            alert(res.data.message || "Registration successful!");
            navigate("/login");
        })
        .catch(err => {
            setIsTyping(false);
            alert(err.response?.data?.message || "Registration failed.");
        });
    }, 800);
};


    return <>
      <Header/>
        <div className="chatbot-container">
            <div className="chat-window">

                {step >= 0 && (
                    <>
                        <div className="bot-message">👋 Hi! What's your name?</div>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleInput}
                            />
                            {step === 0 && (
                                <button onClick={nextStep} disabled={!isCurrentStepValid()}>Next</button>
                            )}
                        </div>
                        {step === 0 && triedToProceed && !formData.name.trim() && (
                            <p className="error-text">Name is required</p>
                        )}
                    </>
                )}

                {step >= 1 && (
                    <>
                        <div className="bot-message">📧 What's your email address?</div>
                        <div className="input-wrapper">
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleInput}
                            />
                            {step === 1 && (
                                <button onClick={nextStep} disabled={!isCurrentStepValid()}>Next</button>
                            )}
                        </div>
                        {step === 1 && triedToProceed && !formData.email.trim() && (
                            <p className="error-text">Email is required</p>
                        )}
                        {step === 1 && triedToProceed && formData.email.trim() && !isValidEmail(formData.email) && (
                            <p className="error-text">Enter a valid email</p>
                        )}
                    </>
                )}

                {step >= 2 && (
                    <>
                        <div className="bot-message">🔒 Set a password</div>
                        <div className="input-wrapper">
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleInput}
                            />
                            {step === 2 && (
                                <button onClick={nextStep} disabled={!isCurrentStepValid()}>Next</button>
                            )}
                        </div>
                        {step === 2 && triedToProceed && !formData.password.trim() && (
                            <p className="error-text">Password is required</p>
                        )}
                    </>
                )}

                {step >= 3 && (
                    <>
                        <div className="bot-message">🔑 Confirm your password</div>
                        <div className="input-wrapper">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={handleInput}
                            />
                            <button
                                onClick={
                               handleSubmit
                                }
                                disabled={!isCurrentStepValid()}
                            >
                                Submit
                            </button>
                        </div>
                        {step === 3 && triedToProceed && !formData.confirmPassword.trim() && (
                            <p className="error-text">Confirm your password</p>
                        )}
                        {step === 3 && triedToProceed && formData.confirmPassword.trim() && formData.password !== formData.confirmPassword && (
                            <p className="error-text">Passwords do not match</p>
                        )}
                    </>
                )}

                {isTyping && (
                    <div className="bot-typing">
                        <span></span><span></span><span></span>
                    </div>
                )}
            </div>
        </div>
    </>
};

export default ChatbotRegister;
