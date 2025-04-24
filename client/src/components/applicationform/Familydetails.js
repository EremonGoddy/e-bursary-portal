import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import './Application.css'; // Import the CSS file

const Familydetails = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [studentDetails, setStudentDetails] = useState({});
  const [formData, setFormData] = useState({
    family_status: '',
    disability: '',
    parentname: '',
    relationship: '',
    contact: '',
    occupation: '',
    guardian_children: '',
    working_siblings: '',
    studying_siblings: '',
    monthly_income: ''
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
    axios.post('http://localhost:5000/api/family-details', dataWithUserId)
      .then(response => {
        alert('Data inserted successfully');
        navigate('/Disclosuredetails');
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
            <h2 className="subtitle">Family Details</h2>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-start d-block">Family status</label>
                <div className="form-check">
                  <input type="radio" name="family_status" id="both_alive" value="Both parents alive" onChange={handleChange} className="form-check-input" />
                  <label htmlFor="both_alive" className="form-check-label text-start d-block">Both parents alive</label>
                </div>
                <div className="form-check">
                  <input type="radio" name="family_status" id="single_parent" value="Single parent" onChange={handleChange} className="form-check-input" />
                  <label htmlFor="single_parent" className="form-check-label text-start d-block">Single parent</label>
                </div>
                <div className="form-check">
                  <input type="radio" name="family_status" id="orphan" value="Orphan" onChange={handleChange} className="form-check-input" />
                  <label htmlFor="orphan" className="form-check-label text-start d-block">Orphan</label>
                </div>
                <div className="form-check">
                  <input type="radio" name="family_status" id="one_deceased" value="One parent deceased" onChange={handleChange} className="form-check-input" />
                  <label htmlFor="one_deceased" className="form-check-label text-start d-block">One parent deceased</label>
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label text-start d-block">The student has a disability or special education need?</label>
                <div className="form-check">
                  <input type="radio" name="disability" id="disability_yes" value="Yes" onChange={handleChange} className="form-check-input" />
                  <label htmlFor="disability_yes" className="form-check-label text-start d-block">Yes</label>
                </div>
                <div className="form-check">
                  <input type="radio" name="disability" id="disability_no" value="No" onChange={handleChange} className="form-check-input" />
                  <label htmlFor="disability_no" className="form-check-label text-start d-block">No</label>
                </div>
              </div>
              <div className="col-md-6">
                <label htmlFor="parentname" className="form-label text-start d-block">Parents/guardian name(s):</label>
                <input type="text" id="parentname" name="parentname" value={formData.parentname} onChange={handleChange} className="form-control" placeholder="Enter parents/guardian name" />
              </div>
              <div className="col-md-6">
                <label htmlFor="relationship" className="form-label text-start d-block">Relationship:</label>
                <input type="text" id="relationship" name="relationship" value={formData.relationship} onChange={handleChange} className="form-control" placeholder="Enter relationship" />
              </div>
              <div className="col-md-6">
                <label htmlFor="contact" className="form-label text-start d-block">Contact Information:</label>
                <input type="text" id="contact" name="contact" value={formData.contact} onChange={handleChange} className="form-control" placeholder="Enter contact information" />
              </div>
              <div className="col-md-6">
                <label htmlFor="occupation" className="form-label text-start d-block">Occupation:</label>
                <input type="text" id="occupation" name="occupation" value={formData.occupation} onChange={handleChange} className="form-control" placeholder="Enter Occupation" />
              </div>
              <div className="col-md-6">
                <label htmlFor="guardian" className="form-label text-start d-block">How many children does the guardian have?:</label>
                <input type="text" id="guardian" name="guardian_children" value={formData.guardian_children} onChange={handleChange} className="form-control" placeholder="Enter number of children" />
              </div>
              <div className="col-md-6">
                <label htmlFor="working" className="form-label text-start d-block">How many of your siblings are working or in business?:</label>
                <input type="text" id="working" name="working_siblings" value={formData.working_siblings} onChange={handleChange} className="form-control" placeholder="Enter siblings who are working" />
              </div>
              <div className="col-md-6">
                <label htmlFor="siblings" className="form-label text-start d-block">How many of your siblings/guardian children are in secondary school/college/university?:</label>
                <input type="text" id="siblings" name="studying_siblings" value={formData.studying_siblings} onChange={handleChange} className="form-control" placeholder="Enter siblings number" />
              </div>
              <div className="col-md-6">
                <label htmlFor="income" className="form-label text-start d-block">Total Monthly income of the parent/guardian(sum of all sources):</label>
                <input type="text" id="income" name="monthly_income" value={formData.monthly_income} onChange={handleChange} className="form-control" placeholder="Enter parent/guardian income" />
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

export default Familydetails;