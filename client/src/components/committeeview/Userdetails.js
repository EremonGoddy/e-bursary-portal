import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Profile';
import { Link, useNavigate } from 'react-router-dom';

const UserDetails = () => {
  const [data, setData] = useState([]);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [committeeDetails, setCommitteeDetails] = useState({});
  const navigate = useNavigate();

  // Function to toggle sidebar active state
  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  // Fetch personal information from the API
  const loadData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/personalInformation');
      setData(response.data); // Set the response data to the state
    } catch (error) {
      console.error('Error fetching personal information:', error);
    }
  };

  // Call loadData when the component mounts
  useEffect(() => {
    loadData();
  }, []);

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
        <div className="col-md-10 p-4">
          <div className="table-responsive">
            <h1 className="text-center">Personal Information</h1>
            <table className="table table-bordered table-hover">
              <thead className="table-primary">
                <tr>
                  <th scope="col" className="text-center">Full Name</th>
                  <th scope="col" className="text-center">Email</th>
                  <th scope="col" className="text-center">Institution</th>
                  <th scope="col" className="text-center">Admission</th>
                  <th scope="col" className="text-center">Sub County</th>
                  <th scope="col" className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.fullname}</td>
                    <td>{item.email}</td>
                    <td>{item.institution}</td>
                    <td>{item.admission}</td>
                    <td>{item.subcounty}</td>
                    <td className="text-center">
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
};

export default UserDetails;