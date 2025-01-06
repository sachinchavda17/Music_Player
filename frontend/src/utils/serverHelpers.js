const BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Generalized GET request
export const getDataApi = async (endpoint, token) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response text:", errorText);
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Generalized POST request
export const postDataApi = async (endpoint, data, token) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    const jsonResponse = await response.json(); // Always parse the response
    console.log(response);
    console.log(jsonResponse);
    if (!response.ok) {
      // If the response is not ok, throw an error with the message from the server
      throw new Error(jsonResponse.error || "Failed to post data");
    }
    return jsonResponse;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

// Generalized PUT (Update) request
export const updateDataApi = async (endpoint, data, token) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
};

// Generalized DELETE request
export const deleteDataApi = async (endpoint, token) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};
