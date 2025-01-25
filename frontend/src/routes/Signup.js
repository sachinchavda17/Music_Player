import { useState } from "react";
import { useCookies } from "react-cookie";
import { Icon } from "@iconify/react";
import TextInput from "../components/TextInput";
import PasswordInput from "../components/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { postDataApi } from "../utils/serverHelpers";
import { useForm } from "react-hook-form";
import profileColor from "../containers/profileColor";
import { toast } from "react-toastify";
import logo from "../images/logo4.png";
import { useAuth } from "../contexts/AuthContext";

const SignupComponent = () => {
  const [cookie, setCookie] = useCookies(["token"]);
  const { loginCookie, setUser } = useAuth();
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * profileColor.length);
    const colorCombo = profileColor[randomIndex];
    return colorCombo;
  };

  const signUp = async (signupdata) => {
    try {
      setLoading(true);
      const colorsCombo = getRandomColor();
      console.log(signupdata);
      const data = {
        email: signupdata.email,
        password: signupdata.password,
        confirmPassword: signupdata.confirmPassword,
        firstName: signupdata.firstName,
        lastName: signupdata.lastName,
        profileBackground: colorsCombo.background,
        profileText: colorsCombo.text,
      };

      const response = await postDataApi("/auth/register", data);
      console.log(response);
      if (!response.success) {
        return toast.error(response.error || "Failed to signup");
      }

      toast.success("Successfully Signup");
      setUser(response.user);
      loginCookie(response.token);
      localStorage.setItem("currentUser", JSON.stringify(response.user));
      navigate("/");

    } catch (err) {
      toast.error(err || "Failed to signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-black overflow-auto text-lightGray-light">
      <div className="logo p-5 border-b border-solid border-lightGray-light w-full flex justify-center">
        <Link to={"/"} className="">
          <img
            src={logo}
            alt="BeatFlow logo"
            width={125}
            className="hover:opacity-80"
          />
        </Link>
      </div>
      <div className="inputRegion w-full px-5 sm:max-w-screen-sm py-10 flex items-center justify-center flex-col">
        <div className="font-bold mb-4 text-2xl text-center">
          Sign up for free to start listening.
        </div>
        <form
          className="w-full"
          onSubmit={handleSubmit((data) => {
            signUp(data);
          })}
        >
          <TextInput
            label="Email address"
            placeholder="Enter your email"
            className="my-3"
            registerName="email"
            pattern={"/^[w-.]+@([w-]+.)+[w-]{2,}$/gm"}
            patternErr={"Invalid email format"}
            register={register}
            error={errors?.email?.message}
          />
          <PasswordInput
            label="Create Password"
            placeholder="create a strong password"
            registerName="password"
            register={register}
            pattern={
              "/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=.-_*])([a-zA-Z0-9@#$%^&+=*.-_]){3,}$/"
            }
            patternErr={
              "create a strong password\n a number\n a lowercase\n a uppercase\n a special character"
            }
            error={errors?.password?.message}
            className="my-3"
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Enter password again"
            registerName="confirmPassword"
            register={register}
            error={errors?.confirmPassword?.message}
            className="my-3"
          />

          {/* Name Fields Layout: stack vertically on small screens, side-by-side on larger screens */}
          <div className="flex flex-col sm:flex-row items-center justify-between sm:gap-5 w-full">
            <TextInput
              label="First Name"
              placeholder="Enter Your First Name"
              className="my-3 sm:w-1/2"
              registerName="firstName"
              register={register}
              error={errors?.firstName?.message}
            />
            <TextInput
              label="Last Name"
              placeholder="Enter Your Last Name"
              className="my-3 sm:w-1/2"
              registerName="lastName"
              register={register}
              error={errors?.lastName?.message}
            />
          </div>

          <div className=" w-full flex items-center justify-center  transition-shadow  my-8">
            <button
              disabled={loading}
              type="submit"
              className="bg-primary hover:bg-primary-light hover:scale-105 font-semibold p-3 px-10 rounded-full "
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
                "Sign Up"
              )}
            </button>
          </div>
        </form>
        <div className="w-full border border-solid border-lightGray-light"></div>
        <div className="my-6 font-semibold text-md">
          Already have an account?
        </div>
        <Link to="/login" className="w-full">
          <div className="border border-lightGray hover:border-lightGray-light text-primary hover:text-primary-light  w-full flex items-center justify-center py-4 rounded-full font-bold bg-transparent transition">
            LOG IN INSTEAD
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SignupComponent;
