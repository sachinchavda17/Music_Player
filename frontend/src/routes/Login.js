import { useState } from "react";
import { Icon } from "@iconify/react";
import TextInput from "../components/TextInput";
import PasswordInput from "../components/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import {  postDataApi } from "../utils/serverHelpers";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import logo from "../images/logo4.png";
import { useAuth } from "../contexts/AuthContext";

const LoginComponent = () => {
  const { loginCookie } = useAuth();
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const login = async (loginData) => {
    try {
      setLoading(true);
      const data = {
        email: loginData.email.toLowerCase(),
        password: loginData.password,
      };
      const response = await postDataApi("/auth/login", data);
      if (!response.success) {
        return toast.error("Login failed");
      }
      toast.success("Successfully Login");
      loginCookie(response.token);
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          email:response.user.email,
          profileBackground:response.user.profileBackground,
          profileText:response.user.profileText,
          username:response.user.username,
          joinDate:response.user.joinDate,
          isArtist: response.user.isArtist,
          _id: response.user._id,
        })
      );
      navigate("/");
    } catch (err) {
      setLoading(false);
      toast.error("An error occurred" + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* {loading && <Loading fullScreen={true} />} */}
      <div className="w-full h-full flex flex-col items-center bg-black overflow-auto ">
        <div className="logo p-5 border-b border-solid border-lightGray-light w-full flex justify-center">
          <Link to={"/"} className="flex justify-center">
            <img
              src={logo}
              alt="BeatFlow logo"
              width={125}
              className="hover:opacity-80"
            />
          </Link>
        </div>
        <div className="inputRegion w-full px-5 sm:w-1/3 py-10 flex items-center justify-center flex-col text-lightGray-light">
          <div className="font-bold mb-4 text-center">
            To continue, log in to BeatFlow.
          </div>
          <form
            onSubmit={handleSubmit((data) => login(data))}
            className="w-full "
          >
            <TextInput
              label="Email Address"
              placeholder=" Enter your email"
              className="my-6 w-full"
              register={register}
              registerName={"email"}
              error={errors?.email?.message}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your Password"
              register={register}
              registerName={"password"}
              error={errors?.password?.message}
              className="w-full"
            />
            <div className=" w-full flex items-center justify-end mb-8 mt-4 transition-shadow ">
              <button
                disabled={loading}
                className="bg-primary hover:bg-primary-light hover:scale-105 font-semibold p-3 px-8 rounded-full"
              >
                {loading ? (
                  <div className="px-3 py-0">
                    <Icon
                      icon="line-md:loading-alt-loop"
                      color="#eee"
                      width="27"
                      height="27"
                    />
                  </div>
                ) : (
                  "LOG IN"
                )}
              </button>
            </div>
          </form>
          <div className="w-full border border-solid border-lightGray-light"></div>
          <div className="my-4 font-semibold text-md">
            Don't have an account?
          </div>

          <Link to="/signup" className="w-full">
            <div className="border border-lightGray hover:border-lightGray-light text-lightGray hover:text-lightGray-light w-full flex items-center justify-center py-4 rounded-full font-bold bg-transparent transition">
              SIGN UP FOR BEATFLOW
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
