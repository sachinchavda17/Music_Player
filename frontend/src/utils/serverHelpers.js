import axios from "axios";
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

// GET request
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

// POST request
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

    const jsonResponse = await response.json();
    if (!response.ok) {
      throw new Error(jsonResponse.error || "Failed to post data");
    }
    return jsonResponse;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

// PUT (Update) request
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

// DELETE request
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

// POST and PUT request for file uploadation
export const fileUploadHandler = async (endpoint, method, formData, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const response =
      method === "post"
        ? await axios.post(`${BASE_URL}${endpoint}`, formData, config)
        : await axios.put(`${BASE_URL}${endpoint}`, formData, config);
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.err || "An error occurred.");
    }
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.err || "An error occurred.");
    }
    throw new Error("Failed to upload file. Please try again.");
  }
};
