import React from "react";
import dayjs from "dayjs";
import { MdModeEditOutline } from "react-icons/md";
import "./style.scss";
import { useNavigate } from "react-router-dom";

const Show = ({ data, isAdmin = false }) => {
  const { movieName, releaseDate, media, movieId } = data;
  const navigate = useNavigate();
  const formattedName = movieName ? movieName[0].toUpperCase() + movieName.slice(1) : '';
  const formattedDate = releaseDate ? dayjs(releaseDate).format("MMM D, YYYY") : 'Coming Soon';

  const handleCardClick = (e) => {
    // Only navigate if the click wasn't on the edit button
    if (!e.target.closest('.edit-button')) {
      navigate(`/showdetails/${movieId}`);
    }
  };

  return (
    <li className="show" onClick={handleCardClick}>
      <div className="imageContainer">
        <img 
          className="image" 
          src={media || '/placeholder-movie.jpg'} 
          alt={formattedName}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-movie.jpg';
          }}
        />
        {isAdmin && (
          <button 
            className="edit edit-button" 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/edit-movie/${movieId}`);
            }}
            aria-label="Edit movie"
          >
            <MdModeEditOutline />
          </button>
        )}
      </div>
      <div className="movie-info">
        <h3 className="name" title={formattedName}>
          {formattedName}
        </h3>
        <p className="release-date">
          {formattedDate}
        </p>
      </div>
    </li>
  );
};

export default Show;
