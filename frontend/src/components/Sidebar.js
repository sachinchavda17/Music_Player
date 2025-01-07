import React, { useState } from "react";
import { useAudio } from "../contexts/AudioContext";
import { useAuth } from "../contexts/AuthContext";
import IconText from "./IconText";

const Sidebar = ({ curActiveScreen, isSidebarOpen }) => {
  const { currentSong } = useAudio() || {};
  const { isAuthenticated, user } = useAuth();

  return (
    <aside
      id="logo-sidebar"
      className={` ${
        currentSong?._id ? " h-auto " : "h-full"
      } fixed top-0 left-0 z-40 w-64 pt-20  transition-all duration-200 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0 bg-black overflow-auto`}
      aria-label="Sidebar"
    >
      <div className="h-full pb-4 overflow-y-auto ">
        <div className="py-5 px-2 bg-app-black m-2 rounded">
          <IconText
            iconName={"material-symbols:home"}
            displayText={"Home"}
            targetLink={"/"}
            active={curActiveScreen === "home"}
          />
          <IconText
            iconName={"material-symbols:search-rounded"}
            displayText={"Search"}
            active={curActiveScreen === "search"}
            targetLink={"/search"}
          />
          {isAuthenticated && user?.isArtist && (
            <>
              <IconText
                iconName={"basil:edit-solid"}
                displayText={"Edit Page"}
                active={curActiveScreen === "edit"}
                targetLink={"/edit"}
              />
              <IconText
                iconName={"material-symbols:library-music-sharp"}
                displayText={"My Music"}
                targetLink="/myMusic"
                active={curActiveScreen === "myMusic"}
              />
            </>
          )}
          {isAuthenticated && (
            <IconText
              iconName={"mdi:cards-heart"}
              displayText={"Liked Songs"}
              targetLink={"/likedsong"}
              active={curActiveScreen === "likedsong"}
            />
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
