import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Profile.css';
import { Link, useNavigate } from 'react-router-dom';

const Settings = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [committeeDetails, setCommitteeDetails] = useState({});
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // State to manage visibility of password fields
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleSidebar = () => setSidebarActive(!sidebarActive);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (newPassword !== confirmPassword) {
      setMessage('New password and confirmation do not match');
      setIsError(true);
      return;
    }

    const token = sessionStorage.getItem('authToken');
    if (!token) {
      setMessage('No authentication token found');
      setIsError(true);
      return;
    }

    try {
      // Verify current password first
      const verifyResponse = await axios.get('http://localhost:5000/api/verify-password', {
        headers: { Authorization: `Bearer ${token}` }, // Ensure token is passed correctly
        params: { password: currentPassword },
      });

      if (verifyResponse.status === 200) {
        // If current password is verified, proceed to change password
        const response = await axios.post(
          'http://localhost:5000/api/change-password',
          { currentPassword, newPassword },
          {
            headers: { Authorization: `Bearer ${token}` }, // Ensure token is passed correctly
          }
        );
        setMessage(response.data.message);
        setIsError(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      const errorMessage = error.response?.data || 'Error updating password';
      setMessage(errorMessage);
      setIsError(true);
    }
  };

  // Fetch profile data when component loads
  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      navigate('/signin');
    } else {
      axios
        .get('http://localhost:5000/api/profile-committee', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setCommitteeDetails(response.data);
        })
        .catch((error) => {
          console.error('Error fetching profile data:', error);
        });
    }
  }, [navigate]);

  return (
    <div className="container-fluid">
      {/* Top Bar */}
      <div className="row bg-light p-2 align-items-center">
        <div className="col-md-3">
          <h2>EBursary</h2>
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" placeholder="Search here" />
        </div>
        <div className="col-md-3 text-center">
          <h5>Welcome: {committeeDetails.fullname}</h5>
        </div>
        <div className="col-md-1 text-end">
        <img src='/images/patient.png' alt="User" className="rounded-circle" width="40" height="40" />
        </div>
        <div className="col-md-1 text-end">
          <i className="bi bi-bell-fill"></i>
        </div>
      </div>

      <div className="row">
 {/* Sidebar */}
        <div className={`sidebar ${sidebarActive ? 'active' : ''}`}>
          <div className="d-flex flex-column">
            <i className="bi bi-list text-white" id="btn" onClick={toggleSidebar}></i>
            <ul>
              <li>
                <Link to="/committeedashboard" className="d-flex align-items-center text-decoration-none text-white">
                  <i className="bi bi-house-door-fill"></i>
                  <span className="links-name">Dashboard</span>
                </Link>
                <span className="tooltip">Dashboard</span>
              </li>
              <li>
                <Link to="/profile" className="d-flex align-items-center text-decoration-none text-white">
                  <i className="bi bi-person-square"></i>
                  <span className="links-name">Profile</span>
                </Link>
                <span className="tooltip">Profile</span>
              </li>
              <li>
                <Link to="/userdetails" className="d-flex align-items-center text-decoration-none text-white">
                  <i className="bi bi-file-earmark-text-fill"></i>
                  <span className="links-name">Student Information</span>
                </Link>
                <span className="tooltip">Student Information</span>
              </li>
              <li>
                <Link to="/comreport" className="d-flex align-items-center text-decoration-none text-white">
                  <i className="bi bi-bar-chart-fill"></i>
                  <span className="links-name">Analysis</span>
                </Link>
                <span className="tooltip">Analysis</span>
              </li>
              <li>
                <Link to="/settings" className="d-flex align-items-center text-decoration-none text-white">
                  <i className="bi bi-gear-fill"></i>
                  <span className="links-name">Settings</span>
                </Link>
                <span className="tooltip">Settings</span>
              </li>
              <br />
              <div className="Navigation">
                <li>
                  <Link to="/" className="d-flex align-items-center text-decoration-none text-white">
                    <i className="bi bi-box-arrow-right"></i>
                    <span className="links-name">Logout</span>
                  </Link>
                  <span className="tooltip">Logout</span>
                </li>
              </div>
            </ul>
          </div>
        </div>
        {/* Main Content Area */}
        <div className="col-12 col-md-10 p-4">
          <div className="setting-container">
            <h2 className="text-center">Change Password</h2>
            <div className="card p-4 shadow-sm">
              <form onSubmit={handleChangePassword}>
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label text-start d-block">Current Password</label>
                  <div className="password-input">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      id="currentPassword"
                      className="form-control"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                    <span
                      className="toggle-password-setting"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      <i
                        className={
                          showCurrentPassword
                            ? 'bi bi-eye eye-icon'
                            : 'bi bi-eye-slash eye-icon'
                        }
                        alt="Toggle Password Visibility"
                      ></i>
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label text-start d-block">New Password</label>
                  <div className="password-input">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <span
                      className="toggle-password-setting"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      <i
                        className={
                          showNewPassword
                            ? 'bi bi-eye eye-icon'
                            : 'bi bi-eye-slash eye-icon'
                        }
                        alt="Toggle Password Visibility"
                      ></i>
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label text-start d-block">Confirm New Password</label>
                  <div className="password-input">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      className="form-control"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <span
                      className="toggle-password-setting"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <i
                        className={
                          showConfirmPassword
                            ? 'bi bi-eye eye-icon'
                            : 'bi bi-eye-slash eye-icon'
                        }
                        alt="Toggle Password Visibility"
                      ></i>
                    </span>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">Update Password</button>
              </form>
              {message && (
                <p className={`mt-3 text-center ${isError ? 'text-danger' : 'text-success'}`}>{message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;