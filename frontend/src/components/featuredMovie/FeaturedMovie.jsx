import React from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { IoPlayCircleOutline } from "react-icons/io5";
import { MdDateRange, MdMovieCreation } from "react-icons/md";
import { BiTime } from "react-icons/bi";
import "./style.scss";

const FeaturedMovie = ({ movie }) => {
  const navigate = useNavigate();

  if (!movie) return null;

  const {
    movieName,
    releaseDate,
    media,
    movieId,
    genre,
    duration,
    description,
    rating,
  } = movie;
  const formattedMovieName = movieName[0].toUpperCase() + movieName.slice(1);
  
  // Default RRR image if no movie poster is available
  const defaultRRRImage = "/images/rrrimages.webp";
  const moviePoster = media || defaultRRRImage;

  return (
    <div className="featuredMovieContainer">
      <div className="featuredMovieCard">
        <div className="moviePoster">
          <img src={moviePoster} alt={formattedMovieName} />
          <div
            className="playButton"
            onClick={() => navigate(`/showdetails/${movieId}`)}
          >
            <IoPlayCircleOutline />
          </div>
        </div>

        <div className="movieDetails">
          <div className="movieHeader">
            <h1 className="movieTitle">{formattedMovieName}</h1>
            {rating && <div className="rating">★ {rating}</div>}
          </div>

          <div className="movieMeta">
            <div className="metaItem">
              <MdDateRange />
              <span>{dayjs(releaseDate).format("MMM D, YYYY")}</span>
            </div>
            {duration && (
              <div className="metaItem">
                <BiTime />
                <span>{duration}</span>
              </div>
            )}
            {genre && (
              <div className="metaItem">
                <MdMovieCreation />
                <span>{genre}</span>
              </div>
            )}
          </div>

          {description && <p className="movieDescription">{description}</p>}

          <div className="actionButtons">
            <button
              className="detailsButton"
              onClick={() => navigate(`/showdetails/${movieId}`)}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedMovie;
