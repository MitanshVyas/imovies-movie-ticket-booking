import React, { useState } from "react";
import "./style.scss";
import Loader from "../../components/loader/Loader";
import dayjs from "dayjs";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { render } from "../../host";

const MovieDetailsPopup = ({ movie, onClose }) => {
  if (!movie) return null;

  // Helper function to get the first available image URL
  const getImageUrl = (media) => {
    if (!media) return "/default-movie.png";

    // If media is a string, return it directly
    if (typeof media === "string") return media;

    // If media is an array, get the first item
    const mediaItem = Array.isArray(media) ? media[0] : media;

    // Return the URL property if it exists, otherwise return the item itself or default
    return mediaItem?.url || mediaItem || "/default-movie.png";
  };

  console.log("Movie data:", movie); // Debug log

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="movie-details-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <div className="movie-details-container">
          <div className="movie-poster">
            <img
              src={getImageUrl(movie.media)}
              alt={movie.movieName || "Movie poster"}
              onError={(e) => {
                console.error("Error loading image:", e.target.src);
                e.target.onerror = null;
                e.target.src = "/default-movie.png";
              }}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
          <div className="movie-info">
            <h2>{movie.movieName}</h2>
            <div className="movie-meta">
              <span>{new Date(movie.releaseDate).getFullYear()}</span>
              <span>{movie.runtime} min</span>
              <span>{movie.certification}</span>
            </div>
            <div className="genres">
              {movie.genres?.map((genre, i) => (
                <span key={i} className="genre">
                  {genre}
                </span>
              ))}
            </div>
            <p className="description">{movie.description}</p>
            {movie.cast && movie.cast.length > 0 && (
              <div className="cast-section">
                <h3>Cast</h3>
                <div className="cast-grid">
                  {movie.cast.map((member, i) => (
                    <div key={i} className="cast-member">
                      <div className="cast-image">
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className="default-avatar"
                          style={{ display: member.image ? "none" : "flex" }}
                        >
                          {member.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                      </div>
                      <div className="cast-details">
                        <span className="cast-name">{member.name}</span>
                        <span className="cast-role">{member.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const toastOptions = {
  position: "bottom-right",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
  closeOnClick: true,
};

const AdminMovies = ({ movies, loading, onDeleteMovie }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const adminToken = Cookies.get("adminJwtToken");

  const handleDeleteMovie = async (e, movieId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await axios.delete(`${render}/api/movie/deletemovie/${movieId}`, {
        headers: {
          'auth-token': adminToken,
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (response.data.status) {
        toast.success(response.data.msg || 'Movie deleted successfully!', toastOptions);
        if (onDeleteMovie) {
          onDeleteMovie(movieId);
        }
      } else {
        toast.error(response.data.msg || 'Failed to delete movie', toastOptions);
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
      const errorMessage = error.response?.data?.msg || 'Error deleting movie';
      console.error('Error details:', error.response?.data);
      toast.error(errorMessage, toastOptions);
    } finally {
      setIsDeleting(false);
    }
  };

  const Show = ({ data }) => {
    var { movieName, releaseDate, media, movieId, ...rest } = data;
    movieName = movieName[0].toUpperCase() + movieName.slice(1);

    const handleDeleteClick = (e) => {
      e.stopPropagation();
      handleDeleteMovie(e, movieId);
    };

    const handleShowDetails = () => {
      setSelectedMovie(data);
    };

    return (
      <li className="adminShow" onClick={handleShowDetails}>
        <div className="imageContainer">
          <div className="action-buttons">
            <button 
              onClick={handleDeleteClick} 
              className="action-btn delete" 
              title="Delete Movie"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader size={16} /> : <MdDelete />}
            </button>
          </div>
          <img className="image" src={media} alt={movieName} />
        </div>
        <div className="movie-info">
          <p className="name">{movieName}</p>
          <p className="release-date">{dayjs(releaseDate).format("MMM D, YYYY")}</p>
        </div>
      </li>
    );
  };

  return (
    <>
      {loading ? (
        <div className="loadingContainer">
          <Loader />
        </div>
      ) : (
        <ul className="adminMoviesContainer">
          {movies?.map((i) => (
            <Show key={i._id} data={i} />
          ))}
        </ul>
      )}

      {selectedMovie && (
        <MovieDetailsPopup
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
};

export default AdminMovies;
