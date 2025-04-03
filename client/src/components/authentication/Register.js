import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Login.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Student'
  });
  const [errors, setErrors] = useState({});
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name) newErrors.name = '*Please provide your full name';
    if (!formData.email) newErrors.email = '*Please provide an email';
    if (!formData.password) newErrors.password = '*Please provide a password';
    if (!formData.confirmPassword) newErrors.confirmPassword = '*Please confirm your password';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = '*Passwords do not match';
    if (!isTermsAccepted) return alert('You must accept the terms and conditions.');
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    axios.post('http://localhost:5000/api/post', formData)
      .then(() => {
        alert('Registration successful');
        navigate('/login');
      })
      .catch((err) => alert(err.response.data));
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className=" login col-12 col-md-8 col-lg-6" >
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3" style={{textAlign:"left"}}>
            <label className="form-label" style={{fontSize:"1.2rem"}}>Full Name</label>
            <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter your full name" style={{fontSize:"1.2rem"}} />
            {errors.name && <div className="text-danger">{errors.name}</div>}
          </div>
          
          <div className="mb-3" style={{textAlign:"left"}}>
            <label className="form-label" style={{fontSize:"1.2rem"}}>Email</label>
            <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Enter your email" style={{fontSize:"1.2rem"}} />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
          
          <div className="mb-3" style={{textAlign:"left"}}>
            <label className="form-label" style={{fontSize:"1.2rem"}}>Password</label>
<input type={showPassword ? 'text' : 'password'} className="form-control" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Enter your password" style={{fontSize:"1.2rem"}} />
            {errors.password && <div className="text-danger">{errors.password}</div>}
          </div>
          
          <div className="mb-3" style={{textAlign:"left"}}>
            <label className="form-label" style={{fontSize:"1.2rem"}}>Confirm Password</label>
            <input type={showPassword ? 'text' : 'password'} className="form-control" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="Confirm your password" style={{fontSize:"1.2rem"}} />
            <span className=" eyes translate-middle-y me-3" onClick={togglePasswordVisibility}>
              <i className={showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'}></i>
            </span>
            {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
          </div>
          
          <div className="form-check1 mb-3" style={{textAlign:"left"}}>
            <input type="checkbox" className="form-check-input" checked={isTermsAccepted} onChange={(e) => setIsTermsAccepted(e.target.checked)} />
            <label className="form-check-label" style={{fontSize:"1.2rem"}}>I agree with terms and conditions</label>
          </div>
          
          <button type="submit" className="btn btn-primary w-100" style={{fontSize:"1.2rem"}}>Register</button>
          
          <div className="text-center mt-3">
            <span style={{fontSize:"1.2rem"}}>Already have an account? </span>
            <Link to="/login" className="text-decoration-none" style={{fontSize:"1.2rem"}}>Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;