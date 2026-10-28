import React, { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Show from "../../components/show/Show";
import FeaturedMovie from "../../components/featuredMovie/FeaturedMovie";
import useFetch from "../../hooks/useFetch";
import "./style.scss";
import Loader from "../../components/loader/Loader";
import { searchContext } from "../../context/searchContext";
import Cookies from "js-cookie";

// Skeleton Loader Component
const MovieSkeleton = () => (
  <div className="movieSkeleton">
    <div className="skeletonImage"></div>
    <div className="skeletonTitle"></div>
    <div className="skeletonMeta"></div>
  </div>
);

const Home = () => {
  const { query } = useContext(searchContext);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();
  
  // Memoize the query params to prevent unnecessary re-renders
  const queryParams = useMemo(() => ({ query }), [query]);
  
  const { resData, error, loading } = useFetch(
    `/api/movie/getmovies`,
    queryParams
  );

  // Check authentication but don't redirect - home page is public
  useEffect(() => {
    const token = Cookies.get('jwtToken');
    if (!token) {
      // Don't redirect, just log for debugging
      console.log('No auth token - allowing public access to home');
    }
    
    
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => {
      clearTimeout(timer);
    };
  }, [navigate]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error("Error fetching movies:", error);
    }
  }, [error]);

  // Show skeleton loaders while loading
  if (!showContent || loading) {
    return (
      <div className="homeContainer">
        <Header />
        <div className="home">
          <div className="skeletonFeatured"></div>
          <h1>
            Loading <span>Movies</span>
          </h1>
          <div className="moviesContainer">
            {[...Array(8)].map((_, i) => (
              <MovieSkeleton key={i} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="homeContainer">
      <Header />
      <div className="home">
        {resData?.data?.movies?.[0] && (
          <div className="featuredMovieContainer">
            <FeaturedMovie movie={resData.data.movies[0]} />
          </div>
        )}

        <h1>
          {resData?.data?.movies?.length ? 'Available' : 'No'} <span>Movies</span>
        </h1>
        
        {resData?.data?.movies?.length > 0 ? (
          <ul className="moviesContainer">
            {resData.data.movies.map((movie) => (
              <Show key={movie._id} data={movie} />
            ))}
          </ul>
        ) : (
          <div className="noMovies">No movies found. Try a different search.</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
