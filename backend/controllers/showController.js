const Show = require("../models/showModel");
const Movie = require("../models/movieModel");
const Theatre = require("../models/theatreModel");
const Booking = require("../models/bookingModel");
const { v4 } = require("uuid");

const convertIntoDate = (time, date) => {
  // Input time and date strings
  var dateTimeString = date + "T" + time + ":00.000Z";
  var showDateTime = new Date(dateTimeString);

  return showDateTime;
};

module.exports.addShow = async (req, res, next) => {
  try {
    const { theatre, showtime, showdate, showId, movieId } = req.body;
    const findMovie = await Movie.findOne({ movieId });
    const movieShows = findMovie?.shows;

    const lowercaseTheatre = theatre.toLowerCase();
    if (movieShows.length >= 1) {
      const isFound = await Promise.all(
        movieShows.map(async (s) => {
          const show = await Show.findOne({ showId: s });

          const isSameTheatre = show?.theatreName === lowercaseTheatre;

          return (
            show.showdate === showdate &&
            show.showtime === showtime &&
            isSameTheatre
          );
        })
      );

      if (isFound.includes(true)) {
        return res.json({
          status: false,
          msg: "Show is already Created:)",
        });
      }
    }

    const adminEmail = req.user.adminDetails.email;

    await Show.create({
      movieId,
      theatreName: lowercaseTheatre,
      showtime,
      adminEmail,
      showId,
      showdate,
      tickets: {},
    });

    await Movie.updateOne(
      { movieId },
      {
        $addToSet: {
          shows: showId,
        },
      }
    );

    return res.json({ status: true, msg: "Show Saved successfully :)" });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :(" });
  }
};

module.exports.updateShowTickets = async (req, res) => {
  try {
    const { showId } = req.params;
    const sections = ["balcony", "middle", "lower"];
    const seatUpdates = [];

    sections.forEach((section) => {
      const seats = req.body?.[section] || {};
      Object.entries(seats).forEach(([seatNumber, seatData]) => {
        if (seatNumber === "total") return;
        if (!/^\d+$/.test(seatNumber) || !seatData?.userEmail) return;
        seatUpdates.push({ section, seatNumber, seatData });
      });
    });

    if (seatUpdates.length === 0) {
      return res.status(400).json({ status: false, msg: "Select at least one valid seat" });
    }

    const availabilityChecks = seatUpdates.map(({ section, seatNumber }) => ({
      [`tickets.${section}.${seatNumber}`]: { $exists: false },
    }));
    const seatFields = Object.fromEntries(
      seatUpdates.map(({ section, seatNumber, seatData }) => [
        `tickets.${section}.${seatNumber}`,
        seatData,
      ])
    );
    const result = await Show.updateOne(
      { showId, $and: availabilityChecks },
      { $set: seatFields }
    );

    if (result.modifiedCount === 0) {
      const show = await Show.findOne({ showId });
      if (!show) {
        return res.status(404).json({ status: false, msg: "Show not found" });
      }
      const conflicts = seatUpdates
        .filter(({ section, seatNumber }) => show.tickets?.[section]?.[seatNumber])
        .map(({ section, seatNumber }) => `${section} ${seatNumber}`);
      return res.status(409).json({
        status: false,
        msg: conflicts.length
          ? `These seats were just booked: ${conflicts.join(", ")}. Please choose other seats.`
          : "Seats could not be reserved. Refresh and try again.",
      });
    }

    return res.json({ status: true, msg: "Seats updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, msg: "Server issue :(" });
  }
};
module.exports.getMovieShows = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const getMovie = await Movie.findOne({ movieId });
    const movieShows = getMovie?.shows;

    const showData = await Promise.all(
      movieShows.map(async (s) => {
        const show = await Show.findOne({ showId: s });

        const dateObject = convertIntoDate(show.showtime, show.showdate);

        if (dateObject > new Date()) {
          const upperCaseTheatreName =
            show?.theatreName[0].toUpperCase() + show?.theatreName.slice(1);
          const showDetails = {
            showtime: show?.showtime,
            showdate: show?.showdate,
            theatre: upperCaseTheatreName,
            showId: show?.showId,
          };
          return showDetails;
        }
      })
    );
    const filteredShowsData = showData.filter(
      (s) => s !== null && s !== undefined
    );
    return res.json({ status: true, showData: filteredShowsData });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :)" });
  }
};

module.exports.getShow = async (req, res) => {
  try {
    const { showId } = req.params;
    const show = await Show.findOne({ showId });
    return res.json({ status: true, show });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :)" });
  }
};

module.exports.getAdminShows = async (req, res) => {
  try {
    const { email } = req.user.adminDetails;

    const shows = await Show.find({ adminEmail: email });

    const updated = await Promise.all(
      shows.map(async (s) => {
        const movie = await Movie.findOne({ movieId: s.movieId });

        const {
          adminEmail,
          showId,
          movieId,
          theatreName,
          showdate,
          showtime,
          tickets,
        } = s;

        return {
          adminEmail,
          showId,
          movieId,
          theatreName,
          showdate,
          showtime,
          tickets,
          movieName: movie?.movieName,
        };
      })
    );

    return res.json({ status: true, adminShows: updated });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :)" });
  }
};

module.exports.deleteShow = async (req, res) => {
  try {
    const { showId, movieId } = req.params;
    const findMovie = await Movie.findOne({ movieId });
    if (findMovie) {
      const prevMovieShows = findMovie.shows || [];
      const filteredShows = prevMovieShows.filter((s) => s !== showId);
      await Movie.updateOne(
        { movieId },
        {
          $set: {
            shows: filteredShows,
          },
        }
      );
    } else {
      console.warn("deleteShow: Movie not found for movieId:", movieId);
    }

    // Cascade delete any bookings tied to this show to avoid orphan bookings
    await Booking.deleteMany({ showId });
    await Show.deleteOne({ showId });
    return res.json({ status: true, msg: "Show deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :)" });
  }
};

