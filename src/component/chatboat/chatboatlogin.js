import React, { useState } from "react";
import "./chatboatlogin.css"
import Header from "../navbars/unauthnavbar.js";
import Apis from "../Apis.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../utils/Auth.js";
import { useDispatch } from "react-redux";
import { setUser } from "../../react-redux/UserSlice.js";
import { getIdToken, signInWithPopup } from 'firebase/auth';
import { auths, googleProvider } from "../firebase/Config.js"
import { Button } from "react-bootstrap";

const ChatbotLogin = () => {
    const [step, setStep] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [triedToProceed, setTriedToProceed] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const nextStep = () => {
        setTriedToProceed(true);
        if (step === 0 && (!formData.email.trim() || !isValidEmail(formData.email))) return;
        if (step === 1 && !formData.password.trim()) return;

        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            if (step < 1) setStep(step + 1);
        }, 800);
    };

    const handleSubmit = () => {
        setTriedToProceed(true);
        if (!formData.password.trim()) return;

        setIsTyping(true);
        setTimeout(() => {
            axios.post(Apis.Login, {

                email: formData.email,
                password: formData.password,

            })
                .then(res => {
                    setIsTyping(false);
                    console.log(res.data.user)

                    dispatch(setUser({ user: res.data.user, token: res.data.token }));

                    alert(res.data.message || "login successful!");
                    navigate("/Home")
                })
                .catch(err => {
                    setIsTyping(false);
                    alert(err.response?.data?.message || "login failed.");
                    console.log(err)
                });
        }, 800);
    };
    const signupWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auths, googleProvider);
            const user = result.user; // ✅ Fix: extract user from result
            const idToken = await user.getIdToken();

            // Send ID token to your backend
            const res = await axios.post(Apis.Firebase, {
                token: idToken,
            });
            console.log(res.data.user)
            dispatch(setUser({ user: res.data.user, token: res.data.token }));

            navigate("/Home");
        } catch (error) {
            console.log(error);
            alert("Google sign-in failed. Please try again.");
        }
    };
   return (
  <>
    <Header />
    <div className="chatbot-container">
      <div className="chat-window">
        {/* Step-Based Email/Password Flow */}
        {step === 0 && (
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
              <button onClick={nextStep}>Next</button>
            </div>
            {triedToProceed && !formData.email.trim() && (
              <p className="error-text">Email is required</p>
            )}
            {triedToProceed && formData.email.trim() && !isValidEmail(formData.email) && (
              <p className="error-text">Enter a valid email</p>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <div className="bot-message">🔒 Enter your password</div>
            <div className="input-wrapper">
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInput}
              />
              <button onClick={handleSubmit}>Login</button>
            </div>

            {triedToProceed && !formData.password.trim() && (
              <p className="error-text">Password is required</p>
            )}
            <p className="forgot-password-link" onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </p>
          </>
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="bot-typing">
            <span></span><span></span><span></span>
          </div>
        )}
      </div>

      {/* Google Sign-In Below Chat Box */}
      <div className="google-login-section">
        <p className="or-separator">OR</p>
        <Button className="google-btn" onClick={signupWithGoogle}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
          />
          Sign in with Google
        </Button>
      </div>
    </div>
  </>
);


};

export default ChatbotLogin;
