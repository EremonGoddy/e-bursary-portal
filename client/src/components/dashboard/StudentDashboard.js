import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import the CSS file



const StudentDashboard = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [studentDetails, setStudentDetails] = useState({});
  const [isEditFormVisible, setEditFormVisible] = useState(false); // State for edit form visibility
  const [formData, setFormData] = useState({});
  const [userName, setUserName] = useState(''); // State for storing user's name
  const navigate = useNavigate();

  // Function to toggle sidebar active state
  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const name = sessionStorage.getItem('userName');

    if (!token) {
      navigate('/signin'); // Redirect if not authenticated
    } else {
      setUserName(name); // Set the user's name from session storage

      axios
        .get('http://localhost:5000/api/student', {
          headers: { Authorization: token },
        })
        .then((response) => {
          setStudentDetails(response.data);
          setFormData(response.data); // Populate the form with current data
        })
        .catch((error) => console.error('Error fetching student data:', error));
    }
  }, [navigate]);

  const handleEditClick = () => {
    setEditFormVisible(true); // Toggle the form visibility
  };

  const handleCloseForm = () => {
    setEditFormVisible(false); // Toggle the form visibility
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('authToken');
    axios
      .put('http://localhost:5000/api/student/update', formData, {
        headers: { Authorization: token },
      })
      .then((response) => {
        setStudentDetails(response.data);
        setEditFormVisible(false); // Hide the edit form after saving
      })
      .catch((error) => console.error('Error updating student data:', error));
  };

  // Check if the studentDetails object is empty
  const isStudentRegistered = Object.keys(studentDetails).length > 0;

  return (
    <div>
      {isEditFormVisible && (
        <div className="shadow-overlay" onClick={handleCloseForm}></div>
      )}

      {/* Top Bar */}
      <div className="topbars d-flex justify-content-between p-2">
        <div className="logos">
          <h2>EBursary</h2>
        </div>
        <h1>Welcome: {userName}</h1> {/* Display the user's name */}
        <div className="users">
        <img src='/images/patient.png' alt="User" className="rounded-circle" width="40" height="40" />
        </div>
        <i className="bi bi-bell-fill"></i>
      </div>

      {/* Main container with grid layout */}
      <div className="container-fluid mt-4">
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
          <div className="main-content col-md-9">
            <div className="row mb-4">
              <div className="col-md-4 mb-4">
                {/* Bursary funds allocated */}
                {isStudentRegistered ? (
                  <div>
                    <div className="bursary-content p-4 border bg-light rounded">
                      <h2>Bursary funds allocated:</h2>
                      <p>{studentDetails.bursary}</p>
                      <i className="bi bi-cash"></i>
                    </div>

                    {/* Status of the application */}
                    <div className="status-content p-4 border bg-light rounded mt-4">
                      <h2>Status of the application:</h2>
                      <p>{studentDetails.status}</p>
                      <i className="bi bi-check2-all"></i>
                    </div>
                  </div>
                ) : (
                  <div className=" d-flex justify-content-center align-items-center" style={{ height: '100%' }} >
                    <div className="empty-dashboard p-4 border bg-light rounded text-center">
                      <h2>Dashboard is empty</h2>
                      <p>Please {userName} click on the 'Apply' icon in the sidebar to complete your information.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="col-md-8 d-flex flex-wrap gap-4">
                {/* User Profile */}
                {isStudentRegistered && (
                  <div className="profiles p-4 border bg-light rounded flex-grow-1">
                    <h2>User Profile</h2>
                    <div className="line">
                      <hr />
                    </div>
                    <div className="card-header bg-transparent text-center">
                      <img className="profile-img" src='/images/patient.png'   alt="" width="100" />
                      <h5>{studentDetails.fullname}</h5>
                      <h6>Student</h6>
                    </div>
                    <hr />
                    <div className="card-body">
                      <p className="numbers">
                        <strong className="snumber">Student No:</strong> {studentDetails.admission}
                      </p>
                      <p className="schools">
                        <strong className="mschool">School:</strong> {studentDetails.institution}
                      </p>
                    </div>
                  </div>
                )}

                {/* Personal Information Section */}
                {isStudentRegistered && (
                  <div className="informations p-4 border bg-light rounded flex-grow-1">
                    <span className="person-icon">
                      <i className="bi bi-person-fill"></i>
                    </span>
                    <h2>Personal Information</h2>
                    <button className="btn btn-secondary" onClick={handleEditClick}>
                      <i className="bi bi-pencil-square"></i> Update Profile
                    </button>
                    <div className="icon-line">
                      <hr />
                    </div>
                    <table className="table table-striped">
                      <tbody>
                        <tr>
                          <th>Full name:</th>
                          <td>{studentDetails.fullname}</td>
                        </tr>
                        <tr>
                          <th>Email:</th>
                          <td>{studentDetails.email}</td>
                        </tr>
                        <tr>
                          <th>Sub County:</th>
                          <td>{studentDetails.subcounty}</td>
                        </tr>
                        <tr>
                          <th>Ward:</th>
                          <td>{studentDetails.ward}</td>
                        </tr>
                        <tr>
                          <th>Village unit:</th>
                          <td>{studentDetails.village}</td>
                        </tr>
                        <tr>
                          <th>Date of birth:</th>
                          <td>{studentDetails.birth}</td>
                        </tr>
                        <tr>
                          <th>Sex:</th>
                          <td>{studentDetails.gender}</td>
                        </tr>
                        <tr>
                          <th>Name of institution:</th>
                          <td>{studentDetails.institution}</td>
                        </tr>
                        <tr>
                          <th>Year:</th>
                          <td>{studentDetails.year}</td>
                        </tr>
                        <tr>
                          <th>Admission:</th>
                          <td>{studentDetails.admission}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Form */}
            {isEditFormVisible && (
              <div className="updateProfile p-4 bg-white shadow rounded">
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-3">
                    <label htmlFor="fullname" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      className="form-control"
                      value={formData.fullname}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="subcounty" className="form-label">
                      Sub County
                    </label>
                    <input
                      type="text"
                      id="subcounty"
                      name="subcounty"
                      className="form-control"
                      value={formData.subcounty}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="ward" className="form-label">
                      Ward
                    </label>
                    <input
                      type="text"
                      id="ward"
                      name="ward"
                      className="form-control"
                      value={formData.ward}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="village" className="form-label">
                      Village Unit
                    </label>
                    <input
                      type="text"
                      id="village"
                      name="village"
                      className="form-control"
                      value={formData.village}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="birth" className="form-label">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="birth"
                      name="birth"
                      className="form-control"
                      value={formData.birth}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="gender" className="form-label">
                      Sex
                    </label>
                    <input
                      type="text"
                      id="gender"
                      name="gender"
                      className="form-control"
                      value={formData.gender}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="institution" className="form-label">
                      Name of Institution
                    </label>
                    <input
                      type="text"
                      id="institution"
                      name="institution"
                      className="form-control"
                      value={formData.institution}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="year" className="form-label">
                      Year
                    </label>
                    <input
                      type="text"
                      id="year"
                      name="year"
                      className="form-control"
                      value={formData.year}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="admission" className="form-label">
                      Admission
                    </label>
                    <input
                      type="text"
                      id="admission"
                      name="admission"
                      className="form-control"
                      value={formData.admission}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* More Form Fields */}
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;