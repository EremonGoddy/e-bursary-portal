import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Dashboard.css';
import patient from '../../assets/patient.png';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const AdminDashboard = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [adminDetails, setAdminDetails] = useState({});
  const [bursaryAmount, setBursaryAmount] = useState(0);
  const [allocatedAmount, setAllocatedAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [approvedApplications, setApprovedApplications] = useState(0);
  const [rejectedApplications, setRejectedApplications] = useState(0);
  const [users, setUsers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  // Function to toggle sidebar active state
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
        console.error('Error fetching bursary amount:', error);
      });

    axios.get('http://localhost:5000/api/admin-details')
      .then(response => {
        setAdminDetails({
          name: response.data.name,
          email: response.data.email,
        });
      })
      .catch(error => console.error('Error fetching admin details:', error));

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

  const handleDeleteUser = async (userId) => {
    await axios.delete(`http://localhost:5000/api/users/${userId}`);
    const usersResponse = await axios.get('http://localhost:5000/api/users');
    setUsers(usersResponse.data);
    const logsResponse = await axios.get('http://localhost:5000/api/activity-logs');
    setActivityLogs(logsResponse.data);
  };

  const approvedPercentage = totalApplications > 0 ? (approvedApplications / totalApplications) * 100 : 0;
  const rejectedPercentage = totalApplications > 0 ? (rejectedApplications / totalApplications) * 100 : 0;

  const chartData = {
    labels: ['Approved', 'Rejected'],
    datasets: [
      {
        data: [approvedPercentage, rejectedPercentage],
        backgroundColor: ['#4CAF50', '#FF5252'],
        hoverBackgroundColor: ['#388E3C', '#D32F2F'],
      },
    ],
  };

  const chartOptions = {
    plugins: {
      datalabels: {
        color: '#fff',
        formatter: (value) => `${value.toFixed(2)}%`,
        font: {
          weight: 'bold',
          size: 15,
        },
      },
    },
  };

  return (
    <div className="container-fluid p-0">
      {/* Top Bar */}
      <div className="topbars d-flex justify-content-between p-2 shadow-sm">
        <div className="logos">
          <h2>EBursary</h2>
        </div>
        <h1 className='welcoming'>Welcome: {adminDetails.name}</h1>
        <div className="users">
          <img src={patient} alt="User" className="rounded-circle" width="40" height="40" />
        </div>
        <i className="bi bi-bell-fill"></i>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarActive ? 'active' : ''} d-flex flex-column shadow-sm`}>
        <i className="bi bi-list text-white" id="btn" onClick={toggleSidebar}></i>
        <ul>
          <li>
            <Link to='/admindashboard' className="d-flex align-items-center text-decoration-none text-white">
              <i className="bi bi-house-door-fill"></i>
              <span className="links-name">Dashboard</span>
            </Link>
            <span className="tooltip">Dashboard</span>
          </li>
          <li>
            <Link to="/usermanagement" className="d-flex align-items-center text-decoration-none text-white">
              <i className="bi bi-person-fill-gear"></i>
              <span className="links-name">User Management</span>
            </Link>
            <span className="tooltip">User Management</span>
          </li>
          <li>
            <Link to="/bursarymanagement" className="d-flex align-items-center text-decoration-none text-white">
              <i className="bi bi-bank"></i>
              <span className="links-name">Bursary Management</span>
            </Link>
            <span className="tooltip">Bursary Management</span>
          </li>
          <li>
            <Link to="/monitoring" className="d-flex align-items-center text-decoration-none text-white">
              <i className="bi bi-file-earmark-person"></i>
              <span className="links-name">Application Monitoring</span>
            </Link>
            <span className="tooltip">Application Monitoring</span>
          </li>
          <li>
            <Link to="/adminreport" className="d-flex align-items-center text-decoration-none text-white">
              <i className="bi bi-bar-chart-fill"></i>
              <span className="links-name">Analysis</span>
            </Link>
            <span className="tooltip">Analysis</span>
          </li>
          <li>
            <Link to='/auditlogs' className="d-flex align-items-center text-decoration-none text-white">
              <i className="bi bi-list-check"></i>
              <span className="links-name">Audit logs</span>
            </Link>
            <span className="tooltip">Audit logs</span>
          </li>
          <li>
            <Link to='/adminsetting' className="d-flex align-items-center text-decoration-none text-white">
              <i className="bi bi-gear-fill"></i>
              <span className="links-name">Settings</span>
            </Link>
            <span className="tooltip">Settings</span>
          </li>
          <br />
          <div className="Navigation">
            <li>
              <Link to='/' className="d-flex align-items-center text-decoration-none text-white">
                <i className="bi bi-box-arrow-right"></i>
                <span className="links-name">Logout</span>
              </Link>
              <span className="tooltip">Logout</span>
            </li>
          </div>
        </ul>
      </div>

      {/* Main Content */}
      
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
        <div className="admin-containers row shadow-sm p-3 mb-5 bg-white rounded">
          <div className="user-list col-md-6 shadow-sm p-3 mb-5 bg-white rounded">
            <h2>Existing Users</h2>
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
                    <td>{user.name}</td>
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

          <div className="activity-logs-container col-md-6 shadow-sm p-3 mb-5 bg-white rounded">
            <h2>Activity Logs</h2>
            <ul>
              {activityLogs.map((log, index) => (
                <li key={index}>{log.log_message} at {log.log_time}</li>
              ))}
            </ul>
          </div>

          <div className="chart-container col-md-12 shadow-sm p-3 mb-5 bg-white rounded">
            <h2>Approval Status</h2>
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
  );
};

export default AdminDashboard;