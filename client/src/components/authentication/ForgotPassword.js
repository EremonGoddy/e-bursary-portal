import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ForgotPassword = () => {
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
  setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input) {
      setMessage('Please enter your email or phone number.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/forgot-password', { identifier: input });

      if (response.status === 200) {
        setMessage('A reset code has been sent to your email or phone.');
      } else {
        setMessage('Error sending reset code. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.6)",
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    transition: "all 0.3s ease-in-out",
  };

  const textStyle = {
    fontWeight: "bold",
    color: "#36454f",
    textAlign: "center",
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="col-12 col-md-6 col-lg-4" style={cardStyle}>
        <h2 style={textStyle}>Forgot Password</h2>
        <p style={textStyle}>Enter your registered email or phone number to receive a reset code.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="identifier" className="form-label">Email or Phone:</label>
            <input
              type="text"
              id="identifier"
              className="form-control"
              value={input}
              onChange={handleChange}
              placeholder="Enter your email or phone"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Code'}
          </button>
        </form>
        {message && <p className="text-center mt-3 text-success">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;