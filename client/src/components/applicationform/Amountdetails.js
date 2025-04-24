import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import './Application.css'; // Import the CSS file

const Amountdetails = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [studentDetails, setStudentDetails] = useState({});
  const [formData, setFormData] = useState({
    payablewords: '',
    payablefigures: '',
    outstandingwords: '',
    outstandingfigures: '',
    accountname: '',
    accountnumber: '',
    branch: '',
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
    const userId = sessionStorage.getItem('userId');  // Retrieve userId
    if (!userId) {
      alert('User ID not found. Please complete personal details first.');
      return;
    }
    const dataWithUserId = { ...formData, userId };
    console.log('Submitting data:', dataWithUserId); // Debugging statement
    // Send form data to the backend
    axios.post('http://localhost:5000/api/amount-details', dataWithUserId)
      .then(response => {
        alert('Data inserted successfully');
        navigate('/Familydetails');
      })
      .catch(error => {
        console.error('There was an error inserting the data!', error);
      });
  };

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      navigate('/signin'); // Redirect if not authenticated
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
                <Link to="/reports" className="d-flex align-items-center text-decoration-none text-white">
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
            <h2 className="subtitle">Amounts Applied</h2>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label htmlFor="payablewords" className="form-label text-start d-block">Total amounts payable in words</label>
                <input type="text" id="payablewords" name="payablewords" value={formData.payablewords} onChange={handleChange} className="form-control" placeholder="Enter amount payable" />
              </div>
              <div className="col-md-6">
                <label htmlFor="payablefigures" className="form-label text-start d-block">Total amounts payable in figures</label>
                <input type="number" id="payablefigures" name="payablefigures" value={formData.payablefigures} onChange={handleChange} className="form-control" placeholder="Enter amount payable" />
              </div>
              <div className="col-md-6">
                <label htmlFor="outstandingwords" className="form-label text-start d-block">Outstanding balance in words</label>
                <input type="text" id="outstandingwords" name="outstandingwords" value={formData.outstandingwords} onChange={handleChange} className="form-control" placeholder="Enter outstanding balance" />
              </div>
              <div className="col-md-6">
                <label htmlFor="outstandingfigures" className="form-label text-start d-block">Outstanding balance in figures</label>
                <input type="number" id="outstandingfigures" name="outstandingfigures" value={formData.outstandingfigures} onChange={handleChange} className="form-control" placeholder="Enter outstanding balance" />
              </div>
              <div className="col-md-6">
                <label htmlFor="accountname" className="form-label text-start d-block">School account name</label>
                <input type="text" id="accountname" name="accountname" value={formData.accountname} onChange={handleChange} className="form-control" placeholder="Enter school account name" />
              </div>
              <div className="col-md-6">
                <label htmlFor="accountnumber" className="form-label text-start d-block">School account number</label>
                <input type="number" id="accountnumber" name="accountnumber" value={formData.accountnumber} onChange={handleChange} className="form-control" placeholder="Enter school account number" />
              </div>
              <div className="col-md-6">
                <label htmlFor="branch" className="form-label text-start d-block">Branch</label>
                <input type="text" id="branch" name="branch" value={formData.branch} onChange={handleChange} className="form-control" placeholder="Enter the branch" />
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

export default Amountdetails;