import React from "react";
import { FaUser, FaUserTie, FaVideo, FaMusic, FaCamera } from "react-icons/fa";
import { MdDirectionsRun } from "react-icons/md";
import "./style.scss";

const CastCrew = ({ movie }) => {
  if (!movie) return null;

  // If movie.crew is present and non-empty, use it. Otherwise, fall back to placeholders.
  const hasDynamicCrew = Array.isArray(movie.crew) && movie.crew.length > 0;
  const castAndCrew = hasDynamicCrew
    ? movie.crew.map((m) => ({
        role: m.role || "",
        name: m.name || "",
        image: m.image || "/images/rrrimages.webp",
        // Choose icon based on role as a small enhancement
        icon:
          (m.role || "").toLowerCase().includes("music") ? (
            <FaMusic />
          ) : (m.role || "").toLowerCase().includes("director") ? (
            <FaVideo />
          ) : (m.role || "").toLowerCase().includes("producer") ? (
            <FaUserTie />
          ) : (m.role || "").toLowerCase().includes("camera") ? (
            <FaCamera />
          ) : (
            <FaUser />
          ),
      }))
    : [
        {
          role: "Hero",
          name: movie.hero || "Ram Charan",
          image: movie.heroImage || "/images/rrrimages.webp",
          icon: <FaUser />,
        },
        {
          role: "Heroine",
          name: movie.heroine || "Alia Bhatt",
          image: movie.heroineImage || "/images/rrrimages.webp",
          icon: <FaUser />,
        },
        {
          role: "Director",
          name: movie.director || "S.S. Rajamouli",
          image: movie.directorImage || "/images/rrrimages.webp",
          icon: <FaVideo />,
        },
        {
          role: "Producer",
          name: movie.producer || "D.V.V. Danayya",
          image: movie.producerImage || "/images/rrrimages.webp",
          icon: <FaUserTie />,
        },
        {
          role: "Music Director",
          name: movie.musicDirector || "M.M. Keeravani",
          image: movie.musicDirectorImage || "/images/rrrimages.webp",
          icon: <FaMusic />,
        },
        {
          role: "Cameraman",
          name: movie.cameraman || "K.K. Senthil Kumar",
          image: movie.cameramanImage || "/images/rrrimages.webp",
          icon: <FaCamera />,
        },
      ];

  return (
    <div className="castCrewContainer">
      <h2>Cast & Crew</h2>
      <div className="castCrewGrid">
        {castAndCrew.map((person, index) => (
          <div key={index} className="castCrewCard">
            <div className="imageContainer">
              <img src={person.image} alt={person.name} />
              <div className="roleIcon">
                {person.icon}
              </div>
            </div>
            <div className="personInfo">
              <h4>{person.name}</h4>
              <p>{person.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CastCrew;
