import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/adminHeader/AdminHeader";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "./style.scss";
import { MdMovieFilter } from "react-icons/md";
import Loader from "../../components/loader/Loader";
import { AiOutlineDelete } from "react-icons/ai";
import useSWR from "swr";
import { BiCameraMovie } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { render } from "../../host";

const Admin = () => {
  const navigate = useNavigate();
  const adminToken = Cookies.get("adminJwtToken");
  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    closeOnClick: true,
  };

  const fetcher = async (url) => {
    try {
      const { data } = await axios.get(url, {
        headers: {
          "auth-token": adminToken,
        },
      });
      if (data?.status) {
        return data?.adminShows;
      } else {
        toast.error("Something went wrong!", toastOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetcherBookings = async (url) => {
    try {
      console.log("Fetching bookings from:", url, "with token:", !!adminToken);
      const { data } = await axios.get(url, {
        headers: {
          "auth-token": adminToken,
        },
      });
      if (data?.status) {
        console.log("Bookings fetched:", data?.bookings?.length);
        return data?.bookings;
      } else {
        toast.error("Failed to load bookings", toastOptions);
      }
    } catch (error) {
      console.log("Bookings fetch error:", error);
    }
  };

  const {
    isLoading,
    data: showsData,
    mutate,
  } = useSWR(adminToken ? `${render}/api/shows/getadminshows` : null, fetcher);

  const {
    isLoading: bookingsLoading,
    data: bookingsData,
    error: bookingsError,
    mutate: mutateBookings,
  } = useSWR(`${render}/api/bookings/getallbookings`, fetcherBookings);

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin/login");
    }
  }, [adminToken, navigate]);

  showsData?.sort(function (a, b) {
    // Concatenate date and time strings for comparison
    var datetimeA = new Date(a.showdate + "T" + a.showtime + "Z");
    var datetimeB = new Date(b.showdate + "T" + b.showtime + "Z");

    return datetimeA - datetimeB;
  });

  function convertTo12HourFormat(time24) {
    // Split the time string into hours and minutes
    var [hours, minutes] = time24.split(":");

    // Convert hours to integer
    hours = parseInt(hours);

    // Determine AM or PM
    var meridiem = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    hours = hours % 12 || 12;

    // Format the time string in 12-hour format
    var time12 = hours + ":" + minutes + " " + meridiem;

    return time12;
  }

  function getTotalTickets(ticketsData) {
    try {
      if (!ticketsData || typeof ticketsData !== "object") return 0;
      const sections = ["balcony", "middle", "lower"];
      let total = 0;
      sections.forEach((sec) => {
        const v = ticketsData[sec];
        if (Array.isArray(v)) total += v.length;
        else if (v && typeof v === "object") total += Object.keys(v).length;
      });
      return total;
    } catch {
      return 0;
    }
  }

  const handleDelete = async (showId, movieId) => {
    try {
      const host = `${render}/api/shows/deleteshow/${movieId}/${showId}`;
      const { data } = await axios.delete(host, {
        headers: {
          "auth-token": adminToken,
        },
      });
      console.log(data);
      if (data?.status) {
        toast.success(data.msg, toastOptions);
        mutate();
      } else {
        toast.error(data.msg, toastOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="adminContainer">
        {/* Shows Section */}
        <div className="wrapper">
          <h1>
            Admin <span>Shows</span>
          </h1>
          {isLoading ? (
            <div className="loadingContainer">
              <Loader />
            </div>
          ) : showsData?.length > 0 ? (
            <ul className="showsContainer">
              {showsData?.map((s, i) => {
                const upperCaseTheatre =
                  typeof s?.theatreName === "string" && s.theatreName.length
                    ? s.theatreName[0].toUpperCase() + s.theatreName.slice(1)
                    : s?.theatreName || "";

                const upperCaseMovie =
                  typeof s?.movieName === "string" && s.movieName.length
                    ? s.movieName[0].toUpperCase() + s.movieName.slice(1)
                    : s?.movieName || "Unknown";

                return (
                  <li key={i}>
                    <BiCameraMovie />
                    <div className="right">
                      <div>
                        <span>Movie:</span>
                        <p>{upperCaseMovie}</p>
                      </div>
                      <div>
                        <span>Theatre:</span>
                        <p>{upperCaseTheatre}</p>
                      </div>
                      <div>
                        <span>Showdate:</span>
                        <p>{dayjs(s?.showdate).format("MMM D, YYYY")}</p>
                      </div>
                      <div>
                        <span>Showtime:</span>
                        <p>{convertTo12HourFormat(s?.showtime)}</p>
                      </div>

                      <button onClick={() => handleDelete(s.showId, s.movieId)}>
                        <AiOutlineDelete />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="noShowsContainer">
              <MdMovieFilter
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/admin/addshow");
                }}
              />
              <h1>Create a movie show</h1>
            </div>
          )}
        </div>

        {/* All Bookings Section */}
        <div className="wrapper" style={{ marginTop: 24 }}>
          <h1>
            All <span>Bookings</span>
          </h1>
          {!bookingsData && !bookingsError ? (
            <div className="loadingContainer">
              <Loader />
            </div>
          ) : bookingsData && bookingsData.length > 0 ? (
            <ul className="showsContainer">
              {bookingsData.map((b, idx) => (
                <li key={idx}>
                  <BiCameraMovie />
                  <div className="right">
                    <div>
                      <span>User:</span>
                      <p>{b.userName || b.userEmail}</p>
                    </div>
                    <div>
                      <span>Movie:</span>
                      <p>{b.movieName}</p>
                    </div>
                    <div>
                      <span>Theatre:</span>
                      <p>{b.theatreName}</p>
                    </div>
                    <div>
                      <span>Showdate:</span>
                      <p>{dayjs(b?.showdate).format("MMM D, YYYY")}</p>
                    </div>
                    <div>
                      <span>Showtime:</span>
                      <p>{convertTo12HourFormat(b?.showtime)}</p>
                    </div>
                    <div>
                      <span>Tickets:</span>
                      <p>{getTotalTickets(b?.ticketsData)}</p>
                    </div>
                    <div>
                      <span>Booking ID:</span>
                      <p>{b.bookingId}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="noShowsContainer">
              <MdMovieFilter />
              <h1>No bookings yet</h1>
            </div>
          )}
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Admin;
