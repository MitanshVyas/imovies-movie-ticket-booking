import React, { useEffect, useState } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import Cookies from "js-cookie";
import { app } from "../../utils/firebase";
import axios from "axios";
import { FcAddImage } from "react-icons/fc";
import { ToastContainer, toast } from "react-toastify";
import { FcCancel } from "react-icons/fc";
import { MdClose } from "react-icons/md";
import AdminHeader from "../../components/adminHeader/AdminHeader";
import { render } from "../../host";
import AdminMovies from "../adminMovies/AdminMovies";
import useSWR from "swr";
import Loader from "../../components/loader/Loader";

const toastOptions = {
  position: "bottom-right",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
  closeOnClick: true,
};

const AddMovie = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [movieDetails, setMovieDetails] = useState({
    name: "",
    description: "",
    genres: "",
    releaseDate: "",
    runtime: "",
    certification: "",
    trailerUrl: "",
  });
  const [file, setFile] = useState("");
  const [media, setMedia] = useState("");
  const [crew, setCrew] = useState([]);
  const [editMovie, setEditMovie] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);
  const navigate = useNavigate();

  const fetcher = async (url) => {
    try {
      const { data } = await axios.get(url);
      if (data.status) {
        return data.movies;
      } else {
        toast.error(data.msg, toastOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const {
    data: movies,
    loading,
    error,
    mutate,
  } = useSWR(`${render}/api/movie/getmovies`, fetcher);

  useEffect(() => {
    const jwtToken = Cookies.get("adminJwtToken");
    if (!jwtToken) {
      navigate("/admin/login");
    }
  }, []);

  const handleValidation = () => {
    const { name, description, genres, releaseDate, runtime, certification } =
      movieDetails;

    if (name === "") {
      toast.error("Enter name of movie!", toastOptions);
      return false;
    } else if (description === "") {
      toast.error("Enter Description of movie!", toastOptions);
      return false;
    } else if (genres === "") {
      toast.error("Enter genres of movie!", toastOptions);
      return false;
    } else if (releaseDate === "") {
      toast.error("Enter release date of movie!", toastOptions);
      return false;
    } else if (runtime === null) {
      toast.error("Enter runtime of movie!", toastOptions);
      return false;
    } else if (certification === "") {
      toast.error("Enter certification of movie!", toastOptions);
      return false;
    }
    if (media === "") {
      toast.error("Add show thumbnail !", toastOptions);
      return false;
    }
    return true;
  };

  const onClickEdit = async () => {
    try {
      setLoadingForm(true);
      const url = `${render}/api/movie/getmoviedetails/${editMovie}`;
      const { data } = await axios.get(url);
      console.log(data);
      if (data.status) {
        const {
          movieName,
          description,
          genres,
          releaseDate,
          runtime,
          certification,
          media,
          crew,
          trailerUrl,
        } = data.movie;
        const editMovieData = {
          name: movieName,
          description,
          genres,
          releaseDate,
          runtime,
          certification,
          trailerUrl: trailerUrl || "",
        };
        setMovieDetails(editMovieData);
        setMedia(media);
        setCrew(Array.isArray(crew) ? crew : []);
        setLoadingForm(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (editMovie) {
      onClickEdit();
    } else {
      setMovieDetails({
        name: "",
        description: "",
        genres: "",
        releaseDate: "",
        runtime: "",
        certification: "",
        trailerUrl: "",
      });
      setMedia("");
      setFile("");
      setCrew([]);
    }
  }, [editMovie]);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      if (!editMovie) {
        toast.error("No movie selected for editing", toastOptions);
        return;
      }

      if (!handleValidation()) {
        return;
      }

      const url = `${render}/api/movie/editmovie/${editMovie}`;
      const adminToken = Cookies.get("adminJwtToken");

      if (!adminToken) {
        toast.error(
          "Authentication required. Please log in again.",
          toastOptions
        );
        navigate("/admin/login");
        return;
      }

      const requestData = {
        name: movieDetails.name.toLowerCase(),
        description: movieDetails.description,
        genres: movieDetails.genres,
        releaseDate: movieDetails.releaseDate,
        runtime: Number(movieDetails.runtime),
        certification: movieDetails.certification,
        trailerUrl: movieDetails.trailerUrl || "",
        media: media,
        crew: crew.map((member) => ({
          id: member.id || v4(),
          name: member.name,
          role: member.role,
          image: member.image || "",
        })),
        movieId: editMovie,
      };

      console.log("Sending update request to:", url);
      console.log("Request data:", JSON.stringify(requestData, null, 2));

      const response = await axios.put(url, requestData, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": adminToken,
          Authorization: `Bearer ${adminToken}`,
        },
        validateStatus: (status) => status < 500,
      });

      console.log("Update response status:", response.status);
      console.log("Update response data:", response.data);

      const { data } = response;

      // If unauthorized, redirect to login
      if (response.status === 401 || response.status === 403) {
        toast.error(
          data.msg || "Session expired. Please log in again.",
          toastOptions
        );
        navigate("/admin/login");
        return;
      }

      if (data.status) {
        toast.success(data.msg || "Movie updated successfully!", toastOptions);
        // Reset form after successful update
        setMovieDetails({
          name: "",
          description: "",
          genres: "",
          releaseDate: "",
          runtime: "",
          certification: "",
          trailerUrl: "",
        });
        setMedia("");
        setFile("");
        setCrew([]);
        setEditMovie("");
        mutate(); // Refresh the movie list
      } else {
        toast.error(
          data.msg || "Failed to update movie. Please try again.",
          toastOptions
        );
      }
    } catch (error) {
      console.error("Error updating movie:", error);
      toast.error(
        error.response?.data?.msg || "Error updating movie. Please try again.",
        toastOptions
      );
    }
  };

  const handleFile = () => {
    // The bundled RRR image is already served from the public directory.
    // Use it directly so the demo works without the original Firebase config.
    if (file && file.name === "rrrimages.webp") {
      const localMediaUrl = `${window.location.origin}/images/rrrimages.webp`;
      setMedia(localMediaUrl);
      setMovieDetails((current) => ({ ...current, media: localMediaUrl }));
      return;
    }
    const storage = getStorage(app);
    const upload = () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, name);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setMedia(downloadURL);
            setMovieDetails({ ...movieDetails, media: downloadURL });
          });
        }
      );
    };

    if (file) {
      upload();
    }
  };

  // Crew helpers
  const addCrewMember = () => {
    setCrew((prev) => [...prev, { id: v4(), name: "", role: "", image: "" }]);
  };

  const removeCrewMember = (id) => {
    setCrew((prev) => prev.filter((m) => m.id !== id));
  };

  const handleCrewFieldChange = (id, field, value) => {
    setCrew((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleCrewImageSelect = (id, file) => {
    if (!file) return;
    const storage = getStorage(app);
    const name = new Date().getTime() + file.name;
    const storageRef = ref(storage, name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      () => {},
      () => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setCrew((prev) =>
            prev.map((m) => (m.id === id ? { ...m, image: downloadURL } : m))
          );
        });
      }
    );
  };

  useEffect(() => {
    handleFile();
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);

    if (!handleValidation()) {
      setLoadingForm(false);
      return;
    }

    try {
      const host = `${render}/api/movie/addmovie`;
      const jwtToken = Cookies.get("adminJwtToken");

      if (!jwtToken) {
        toast.error(
          "Authentication required. Please log in again.",
          toastOptions
        );
        navigate("/admin/login");
        setLoadingForm(false);
        return;
      }

      // Format the request data to match backend expectations
      const requestData = {
        name: movieDetails.name.toLowerCase(),
        description: movieDetails.description,
        genres: Array.isArray(movieDetails.genres)
          ? movieDetails.genres
          : movieDetails.genres.split(",").map((g) => g.trim()),
        releaseDate: movieDetails.releaseDate,
        runtime: Number(movieDetails.runtime),
        certification: movieDetails.certification,
        trailerUrl: movieDetails.trailerUrl || "",
        media: media,
        movieId: v4(), // Generate a unique movie ID
        crew: crew.map((member) => ({
          id: member.id || v4(), // Use existing ID or generate a new one
          name: member.name,
          role: member.role,
          image: member.image || "",
        })),
      };

      console.log("Sending request to:", host);
      console.log("Request data:", JSON.stringify(requestData, null, 2));

      const response = await axios.post(host, requestData, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": jwtToken,
          Authorization: `Bearer ${jwtToken}`,
        },
        validateStatus: (status) => status < 500,
      });

      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      if (response.status === 200 && response.data.status) {
        // Show success message
        toast.success("Movie added successfully!", toastOptions);

        // Reset form on success
        setMovieDetails({
          name: "",
          description: "",
          genres: "",
          releaseDate: "",
          runtime: "",
          certification: "",
          trailerUrl: "",
        });
        setMedia("");
        setFile(null);
        setCrew([]);

        // Refresh the movie list
        await mutate();

        // Navigate to admin page after a short delay
        setTimeout(() => {
          navigate("/admin");
        }, 1000);
      } else {
        const errorMsg =
          response.data?.msg || "Failed to add movie. Please try again.";
        console.error("Server error:", errorMsg);
        toast.error(errorMsg, toastOptions);
      }
    } catch (error) {
      console.error("Error adding movie:", error);
      const errorMsg =
        error.response?.data?.msg ||
        "An error occurred while adding the movie.";
      toast.error(errorMsg, toastOptions);
    } finally {
      setLoadingForm(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setMovieDetails({ ...movieDetails, [e.target.name]: val });
  };

  // Check for authentication
  useEffect(() => {
    const checkAuth = async () => {
      const jwtToken = Cookies.get("adminJwtToken");
      console.log("Admin JWT Token:", jwtToken ? "Exists" : "Missing");

      if (!jwtToken) {
        console.log("No admin token found, redirecting to login");
        navigate("/admin/login");
        toast.error("Please login to continue", toastOptions);
      } else {
        console.log("User is authenticated as admin");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  console.log("Rendering AddMovie component");

  if (isLoading) {
    return (
      <div className="loadingContainer">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <AdminHeader />
      <div className="addMoviePage">
        <h1 className="pageTitle">
          {editMovie ? "Edit Movie" : "Add New Movie"}
        </h1>
        {loadingForm ? (
          <div className="loadingContainer">
            <Loader />
          </div>
        ) : (
          <div className="addMovie">
            <form
              onSubmit={editMovie ? handleEdit : handleSubmit}
              className="showDetailsForm"
            >
              <div className="topRow">
                <div className="image">
                  {media === "" ? (
                    <>
                      <div className="imageContainer">
                        <label htmlFor="image">
                          <FcAddImage />
                        </label>
                      </div>

                      <input
                        onChange={(e) => setFile(e.target.files[0])}
                        style={{ display: "none" }}
                        id="image"
                        type="file"
                      />
                    </>
                  ) : (
                    <div className="mediaImage">
                      <img src={media} className="image" />
                    </div>
                  )}

                  <button className="cancel">
                    <FcCancel
                      onClick={(e) => {
                        e.preventDefault();
                        setFile("");
                        setMedia("");
                      }}
                    />
                  </button>
                </div>
                <div className="details">
                  <h3>
                    {editMovie ? "Edit" : "Add"}{" "}
                    <span style={{ color: "crimson" }}>Movie</span>
                  </h3>

                  <div className="inputGrid">
                    <div className="inputContainer">
                      <label htmlFor="name">Movie</label>
                      <input
                        value={movieDetails.name}
                        onChange={handleChange}
                        placeholder="Enter movie name"
                        name="name"
                        type="text"
                        id="name"
                      />
                    </div>

                    <div className="inputContainer">
                      <label htmlFor="desc">Description</label>
                      <input
                        value={movieDetails.description}
                        onChange={handleChange}
                        placeholder="Enter movie description"
                        name="description"
                        id="desc"
                        type="text"
                      />
                    </div>

                    <div className="inputContainer">
                      <label htmlFor="genre">Genres</label>
                      <input
                        value={movieDetails.genres}
                        onChange={handleChange}
                        placeholder="Enter movie genres seperated by comma."
                        name="genres"
                        type="text"
                        id="genre"
                      />
                    </div>

                    <div className="inputContainer">
                      <label htmlFor="releasedate">Release Date</label>
                      <input
                        value={movieDetails.releaseDate}
                        onChange={handleChange}
                        name="releaseDate"
                        type="date"
                        id="releasedate"
                      />
                    </div>

                    <div className="inputContainer">
                      <label htmlFor="time">Runtime</label>
                      <input
                        value={movieDetails.runtime}
                        onChange={handleChange}
                        placeholder="Enter runtime in minutes"
                        name="runtime"
                        type="number"
                        id="time"
                      />
                    </div>

                    <div className="inputContainer">
                      <label htmlFor="certification">Certification</label>
                      <input
                        value={movieDetails.certification}
                        onChange={handleChange}
                        placeholder="Enter movie certification"
                        name="certification"
                        type="text"
                        id="certification"
                      />
                    </div>

                    <div className="inputContainer">
                      <label htmlFor="trailerUrl">Trailer URL (YouTube)</label>
                      <input
                        value={movieDetails.trailerUrl}
                        onChange={handleChange}
                        placeholder="https://www.youtube.com/watch?v=..."
                        name="trailerUrl"
                        type="url"
                        id="trailerUrl"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* end topRow */}

              {/* Crew Card - now below the movie card */}
              <div className="crewCard">
                <h3>
                  Crew <span style={{ color: "crimson" }}>Members</span>
                </h3>
                {crew?.length === 0 && (
                  <p style={{ opacity: 0.7 }}>
                    No crew added yet. Use "Add Member".
                  </p>
                )}
                <div className="crewList" style={{ display: "grid", gap: 12 }}>
                  {crew?.map((m) => (
                    <div
                      key={m.id}
                      className="crewItem"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "100px 1fr 1fr auto",
                        gap: 12,
                        alignItems: "center",
                      }}
                    >
                      <div>
                        {m.image ? (
                          <img
                            src={m.image}
                            alt={m.name}
                            style={{
                              width: 100,
                              height: 100,
                              objectFit: "cover",
                              borderRadius: 8,
                            }}
                          />
                        ) : (
                          <label
                            htmlFor={`crew-image-${m.id}`}
                            style={{
                              width: 100,
                              height: 100,
                              border: "1px dashed #aaa",
                              borderRadius: 8,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            <FcAddImage />
                          </label>
                        )}
                        <input
                          id={`crew-image-${m.id}`}
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) =>
                            handleCrewImageSelect(m.id, e.target.files[0])
                          }
                        />
                      </div>

                      <input
                        value={m.name}
                        onChange={(e) =>
                          handleCrewFieldChange(m.id, "name", e.target.value)
                        }
                        placeholder="Name"
                        type="text"
                      />

                      <input
                        value={m.role}
                        onChange={(e) =>
                          handleCrewFieldChange(m.id, "role", e.target.value)
                        }
                        placeholder="Role (e.g., Hero, Heroine, Director)"
                        type="text"
                      />

                      <button
                        className="cancel"
                        onClick={(e) => {
                          e.preventDefault();
                          removeCrewMember(m.id);
                        }}
                        title="Remove member"
                      >
                        <MdClose />
                      </button>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 8 }}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addCrewMember();
                    }}
                    type="button"
                    style={{
                      marginRight: '10px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    + Add Member
                  </button>
                  <button 
                    type="submit"
                    style={{
                      backgroundColor: '#1890ff',
                      color: 'white',
                      border: 'none',
                      padding: '8px 24px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    {editMovie ? 'Save Changes' : 'Submit Movie'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {movies?.length > 0 && (
          <>
            <h1
              style={{
                textAlign: "center",
                backgroundColor: "crimson",
                color: "white",
              }}
            >
              Available Movies
            </h1>
            <AdminMovies
              movies={movies}
              loading={loading}
              setEditMovie={setEditMovie}
              onDeleteMovie={async (movieId) => {
                try {
                  const response = await axios.delete(
                    `${render}/api/movie/deletemovie/${movieId}`,
                    {
                      headers: {
                        "auth-token": Cookies.get("adminJwtToken"),
                        Authorization: `Bearer ${Cookies.get("adminJwtToken")}`,
                      },
                    }
                  );

                  if (response.data.status) {
                    toast.success("Movie deleted successfully!", toastOptions);
                    // Refresh the movie list
                    mutate(`${render}/api/movie/getmovies`);
                  } else {
                    toast.error(
                      response.data.msg || "Failed to delete movie",
                      toastOptions
                    );
                  }
                } catch (error) {
                  console.error("Error deleting movie:", error);
                  toast.error(
                    error.response?.data?.msg || "Error deleting movie",
                    toastOptions
                  );
                }
              }}
            />
          </>
        )}
        <ToastContainer />
      </div>
    </>
  );
};

export default AddMovie;
