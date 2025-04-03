import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import patient from '../../assets/patient.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css'; // Import the CSS file

const CommitteeDashboard = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [committeeDetails, setCommitteeDetails] = useState({});
  const [bursaryAmount, setBursaryAmount] = useState(0);
  const [allocatedAmount, setAllocatedAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [approvedApplications, setApprovedApplications] = useState(0);
  const [rejectedApplications, setRejectedApplications] = useState(0);

  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/committee-count')
      .then((response) => {
        setBursaryAmount(response.data.amount);
        setAllocatedAmount(response.data.allocated);
        setRemainingAmount(response.data.amount - response.data.allocated);
      })
      .catch((error) => {
        console.error('Error fetching student count:', error);
      });

    axios
      .get('http://localhost:5000/api/quick-statistics')
      .then((response) => {
        const { total, approved, rejected } = response.data;
        setTotalApplications(total);
        setApprovedApplications(approved);
        setRejectedApplications(rejected);
      })
      .catch((error) => {
        console.error('Error fetching application statistics:', error);
      });
  }, []);

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

      <div className="row flex-column flex-md-row">
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
        <div className="main-content col-md-9">
          <div className="row mt-4">
            <div className="col-md-6">
              <div className="bursary-fund-details card p-3 m-2" style={{ boxShadow: '0 5px 10px rgba(0, 0, 0, 0.6)' }}>
                <h2 className="text-center">Bursary Fund Details</h2>
                <div className="d-flex justify-content-around">
                  <div className="text-center p-3">
                    <p>Total Funds Available:</p>
                    <strong>{bursaryAmount}</strong>
                  </div>
                  <div className="text-center p-3">
                    <p>Amount Allocated to Students:</p>
                    <strong>{allocatedAmount}</strong>
                  </div>
                  <div className="text-center p-3">
                    <p>Remaining Funds:</p>
                    <strong>{remainingAmount}</strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="quick-statistics card p-3 m-2" style={{ boxShadow: '0 5px 10px rgba(0, 0, 0, 0.6)' }}>
                <h2 className="text-center">Quick Statistics</h2>
                <div className="d-flex justify-content-around">
                  <div className="text-center p-3 bg-success text-white">
                    <p>Total Applications:</p>
                    <strong>{totalApplications}</strong>
                  </div>
                  <div className="text-center p-3 bg-primary text-white">
                    <p>Approved Applications:</p>
                    <strong>{approvedApplications}</strong>
                  </div>
                  <div className="text-center p-3 bg-danger text-white">
                    <p>Rejected Applications:</p>
                    <strong>{rejectedApplications}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-center">Personal Information</h1>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr className="table-primary">
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
    </div>
  );
};

export default CommitteeDashboard;