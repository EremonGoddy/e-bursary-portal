import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Admincontrols.css'; // Assuming you have an AuditLogs.css file for custom styles

const AuditLogs = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [adminDetails, setAdminDetails] = useState({});
  const navigate = useNavigate();

  // Function to toggle sidebar active state
  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      navigate('/signin'); // Redirect if not authenticated
      return;
    }

    // Fetch admin details
    axios.get('http://localhost:5000/api/admin-details')
      .then(response => {
        setAdminDetails({
          name: response.data.name,
          email: response.data.email,
        });
      })
      .catch(error => console.error('Error fetching admin details:', error));
  }, [navigate]);

  return (
    <div className="container-fluid p-0">
      {/* Top Bar */}
      <div className="topbaradmin d-flex justify-content-between p-2 shadow-sm">
        <div className="logo">
          <h2>EBursary</h2>
        </div>
        <div className="search">
          <input type="text" id="search" placeholder="search here" />
          <label htmlFor="search">
            <i className="bi bi-search"></i>
          </label>
        </div>
        <h1 className='welcoming'>Welcome: {adminDetails.name}</h1>
        <div className="user">
        <img src='/images/patient.png' alt="User" className="rounded-circle" width="40" height="40" />
        </div>
      </div>

      {/* Sidebar */}
      <div className="row flex-nowrap">
        <div className={`sidebaradmin col-auto col-md-3 col-xl-2 px-sm-2 px-0 shadow-sm ${sidebarActive ? 'active' : ''}`}>
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <i className="bi bi-list text-white fs-3" id="btn" onClick={toggleSidebar}></i>
            <ul className="nav flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
              <li className="nav-item">
                <Link to='/admindashboard' className="nav-link align-middle px-0">
                  <i className="bi bi-house-door-fill"></i> <span className="ms-1 d-none d-sm-inline">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/usermanagement" className="nav-link px-0 align-middle">
                  <i className="bi bi-person-fill-gear"></i> <span className="ms-1 d-none d-sm-inline">User Management</span>
                </Link>
              </li>
              <li>
                <Link to="/bursaryfund" className="nav-link px-0 align-middle">
                  <i className="bi bi-bank"></i> <span className="ms-1 d-none d-sm-inline">Bursary Management</span>
                </Link>
              </li>
              <li>
                <Link to="/monitoring" className="nav-link px-0 align-middle">
                  <i className="bi bi-file-earmark-person"></i> <span className="ms-1 d-none d-sm-inline">Application Monitoring</span>
                </Link>
              </li>
              <li>
                <Link to="/adminreport" className="nav-link px-0 align-middle">
                  <i className="bi bi-bar-chart-fill"></i> <span className="ms-1 d-none d-sm-inline">Analysis</span>
                </Link>
              </li>
              <li>
                <Link to='/auditlogs' className="nav-link px-0 align-middle">
                  <i className="bi bi-list-check"></i> <span className="ms-1 d-none d-sm-inline">Audit logs</span>
                </Link>
              </li>
              <li>
                <Link to='/adminsetting' className="nav-link px-0 align-middle">
                  <i className="bi bi-gear-fill"></i> <span className="ms-1 d-none d-sm-inline">Settings</span>
                </Link>
              </li>
            </ul>
            <hr />
            <div className="dropdown pb-4">
              <Link to='/' className="d-flex align-items-center text-white text-decoration-none">
                <i className="bi bi-box-arrow-right"></i> <span className="d-none d-sm-inline mx-1">Logout</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="col py-3">
          <h2>Audit Logs</h2>
          {/* Content for Audit Logs can be added here */}
        </div>
      </div>
    </div>
  );
}

export default AuditLogs;