
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import serviceImage from "../../assets/payment.jpg"; // Import the image

const Services = () => {

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm fixed-top">
        <div className="container">
          <Link
            className="navbar-brand fw-bold text-primary me-auto"

          >
            Ebursary
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ms-auto`} id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/about"
                >
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/services"
                >
                  Service
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/contact"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section with Full Background Image */}
      <div
        className="position-relative text-center text-white" style={{ height: "60vh" }}>
          <img
                  src={serviceImage}
                  alt="About Us"
                  className="img-fluid w-100 h-100 object-fit-cover"
                  style={{ objectFit: "cover" }}
                />
        <div
          className="w-100 bg-dark bg-opacity-50 p-3 rounded d-flex justify-content-center align-items-center"
    
        >
          <h2 className="display-4 fw-bold">Our Services</h2>
        </div>
      </div>
      <div className="content-section my-3">
        <div className="row">
          {/* Program Overview */}
          <div className="col-md-4 mb-4">
            <div className="p-4">
              <h2>Student Registration</h2>
              <p>
              Easily register for bursary applications through our user-friendly system. 
Create an account and start your journey toward financial assistance. 
The digital process eliminates paperwork and streamlines registration, 
allowing students to focus on their education without hassle.
              </p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="p-4">
              <h2>Application Tracking</h2>
              <p>
              Track your bursary application in real time with our transparent system. 
Stay informed at every stage, from submission to approval, through timely 
updates. No need to follow up manually — our platform keeps you in the loop.
              </p>
            </div>
          </div>

          {/* Important Announcement */}
          <div className="col-md-4 mb-4">
            <div className="p-4">
              <h2>Document Upload</h2>
              <p>
              Upload required documents securely and with ease. Our system supports multiple 
file formats and ensures data confidentiality. Simplify submissions and manage 
your application digitally, reducing the need for physical paperwork.
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="p-4">
              <h2>Allocation Notifications</h2>
              <p>
              Get notified about bursary allocation and disbursement status. Our alerts 
keep you informed at key milestones, helping you stay updated and plan 
ahead with confidence. Notifications are sent directly to ensure transparency.
              </p>
            </div>
          </div>
        </div>
      </div>
   

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        &copy; {new Date().getFullYear()} E-Bursary | Empowering Education
      </footer>
    </div>
  );
};

export default Services;
