import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Homepage.css";

const Homepage = () => {
  // Use image paths directly from the public folder
  const images = [
    "/images/arrangement-education-growth-concept.jpg",
    "/images/homepic.jpg",
    "/images/homephoto.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div>
      {/* Navbar - Fixed */}
      <nav className="navbar navbar-expand-lg bg-white  fixed-top">
        <div className="container">
          <Link className="navbar-brand fw-bold text-primary ">
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
          <div className="collapse navbar-collapse ms-auto" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/services">
                  Service
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">
                  Contact
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login">
                  <button>Sign in</button>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Image Slider */}
      <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {images.map((image, index) => (
            <div
              className={`carousel-item ${index === currentImageIndex ? "active" : ""}`}
              key={index}
            >
              <img
                src={image}
                className="d-block w-100 img-fluid"
                alt="Bursary program"
              />
              <div className="blur position-absolute bottom-0 w-100 text-white text-center">
                <h2>
                  Empowering Education in Turkana Through Bursaries: Your Path to Success
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
      <h1 className="text-3xl text-green-600 font-bold">Tailwind is working!</h1>
      <div className="content-section my-3">
        <div className="row">
          {/* Program Overview */}
          <div className="col-md-4 mb-4">
            <div className="p-4">
              <h2>Overview of the Bursary Program</h2>
              <p>
                The Turkana County Bursary Program is designed to support deserving students from
                Turkana County in their pursuit of higher education. The program aims to alleviate
                financial barriers and empower talented individuals to achieve their academic goals.
                Eligible candidates will receive financial assistance to cover tuition fees, textbooks,
                and other educational expenses.
              </p>
            </div>
          </div>

          {/* Key Dates */}
          <div className="col-md-4 mb-4">
            <div className="p-4">
              <h2>Key Dates</h2>
              <ul className="list-group">
                <li className="list-group-item">📅 Application Open: <strong>12/3/2024</strong></li>
                <li className="list-group-item">📅 Deadline: <strong>25/3/2024</strong></li>
                <li className="list-group-item">📢 Recipients Announced: <strong>2/4/2024</strong></li>
                <li className="list-group-item">💰 Disbursement: <strong>12/4/2024</strong></li>
              </ul>
            </div>
          </div>

          {/* Important Announcement */}
          <div className="col-md-4 mb-4">
            <div className="p-4">
              <h2>Important Announcement</h2>
              <p>
                We are pleased to announce that the application period for the Turkana County
                Bursary Program is now open. All interested candidates are encouraged to submit
                their applications before the deadline to be considered for financial assistance.
                Additionally, please note that this year, we have expanded the eligibility
                criteria to include students pursuing vocational and technical courses.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        &copy; {new Date().getFullYear()} E-Bursary | Empowering Education in Turkana
      </footer>
    </div>
  );
};

export default Homepage;
