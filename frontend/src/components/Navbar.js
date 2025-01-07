import React, { useState, Fragment } from "react";
import logo from "../images/logo4.png";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { Menu, Transition } from "@headlessui/react";
import { useAudio } from "../contexts/AudioContext";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const { stopMusicLogout } = useAudio() || {};
  const { isAuthenticated, user, logoutCookie } = useAuth();

  const handleLogout = () => {
    logoutCookie();
    stopMusicLogout();
    toast.success("Successfully Logout.");
  };

  return (
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
                          "bg-darkGray block px-4 py-2 text-sm cursor-pointer text-lightGray-light hover:bg-darkGray-light"
                        }
                      >
                        Profile
                      </Link>
                      <Link
                        to={"/uploadSong"}
                        className={
                          "bg-darkGray block px-4 py-2 text-sm cursor-pointer text-lightGray-light hover:bg-darkGray-light"
                        }
                      >
                        Upload Song
                      </Link>
                      <div
                        onClick={handleLogout}
                        className={
                          "bg-darkGray block px-4 py-2 text-sm cursor-pointer text-lightGray-light hover:bg-darkGray-light"
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
  );
};

export default Navbar;
