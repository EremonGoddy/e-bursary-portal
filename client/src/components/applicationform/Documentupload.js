import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import patient from '../../assets/patient.png';
import { Link, useNavigate } from 'react-router-dom';
import './Application.css'; // Import the CSS file

const Documentupload = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [studentDetails, setStudentDetails] = useState({});
  const [formData, setFormData] = useState({
    documentName: '',
    document: null, // file state for document upload
  });

  const navigate = useNavigate();
  // State to handle file upload status
  const [uploadStatus, setUploadStatus] = useState('');

  // Handle file change for document input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        documentName: file.name, // set the document name as uploaded
        document: file, // storing the uploaded file
      });
    }
  };

  // Function to toggle sidebar active state
  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Creating form data object to send file and other data
    const formDataToSend = new FormData();
    formDataToSend.append('documentName', formData.documentName); // pass the name of the file
    formDataToSend.append('document', formData.document); // append file to FormData

    // API call to send data to backend
    axios.post('http://localhost:5000/api/upload', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data', // important for file upload
      },
    })
      .then(response => {
        setUploadStatus('File uploaded successfully!');
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        setUploadStatus('File upload failed!');
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
          setFormData(response.data); // Populate the form with current data
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
            <h2 className="subtitle">Document Upload Form</h2>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-12">
                <label htmlFor="documentName" className="form-label text-start d-block">Document Name</label>
                <input
                  type="text"
                  value={formData.documentName}
                  readOnly
                  className="form-control"
                />
              </div>
              <div className="col-md-12">
                <label htmlFor="document" className="form-label text-start d-block">Upload Document</label>
                <input
                  type="file"
                  id="document"
                  name="document"
                  onChange={handleFileChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
              <div className="col-12">
                {uploadStatus && <p>{uploadStatus}</p>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Documentupload;