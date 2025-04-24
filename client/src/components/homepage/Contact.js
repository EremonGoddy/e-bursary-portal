import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPhoneAlt, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for contacting us! We will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm fixed-top">
        <div className="container">
          <Link className="navbar-brand fw-bold text-primary me-auto" to="/" style={{ fontSize: "2rem" }}>
            Ebursary
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse ms-auto" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/services">Service</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="background">
        <img
          src="/images/contact.jpg"
          alt="Contact Us"
          className="d-block w-100 img-fluid"
        />
        <div className="blur1 text-white position-absolute top-50 start-50 translate-middle bg-dark bg-opacity-50 p-3 rounded w-100">
          <h2 className="display-4 fw-bold">Contact Us</h2>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="container my-5" style={{ backgroundColor: "white" }}>
        <div className="row text-center">
          <div className="col-md-4">
            <FontAwesomeIcon icon={faMapMarkerAlt} size="3x" className="mb-2 text-primary" />
            <h4 style={{ backgroundColor: "white", fontSize: "1.8rem" }}>Location</h4>
            <p style={{ fontSize: "1.3rem", color: "#555" }}>
              Nawoitorong, Turkana County Headquarters<br />P.O Box 141-30500, Lodwar
            </p>
          </div>
          <div className="col-md-4">
            <FontAwesomeIcon icon={faPhoneAlt} size="3x" className="mb-2 text-primary" />
            <h4 style={{ backgroundColor: "white", fontSize: "1.8rem" }}>Phone</h4>
            <p style={{ fontSize: "1.3rem" }}>+254707556732</p>
            <p style={{ fontSize: "1.3rem" }}>+254707556732</p>
          </div>
          <div className="col-md-4">
            <FontAwesomeIcon icon={faEnvelope} size="3x" className="mb-2 text-primary" />
            <h4 style={{ backgroundColor: "white", fontSize: "1.8rem" }}>Email</h4>
            <p style={{ fontSize: "1.3rem" }}>eremon.godwin@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="container my-5">
        <div className="row d-flex align-items-center">
          <div className="col-md-6 text-center">
            <h3 style={{ fontSize: "1.8rem" }}>Contact Us</h3>
            <p style={{ fontSize: "1.3rem" }}>
              Have questions or need assistance? We're here to help! Whether you’re seeking information,
              need support, or have feedback, feel free to reach out. Fill out the form below with your
              details and message, and our team will respond promptly.
              We look forward to connecting with you and addressing your needs effectively!
            </p>
          </div>
          <div className="col-md-6" style={{
            backgroundColor: "white",
            boxShadow: "0 0 0.8rem rgba(0,0,0,0.8)",
            borderRadius: "8px",
            padding: "30px"
          }}>
            <form onSubmit={handleSubmit}>
              <div className="d-flex">
                <div className='me-2 w-50'>
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className='w-50'>
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className='mt-3'>
                <label htmlFor="message" className="form-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-control"
                  rows="4"
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100 mt-3">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
