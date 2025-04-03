import React, { useState, useEffect } from 'react';
import axios from 'axios';
import patient from '../../assets/patient.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Profile.css';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [committeeDetails, setCommitteeDetails] = useState({});
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone_no: '',
    national_id: '',
    subcounty: '',
    ward: '',
    position: '',
  });
  const [isProfileFetched, setIsProfileFetched] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarActive(!sidebarActive);

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
          setIsProfileFetched(true);
          const data = response.data;
          if (data) {
            setFormData(data); // Set fetched data to form
            setProfileExists(true); // Mark profile as existing
          }
        })
        .catch((error) => {
          console.error('Error fetching profile data:', error);
          setIsProfileFetched(true); // Mark fetching attempt as finished
          setProfileExists(false); // Mark profile as non-existent
        });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('authToken');

    axios
      .post('http://localhost:5000/api/profile-form', formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert('Profile created/updated successfully');
        setProfileExists(true);
      })
      .catch((error) => {
        console.error('Error submitting committee data:', error);
        alert('Error submitting data. Please try again.');
      });
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
         <div className="topbars d-flex justify-content-between p-2">
           <div className="logos">
             <h2>EBursary</h2>
           </div>
           <h1>Welcome: {committeeDetails.fullname}</h1>
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
        <div className="col-md-4 offset-md-2">
          {isProfileFetched ? (
            profileExists ? (
              <div className="profile-info">
                <h2>Committee Profile</h2>
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <td><strong>Full name:</strong></td>
                      <td>{formData.fullname}</td>
                    </tr>
                    <tr>
                      <td><strong>Email:</strong></td>
                      <td>{formData.email}</td>
                    </tr>
                    <tr>
                      <td><strong>Phone No:</strong></td>
                      <td>{formData.phone_no}</td>
                    </tr>
                    <tr>
                      <td><strong>National ID:</strong></td>
                      <td>{formData.national_id}</td>
                    </tr>
                    <tr>
                      <td><strong>Sub County:</strong></td>
                      <td>{formData.subcounty}</td>
                    </tr>
                    <tr>
                      <td><strong>Ward:</strong></td>
                      <td>{formData.ward}</td>
                    </tr>
                    <tr>
                      <td><strong>Position:</strong></td>
                      <td>{formData.position}</td>
                    </tr>
                  </tbody>
                </table>
                <p>Your profile has been successfully updated. You can edit it anytime.</p>
              </div>
            ) : (
              <div className="profile-box">
                <h2>Create Profile</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Full name:</label>
                    <input
                      type="text"
                      name="fullname"
                      className="form-control"
                      value={formData.fullname}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input
                      type="text"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone No:</label>
                    <input
                      type="text"
                      name="phone_no"
                      className="form-control"
                      value={formData.phone_no}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">National ID:</label>
                    <input
                      type="text"
                      name="national_id"
                      className="form-control"
                      value={formData.national_id}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Sub County:</label>
                    <input
                      type="text"
                      name="subcounty"
                      className="form-control"
                      value={formData.subcounty}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Ward:</label>
                    <input
                      type="text"
                      name="ward"
                      className="form-control"
                      value={formData.ward}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Position:</label>
                    <input
                      type="text"
                      name="position"
                      className="form-control"
                      value={formData.position}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary">Submit</button>
                  </div>
                </form>
              </div>
            )
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;