import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admincontrols.css';
import patient from '../../assets/patient.png';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Usermanagement = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [users, setUsers] = useState([]);
  const [adminDetails, setAdminDetails] = useState({});
  const [activityLogs, setActivityLogs] = useState([]);
  const [newUser, setNewUser] = useState({ fullname: '', email: '', role: 'Committee', password: '123' });

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      const response = await axios.get('http://localhost:5000/api/activity-logs');
      setActivityLogs(response.data);
    };
    fetchLogs();
  }, []);

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = async () => {
    await axios.post('http://localhost:5000/api/users', newUser);
    setNewUser({ fullname: '', email: '', role: 'Committee', password: '123' });
    const usersResponse = await axios.get('http://localhost:5000/api/users');
    setUsers(usersResponse.data);
    const logsResponse = await axios.get('http://localhost:5000/api/activity-logs');
    setActivityLogs(logsResponse.data);
  };

  const handleDeleteUser = async (userId) => {
    await axios.delete(`http://localhost:5000/api/users/${userId}`);
    const usersResponse = await axios.get('http://localhost:5000/api/users');
    setUsers(usersResponse.data);
    const logsResponse = await axios.get('http://localhost:5000/api/activity-logs');
    setActivityLogs(logsResponse.data);
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin-details')
      .then(response => {
        setAdminDetails({
          name: response.data.name,
          email: response.data.email,
        });
      })
      .catch(error => console.error('Error fetching admin details:', error));
  }, []);

  return (
    <div className="container-fluid p-0">
      <div className="topbaradmin d-flex justify-content-between p-2 shadow-sm">
        <div className="logo">
          <h2>EBursary</h2>
        </div>
        <h1 className='welcoming'>Welcome: {adminDetails.name}</h1>
        <div className="user">
          <img src={patient} alt="User" className="rounded-circle" width="40" height="40" />
        </div>
      </div>

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
          <h2>User Account Management</h2>
          <div className="row">
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-body">
                  <h3 className="card-title">Add New User</h3>
                  <input
                    type="text"
                    name="fullname"
                    className="form-control mb-2"
                    placeholder="Full Name"
                    value={newUser.fullname}
                    onChange={handleInputChange}
                  />
                  <input
                    type="email"
                    name="email"
                    className="form-control mb-2"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={handleInputChange}
                  />
                  <select name="role" className="form-select mb-2" value={newUser.role} onChange={handleInputChange}>
                    <option value="Committee">Committee</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <button className="btn btn-primary" onClick={handleAddUser}>Add User</button>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-body">
                  <h3 className="card-title">Existing Users</h3>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.fullname}</td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>
                          <td>
                            <button className="btn btn-danger" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Activity Logs</h3>
              <ul className="list-group">
                {activityLogs.map((log, index) => (
                  <li className="list-group-item" key={index}>{log.log_message} at {log.log_time}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Usermanagement;