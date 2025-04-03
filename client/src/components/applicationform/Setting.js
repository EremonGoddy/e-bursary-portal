import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Application.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import patient from '../../assets/patient.png';
import { Link, useNavigate } from 'react-router-dom';

const Setting = () => {
  const [studentDetails, setStudentDetails] = useState({});
  const [sidebarActive, setSidebarActive] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

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
      const verifyResponse = await axios.get('http://localhost:5000/api/verify-password', {
        headers: { Authorization: `Bearer ${token}` },
        params: { password: currentPassword },
      });

      if (verifyResponse.status === 200) {
        const response = await axios.post(
          'http://localhost:5000/api/change-password',
          { currentPassword, newPassword },
          {
            headers: { Authorization: `Bearer ${token}` },
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

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      navigate('/signin');
    } else {
      axios.get('http://localhost:5000/api/student', {
        headers: { Authorization: token },
      })
        .then((response) => {
          setStudentDetails(response.data);
        })
        .catch(error => console.error('Error fetching student data:', error));
    }
  }, [navigate]);

  return (
    <div className="container-fluid">
      {/* Top Bar */}
      <div className="topbars d-flex justify-content-between p-2">
        <div className="logos">
          <h2>EBursary</h2>
        </div>
        <h1>Welcome: {studentDetails.fullname}</h1>
        <div className="users">
          <img src={patient} alt="User" className="rounded-circle" width="40" height="40" />
        </div>
        <i className="bi bi-bell-fill"></i>
      </div>

      <div className="row">
      {/* Sidebar */}
                 <div className={`sidebar ${sidebarActive ? 'active' : ''}`}>
                   <div className="d-flex flex-column">
                     <i className="bi bi-list text-white" id="btn" onClick={toggleSidebar}></i>
                     <ul>
                       <li>
                         <Link to="/student" className="d-flex align-items-center text-decoration-none text-white">
                           <i className="bi bi-house-door-fill"></i>
                           <span className="links-name">Dashboard</span>
                         </Link>
                         <span className="tooltip">Dashboard</span>
                       </li>
                       <li>
                         <Link to="/personaldetails" className="d-flex align-items-center text-decoration-none text-white">
                           <i className="bi bi-file-earmark-text-fill"></i>
                           <span className="links-name">Apply</span>
                         </Link>
                         <span className="tooltip">Apply</span>
                       </li>
                       <li>
                         <Link to="/documentupload" className="d-flex align-items-center text-decoration-none text-white">
                           <i className="bi bi-paperclip"></i>
                           <span className="links-name">File attached</span>
                         </Link>
                         <span className="tooltip">File attached</span>
                       </li>
                       <li>
                         <Link to="/report" className="d-flex align-items-center text-decoration-none text-white">
                           <i className="bi bi-file-earmark-arrow-down-fill"></i>
                           <span className="links-name">Download Report</span>
                         </Link>
                         <span className="tooltip">Download Report</span>
                       </li>
                       <li>
                         <Link to="#" className="d-flex align-items-center text-decoration-none text-white">
                           <i className="bi bi-chat-dots-fill"></i>
                           <span className="links-name">Messages</span>
                         </Link>
                         <span className="tooltip">Messages</span>
                       </li>
                       <li>
                         <Link to="/setting" className="d-flex align-items-center text-decoration-none text-white">
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
        <div className="main-content col-12 col-md-10 mt-4">
          <div className="setting-container">
            <h2 className="text-center">Change Password</h2>
            <div className="card p-4 shadow-sm">
              <form onSubmit={handleChangePassword}>
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label text-start d-block">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label text-start d-block">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label text-start d-block">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100 ">Update Password</button>
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

export default Setting;