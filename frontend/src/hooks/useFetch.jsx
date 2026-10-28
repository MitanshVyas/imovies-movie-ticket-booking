import { useContext, useEffect, useState } from "react";
import { fetchDataFromApi } from "../utils/fetchApi";
import { searchContext } from "../context/searchContext";

const useFetch = (url, params) => {
  const [resData, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const { query } = useContext(searchContext);

  useEffect(() => {
    setLoading(true);
    setData(null);
    setError(null);

    // Create query params object
    const queryParams = { ...params };
    if (query) {
      queryParams.query = query; // Add search query to params
    }

    fetchDataFromApi(url, queryParams)
      .then((res) => {
        setLoading(false);
        setData(res);
      })
      .catch((err) => {
        setLoading(false);
        setError("Something went wrong!");
      });
  }, [url, query, params]);
  return { resData, loading, error };
};

export default useFetch;
