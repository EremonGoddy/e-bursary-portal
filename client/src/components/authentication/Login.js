import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Login.css";


const Login = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [errors, setErrors] = useState({});
const [showPassword, setShowPassword] = useState(false);
const [rememberMe, setRememberMe] = useState(false);
const navigate = useNavigate();



const handleSubmit = (e) => {
e.preventDefault();
const newErrors = {};
if (!email) newErrors.email = '*Please provide an email';
if (!password) newErrors.password = '*Please provide a password';
if (Object.keys(newErrors).length > 0) {
setErrors(newErrors);
return;
}

axios.post(`${process.env.REACT_APP_API_URL}/api/signin`, { email, password })
  .then((response) => {
    console.log("Login Success:", response.data); // Debugging
    const { token, student, role } = response.data;
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('authToken', token);
    storage.setItem('student', JSON.stringify(student));

    if (role === 'Student') navigate('/studentdashboard');
    else if (role === 'Admin') navigate('/admindashboard');
    else if (role === 'Committee') navigate('/committeedashboard');
    else alert('Role not recognized');
  })
  .catch((err) => {
    console.error("Login Error:", err.response?.data?.message || err.message);
    alert(err.response?.data?.message || "Login failed");
  });
};

const togglePasswordVisibility = () => {
setShowPassword((prevState) => !prevState);
};

return (
<div className="container d-flex justify-content-center align-items-center min-vh-100">
<div className=" login col-12 col-md-8 col-lg-6">
        <h2>Sign in</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3" style={{textAlign:"left"}}>
            <label htmlFor="email" className="form-label" style={{fontSize:"1.2rem"}}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{fontSize:"1.2rem"}}
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>

          <div className="mb-3 position-relative" style={{textAlign:"left"}}>
            <label htmlFor="password" className="form-label" style={{fontSize:"1.2rem"}}>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{fontSize:"1.2rem"}}
            />
            <span className=" eye position-absolute end-0 top-50 translate-middle-y me-3" onClick={togglePasswordVisibility}>
              <i className={showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'}></i>
            </span>
            {errors.password && <div className="text-danger">{errors.password}</div>}
          </div>

          <div className="mb-3 d-flex justify-content-between align-items-center">
            <div className="form-check">
              <input
                type="checkbox"
                id="checkbox"
                name="checkbox"
                className="form-check-input"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{fontSize:"1.2rem"}}
              />
              <label className="form-check-label" htmlFor="checkbox" style={{fontSize:"1.2rem"}}>Remember me</label>
            </div>
            <Link to="/forgotpassword" className=" forgot-password text-decoration-none" style={{fontSize:"1.2rem"}}>Forgot password?</Link>
          </div>

          <button type="submit" className="btn btn-primary w-100" style={{fontSize:"1.2rem"}}>Sign in</button>
          
          <div className="text-center mt-3">
            <span style={{fontSize:"1.2rem"}}>Don't have an account? </span>
            <Link to="/register" className="text-decoration-none" style={{fontSize:"1.2rem"}}>Create an Account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
