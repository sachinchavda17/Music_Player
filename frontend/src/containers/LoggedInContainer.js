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

const LoggedInContainer = ({ children, curActiveScreen }) => {
  const { currentSong, stopMusicLogout } = useAudio() || {};
  const { isAuthenticated, user, logoutCookie ,cookies} = useAuth();

  const handleLogout = () => {
    logoutCookie();
    stopMusicLogout();
    toast.success("Successfully Logout.");
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-black w-full h-full">
      <nav className="fixed top-0 z-50 w-full text-white border-b  bg-app-black border-darkGray-light">
        <div className="px-3 py-1 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm  rounded-lg sm:hidden  focus:outline-none focus:ring-2 text-lightGray hover:bg-darkGray-light focus:ring-darkGray-light"
                onClick={toggleSidebar} // Make sure the click event is handled
              >
                <span className="sr-only">Open sidebar</span>
                <Icon
                  icon={"solar:hamburger-menu-broken"}
                  className={`text-primary `}
                  fontSize={27}
                />
              </button>
              <Link to="/" className="flex ms-2 md:me-24 w-1/2 sm:w-full">
                <img
                  src={logo}
                  alt="BeatFlow logo"
                  width={125}
                  className="hover:opacity-80"
                />
              </Link>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <Menu as="div" className="relative ml-3">
                  <div>
                    {isAuthenticated ? (
                      <Menu.Button className="flex max-w-xs items-center sm:rounded-lg sm:bg-darkGray-light text-sm  ">
                        <span className="sr-only">Open user menu</span>
                        <div className="bg-primary text-white p-2 cursor-pointer hidden sm:flex items-center rounded-lg">
                          <div className="mr-2 overflow-hidden rounded-md">
                            <Icon
                              icon="ep:user-filled"
                              width={"23"}
                              color="white"
                            />
                          </div>
                          <div className="mr-2 text-sm capitalize ">
                            {isAuthenticated && user?.firstName}
                          </div>
                          <div>
                            <Icon
                              icon="mingcute:down-fill"
                              width={"20"}
                              color="white"
                            />
                          </div>
                        </div>
                        <div className="sm:hidden  ">
                          <Icon
                            icon="ri:more-2-fill"
                            width={"25"}
                            className="text-primary"
                          />
                        </div>
                      </Menu.Button>
                    ) : (
                      <Link to="/login">
                        <div className="text-xs sm:text-sm text-lightGray-light  bg-primary hover:bg-primary-light px-6 py-3 flex items-center justify-center rounded-full font-semibold cursor-pointer">
                          LOGIN
                        </div>
                      </Link>
                    )}
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-darkGray py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div>
                        <Link
                          to={"/profile"}
                          className={
                            "bg-darkGray block px-4 py-2 text-sm text-lightGray-light hover:bg-darkGray-light"
                          }
                        >
                          Profile
                        </Link>
                        <Link
                          to={"/uploadSong"}
                          className={
                            "bg-darkGray block px-4 py-2 text-sm text-lightGray-light hover:bg-darkGray-light"
                          }
                        >
                          Upload Song
                        </Link>
                        <div
                          onClick={handleLogout}
                          className={
                            "bg-darkGray block px-4 py-2 text-sm text-lightGray-light hover:bg-darkGray-light"
                          }
                        >
                          Logout
                        </div>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div>
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

        <div
          className={`${
            currentSong?._id ? " h-auto " : ""
          } p-8 h-full  rounded-lg  sm:ml-64  bg-app-black mt-14  overflow-auto `}
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
