import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import patient from '../../assets/patient.png';
import { Link, useNavigate } from 'react-router-dom';
import './Application.css'; // Import the CSS file

const Disclosuredetails = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [studentDetails, setStudentDetails] = useState({});
  const [formData, setFormData] = useState({
    bursary: '',
    bursarysource: '',
    bursaryamount: '',
    helb: '',
    granted: '',
    noreason: '',
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
    console.log('Submitting data with userId:', dataWithUserId); // Debugging statement
    // Send form data to the backend
    axios.post('http://localhost:5000/api/disclosure-details', dataWithUserId)
      .then(response => {
        alert('Data inserted successfully');
        navigate('/studentdashboard');
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
            <h2 className="subtitle">Other disclosure</h2>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-start d-block">Are you currently receiving any other bursaries or scholarship?</label>
                <div className="form-check">
                  <input type="radio" name="bursary" id="yesBursary" value="yes" onChange={handleChange} className="form-check-input" />
                  <label htmlFor="yesBursary" className="form-check-label text-start d-block">Yes</label>
                </div>
                <div className="form-check">
                  <input type="radio" name="bursary" id="noBursary" value="no" onChange={handleChange} className="form-check-input" />
                  <label htmlFor="noBursary" className="form-check-label text-start d-block">No</label>
                </div>
              </div>

              <div className="col-md-6">
                <label htmlFor="bursarysource" className="form-label text-start d-block">If yes: state the source:</label>
                <input type="text" id="bursarysource" name="bursarysource" value={formData.bursarysource} onChange={handleChange} className="form-control" placeholder="Enter the source" />
              </div>
              <div className="col-md-6">
                <label htmlFor="bursaryamount" className="form-label text-start d-block">State the amount in Ksh:</label>
                <input type="text" id="bursaryamount" name="bursaryamount" value={formData.bursaryamount} onChange={handleChange} className="form-control" placeholder="Enter amount in Ksh" />
              </div>

              <div className="col-md-6">
                <label className="form-label text-start d-block">If you are a student of the university or tertiary college, have you applied for financial support from HELB?</label>
                <div className="form-check">
                  <input type="radio" name="helb" id="yesHelb" value="Yes" onChange={handleChange} className="form-check-input" />
                  <label htmlFor="yesHelb" className="form-check-label text-start d-block">Yes</label>
                </div>
                <div className="form-check">
                  <input type="radio" name="helb" id="noHelb" value="No" onChange={handleChange} className="form-check-input" />
                  <label htmlFor="noHelb" className="form-check-label text-start d-block">No</label>
                </div>
              </div>

              <div className="col-md-6">
                <label htmlFor="granted" className="form-label text-start d-block">If yes in above state, the outcome and why you should be granted a bursary under this program:</label>
                <textarea id="granted" name="granted" value={formData.granted} onChange={handleChange} className="form-control" placeholder="Enter the reason for grantation"></textarea>
              </div>
              <div className="col-md-6">
                <label htmlFor="noreason" className="form-label text-start d-block">If no in above state the reasons:</label>
                <textarea id="noreason" name="noreason" value={formData.noreason} onChange={handleChange} className="form-control" placeholder="Enter the reason"></textarea>
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

export default Disclosuredetails;