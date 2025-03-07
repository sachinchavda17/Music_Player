import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoggedInContainer from "../containers/LoggedInContainer";

const UploadSongNonArtist = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6 rounded-lg shadow-lg max-w-2xl w-full">
      <h2 className="text-xl font-bold mb-4 text-lightGray-light">
        Upload Your Song
      </h2>
      <div>
        <p className="text-lightGray mb-4">
          To upload a song, you must become an artist.
        </p>
        <p className="text-lightGray mb-4">
          Here's how you can become an artist:
        </p>
        <ol className="list-disc pl-6 text-lightGray">
          <li>Go to your profile page.</li>
          <li>Update your profile by marking yourself as an artist. </li>
          <li>Update your IsArtist field to yes. </li>
          <li>
            Once your profile is updated, you will be able to upload songs here!
          </li>
        </ol>
        <button
          onClick={() => navigate("/profile")}
          className="mt-4 w-1/2 bg-primary hover:bg-primary-light text-white py-2 px-4 rounded-md focus:outline-none"
        >
          Go to Profile
        </button>
      </div>
    </div>
  );
};

export default UploadSongNonArtist;
