








import React from "react";
import { Link } from "react-router-dom";
import "./Landing.scss";

const movies = [
  {
    id: 1,
    title: "Avengers: Endgame",
    genre: "Action, Adventure",
    duration: "3h 2m",
    poster: "https://m.media-amazon.com/images/I/81ExhpBEbHL._AC_SL1500_.jpg",
  },
  {
    id: 2,
    title: "Inception",
    genre: "Sci-Fi, Thriller",
    duration: "2h 28m",
    poster: "https://m.media-amazon.com/images/I/71sBtM3Yi5L._AC_SL1024_.jpg",
  },
  {
  id: 3,
  title: "The Batman",
  genre: "Action, Crime",
  duration: "2h 56m",
  poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
},

  {
    id: 4,
    title: "Interstellar",
    genre: "Adventure, Drama",
    duration: "2h 49m",
    poster: "https://m.media-amazon.com/images/I/91kFYg4fX3L._AC_SL1500_.jpg",
  },
];

const Landing = () => {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Welcome to <span>iMovies</span>
          </h1>
          <p>Your ultimate destination for the latest blockbusters and timeless classics</p>
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary">Sign In</Link>
            <Link to="/register" className="btn btn-secondary">Sign Up</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="gradient-overlay"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose iMovies?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon">🎬</div>
            <h3>Wide Selection</h3>
            <p>Thousands of movies and shows to choose from</p>
          </div>
          <div className="feature-card">
            <div className="icon">🎟️</div>
            <h3>Easy Booking</h3>
            <p>Book your tickets in just a few clicks</p>
          </div>
          <div className="feature-card">
            <div className="icon">📱</div>
            <h3>Any Device</h3>
            <p>Watch on your phone, tablet, or computer</p>
          </div>
          <div className="feature-card">
            <div className="icon">⭐</div>
            <h3>Top Quality</h3>
            <p>Enjoy the best viewing experience</p>
          </div>
        </div>
      </section>

      {/* Now Showing Section */}
      <section className="now-showing">
        <h2>Now Showing</h2>
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <div className="movie-poster">
                <img src={movie.poster} alt={movie.title} />
              </div>
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.genre} • {movie.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to watch?</h2>
        <p>Create an account to book your tickets now!</p>
        <Link to="/register" className="btn btn-primary">Get Started</Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">iMovies</div>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Sign Up</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} iMovies. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
