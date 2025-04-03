import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Admincontrols.css';
import patient from '../../assets/patient.png';

const MonitoringApplication = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [data, setData] = useState([]);
  const [adminDetails, setAdminDetails] = useState({});
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      navigate('/signin');
      return;
    }

    axios.get('http://localhost:5000/api/admin-details')
      .then(response => {
        setAdminDetails({
          name: response.data.name,
          email: response.data.email,
        });
      })
      .catch(error => console.error('Error fetching admin details:', error));
  }, [navigate]);

  const loadData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/personalInformation');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching personal information:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
          <img src={patient} alt="User" className="rounded-circle" width="40" height="40" />
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
          <h1 className="text-center">Personal Information</h1>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th style={{ textAlign: 'center' }}>Full Name</th>
                  <th style={{ textAlign: 'center' }}>Email</th>
                  <th style={{ textAlign: 'center' }}>Sub County</th>
                  <th style={{ textAlign: 'center' }}>Ward</th>
                  <th style={{ textAlign: 'center' }}>Village</th>
                  <th style={{ textAlign: 'center' }}>D.O.B</th>
                  <th style={{ textAlign: 'center' }}>Gender</th>
                  <th style={{ textAlign: 'center' }}>Institution</th>
                  <th style={{ textAlign: 'center' }}>Year</th>
                  <th style={{ textAlign: 'center' }}>Admission</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th style={{ textAlign: 'center' }}>Bursary</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.fullname}</td>
                    <td>{item.email}</td>
                    <td>{item.subcounty}</td>
                    <td>{item.ward}</td>
                    <td>{item.village}</td>
                    <td>{item.birth}</td>
                    <td>{item.gender}</td>
                    <td>{item.institution}</td>
                    <td>{item.year}</td>
                    <td>{item.admission}</td>
                    <td>{item.status}</td>
                    <td>{item.bursary}</td>
                    <td>
                      <Link to={`/PersonalInformation/${item.user_id}`}>
                        <button className="btn btn-primary">User Details</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonitoringApplication;