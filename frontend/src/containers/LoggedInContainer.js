import React, { useState, Fragment, useContext, useEffect } from "react";
import IconText from "../components/IconText";
import logo from "../images/logo4.png";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Menu, Transition } from "@headlessui/react";
import MusicFooter from "../components/MusicFooter";
import { toast } from "react-toastify";
import { useAudio } from "../contexts/AudioContext";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const LoggedInContainer = ({ children, curActiveScreen }) => {
  const { currentSong } = useAudio() || {};

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-black w-full h-full">
      <Navbar toggleSidebar={toggleSidebar} />
      <div>
        <Sidebar
          curActiveScreen={curActiveScreen}
          isSidebarOpen={isSidebarOpen}
        />
        <div
          className={`${
            currentSong?._id ? " h-auto mb-24 " : ""
          } p-8 h-full  rounded-lg  sm:ml-64  bg-app-black m-2 mt-20  overflow-auto `}
        >
          {children}
        </div>
      </div>
      {/* This div is the current playing song */}
      {currentSong && currentSong._id && <MusicFooter />}
    </div>
  );
};

export default LoggedInContainer;
