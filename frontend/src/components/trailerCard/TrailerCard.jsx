import React, { useState } from "react";
import { IoPlayCircleOutline, IoCloseCircle } from "react-icons/io5";
import { BiFullscreen } from "react-icons/bi";
import "./style.scss";

const TrailerCard = ({ movie }) => {
  const [showTrailer, setShowTrailer] = useState(false);

  if (!movie) return null;

  const { movieName, trailerUrl, media } = movie;
  
  // Default RRR trailer and image if no trailer URL is provided
  const defaultTrailerUrl = "https://www.youtube.com/watch?v=f_vbAtFSEc0"; // RRR Official Trailer
  const defaultRRRImage = "/images/rrrimages.webp";
  const finalTrailerUrl = trailerUrl || defaultTrailerUrl;
  
  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(finalTrailerUrl);
  const thumbnailUrl = videoId 
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : (media || defaultRRRImage);

  const handlePlayTrailer = () => {
    if (videoId) {
      setShowTrailer(true);
    }
  };

  return (
    <>
      <div className="trailerCard">
        <div className="trailerThumbnail">
          <img src={thumbnailUrl} alt={`${movieName} trailer`} />
          <div className="playOverlay" onClick={handlePlayTrailer}>
            <IoPlayCircleOutline className="playIcon" />
            <span className="playText">Watch Trailer</span>
          </div>
        </div>
        
        <div className="trailerInfo">
          <h3>Official Trailer</h3>
          <p>{movieName}</p>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && videoId && (
        <div className="trailerModal" onClick={() => setShowTrailer(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <button 
              className="closeButton" 
              onClick={() => setShowTrailer(false)}
            >
              <IoCloseCircle />
            </button>
            <div className="videoContainer">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title={`${movieName} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrailerCard;
