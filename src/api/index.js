const API_BASE_URL = 'http://localhost:5000/api'; // Your backend URL

/**
 * A helper function to fetch data from the API.
 * @param {string} endpoint - The API endpoint to fetch from (e.g., '/maps').
 * @returns {Promise<any>} - The JSON response from the API.
 */
export const fetchFromAPI = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      // If the server responds with a status code outside the 200-299 range,
      // we throw an error to be caught by the calling function.
      throw new Error(`API call failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    // Re-throw the error so the component using this service can handle it.
    throw error;
  }
};

export const postToAPI = async (endpoint, body) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API POST Error:", error);
    throw error;
  }
};