import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import './Application.css'; // Import the CSS file

const Personaldetails = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [studentDetails, setStudentDetails] = useState({});
  const [userName, setUserName] = useState('');
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    subcounty: '',
    ward: '',
    village: '',
    birth: '',
    gender: '',
    institution: '',
    year: '',
    admission: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Function to toggle sidebar active state
  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send form data to the backend
    axios.post('http://localhost:5000/api/personal-details', formData)
      .then(response => {
        alert('Data inserted successfully');
        const userId = response.data.userId;
        sessionStorage.setItem('userId', userId); // Store userId in sessionStorage
        console.log('Stored userId:', userId); // Debugging statement
        navigate('/Amountdetails');
      })
      .catch(error => {
        console.error('There was an error inserting the data!', error);
      });
  };

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const name = sessionStorage.getItem('userName');
    if (!token) {
      navigate('/signin'); // Redirect if not authenticated
    } else {
      setUserName(name);

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
        <h1>Welcome: {userName} </h1>
        <div className="users">
        <img src='/images/patient.png' alt="User" className="rounded-circle" width="40" height="40" />
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
        <div className="col-md-10">
          <div className="apply-form">
            <h1 className="form-title">Bursary Application Form</h1>
            <h2 className="subtitle">Student Details</h2>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label htmlFor="fullname" className="form-label text-start d-block" >Full Name</label>
                <input type="text" id="fullname" name="fullname" value={formData.fullname} onChange={handleChange} className="form-control" placeholder="Enter Full Name" />
              </div>
              <div className="col-md-6">
                <label htmlFor="email" className="form-label text-start d-block">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-control" placeholder="Enter Email" />
              </div>
              <div className="col-md-6">
                <label htmlFor="subcounty" className="form-label text-start d-block">Sub county</label>
                <input type="text" id="subcounty" name="subcounty" value={formData.subcounty} onChange={handleChange} className="form-control" placeholder="Enter Sub county" />
              </div>
              <div className="col-md-6">
                <label htmlFor="ward" className="form-label text-start d-block">Ward</label>
                <input type="text" id="ward" name="ward" value={formData.ward} onChange={handleChange} className="form-control" placeholder="Enter Ward" />
              </div>
              <div className="col-md-6">
                <label htmlFor="village" className="form-label text-start d-block">Village unit</label>
                <input type="text" id="village" name="village" value={formData.village} onChange={handleChange} className="form-control" placeholder="Enter your village" />
              </div>
              <div className="col-md-6">
                <label htmlFor="birth" className="form-label text-start d-block">Date of birth</label>
                <input type="date" id="birth" name="birth" value={formData.birth} onChange={handleChange} className="form-control" />
              </div>
              <div className="col-md-6">
                <label className="form-label text-start d-block">Gender</label>
                <div className="form-check">
                  <input type="radio" name="gender" id="male" value="Male" onChange={handleChange} className="form-check-input" />
                  <label htmlFor="male" className="form-check-label text-start d-block">Male</label>
                </div>
                <div className="form-check">
                  <input type="radio" name="gender" id="female" value="Female" onChange={handleChange} className="form-check-input" />
                  <label htmlFor="female" className="form-check-label text-start d-block">Female</label>
                </div>
              </div>
              <div className="col-md-6">
                <label htmlFor="institution" className="form-label text-start d-block">Name of institution</label>
                <input type="text" id="institution" name="institution" value={formData.institution} onChange={handleChange} className="form-control" placeholder="Enter institution" />
              </div>
              <div className="col-md-6">
                <label htmlFor="year" className="form-label text-start d-block">Year</label>
                <input type="number" id="year" name="year" value={formData.year} onChange={handleChange} className="form-control" placeholder="Enter year of education" />
              </div>
              <div className="col-md-6">
                <label htmlFor="admission" className="form-label text-start d-block">Admission</label>
                <input type="text" id="admission" name="admission" value={formData.admission} onChange={handleChange} className="form-control" placeholder="Enter Admission" />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary">Next</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Personaldetails;