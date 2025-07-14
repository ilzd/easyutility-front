import { useState, useEffect, useCallback } from 'react';
import { fetchFromAPI } from '../api';

/**
 * A custom hook to fetch data from the API.
 * @param {string | null} endpoint - The API endpoint to fetch. If null, no request will be made.
 * @returns {{data: any, isLoading: boolean, error: Error|null}}
 */
export const useApi = (endpoint) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    // *** FIX: Add this guard clause ***
    // If the endpoint is null or falsy, don't do anything.
    if (!endpoint) {
      setData(null); // Clear previous data
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFromAPI(endpoint);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error };
};
