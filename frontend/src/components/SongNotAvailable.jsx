// SongNotAvailable.js
import React from "react";
import errorImg from "../images/error.png";
import {  useNavigate } from "react-router-dom";

const SongNotAvailable = () => {
  const navigate = useNavigate()
  return (
    <div className="w-full flex flex-col items-center justify-center text-center h-96 bg-black-light p-4">
      <img
        src={errorImg}
        alt="Song Not Available"
        className="mb-6 w-36 h-36 mx-auto "
      />
      <h1 className="text-2xl font-bold text-lightGray-light mb-2">
        Song Not Available
      </h1>
      <p className="text-lightGray mb-4">
        We're sorry, but the song you're looking for is not available at the
        moment.
      </p>
      <button
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-light transition duration-200"
        onClick={() => {
          navigate("/");
        }}
      >
        Go Back Home
      </button>
    </div>
  );
};

export default SongNotAvailable;
