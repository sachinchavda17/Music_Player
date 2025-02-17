import { useState } from "react";
import { Icon } from "@iconify/react";
import TextInput from "../components/TextInput";
import PasswordInput from "../components/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { postDataApi } from "../utils/serverHelpers";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import logo from "../images/logo4.png";
import { useAuth } from "../contexts/AuthContext";

const LoginComponent = () => {
  const { loginCookie, setUser } = useAuth();
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Added to set field values
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
      setUser(response.user);
      loginCookie(response.token);
      localStorage.setItem("currentUser", JSON.stringify(response.user));
      navigate("/");
    } catch (err) {
      setLoading(false);
      toast.error("An error occurred" + err);
    } finally {
      setLoading(false);
    }
  };

  // Function to copy credentials and auto-fill form fields
  const handleCopyCredentials = () => {
    const credentials = {
      email: "test@gmail.com", 
      password: "1234567890",
    };

    // Copy the credentials to the clipboard
    navigator.clipboard
      .writeText(`${credentials.email}\n${credentials.password}`)
      .then(() => {
        // Auto-fill the form fields with copied credentials
        setValue("email", credentials.email);
        setValue("password", credentials.password);

        // Show a success toast notification
        toast.success("Credentials copied and fields auto-filled!");
      })
      .catch((err) => {
        toast.error("Failed to copy credentials");
      });
  };

  return (
    <div>
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
        <div className="inputRegion w-full px-5 sm:max-w-screen-sm py-10 flex items-center justify-center flex-col text-lightGray-light">
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

          {/* Copy Credentials Button */}
          <div className="w-full text-center my-4">
            {/* Test User Info */}
            <div className="bg-gray-800 text-white p-4 rounded-md mb-4 w-full text-center">
              <div className="font-semibold">Test User Info</div>
              <div>
                Email:{" "}
                <span className="text-primary">test@gmail.com</span>
              </div>
              <div>
                Password: <span className="text-primary">1234567890</span>
              </div>
            <button
              onClick={handleCopyCredentials}
              className="text-primary my-2 hover:text-primary-light font-semibold py-2 px-4 border rounded-full border-lightGray-light hover:border-lightGray"
              >
              Use These Credentials
            </button>
              </div>
          </div>

          <div className="w-full border border-solid border-lightGray-light"></div>
          <div className="my-4 font-semibold text-md">
            Don't have an account?
          </div>

          <Link to="/signup" className="w-full">
            <div className="border border-lightGray hover:border-lightGray-light text-primary hover:text-primary-light w-full flex items-center justify-center py-4 rounded-full font-bold bg-transparent transition">
              SIGN UP FOR BEATFLOW
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
