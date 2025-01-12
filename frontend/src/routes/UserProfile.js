import React, { useEffect, useState } from "react";
import LoggedInContainer from "../containers/LoggedInContainer";
import { useAuth } from "../contexts/AuthContext";
import { getDataApi, updateDataApi } from "../utils/serverHelpers";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const UserProfile = () => {
  const { cookies } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    _id: "",
    joinDate: "",
    isArtist: false,
  });

  const token = cookies?.authToken;

  const inputFileds = [
    {
      label: "Name",
      name: "name",
      value: `${formData.firstName || ""} ${formData.lastName || ""}`,
      border: true,
    },
    {
      label: "Email",
      name: "email",
      value: formData.email || "",
      border: true,
    },
    {
      label: "UserId",
      name: "_id",
      value: formData._id || "",
      disabled: true,
    },
    {
      label: "Join Date",
      name: "joinDate",
      value: formData.joinDate || new Date().toDateString(),
      disabled: true,
    },
  ];

  // Fetch user data on component mount
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await getDataApi("/auth/profile", token);
        if (!response.success) {
          return toast.error(response.err || "Error while fetching your data");
        }
        setFormData(response.user); // Initialize form data
      } catch (error) {
        toast.error(error.message || "Error while fetching your data");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle composite "Name" field separately
    if (name === "name") {
      const [firstName, ...lastNameParts] = value.split(" ");
      const lastName = lastNameParts.join(" ");
      setFormData((prevFormData) => ({
        ...prevFormData,
        firstName,
        lastName,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  // Save updated profile
  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        firstName: formData.firstName,
        lastName: formData.lastName,
      };
      const response = await updateDataApi("/auth/update", data, token);
      if (response.success) {
        toast.success("Profile updated successfully");
        setFormData(formData); // Update user data
        setIsEditing(false);
        localStorage.setItem("currentUser", JSON.stringify(response.user));
        window.location.reload()
      } else {
        toast.error(response.error || "Failed to update profile.");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile.");
    }
  };

  return (
    <LoggedInContainer>
      {loading ? (
        <Loading />
      ) : (
        <div className="rounded p-5 sm:p-10 bg-app-black h-full w-full text-white">
          <h1 className="text-3xl sm:text-4xl font-bold text-center py-3 border-b border-darkGray-light">
            {formData?.firstName}'s Profile
          </h1>
          <div className="py-5 pt-7 sm:py-7 flex items-center flex-col sm:flex-row justify-around">
            <div className="left flex sm:w-1/4 space-x-2 items-center sm:flex-col sm:space-y-5">
              <div
                className={`w-32 flex mb-5 sm:mb-0 justify-center items-center text-6xl h-32 ${
                  formData?.profileBackground || "bg-blue-500"
                } ${formData?.profileText} rounded-full`}
              >
                {formData?.firstName?.[0] + formData?.lastName?.[0]}
              </div>
            </div>
            <div className="right h-full sm:w-1/2 flex items-center flex-col">
              <form className="profile-info flex flex-col gap-3 w-full">
                {/* Editable Fields */}
                {inputFileds.map(({ label, name, value, disabled, border }) => (
                  <div
                    key={name}
                    className="w-full text-center bg-darkGray py-1 px-5 rounded-xl"
                  >
                    <label className="font-semibold pr-2">{label} : </label>
                    <input
                      type="text"
                      name={name}
                      value={value}
                      disabled={!isEditing || disabled}
                      onChange={handleInputChange}
                      className={`px-4 py-1 rounded-lg ${
                        isEditing && border ? "border" : "border-none"
                      }  outline-none focus:outline-primary text-gray-200 transition bg-transparent`}
                    />
                  </div>
                ))}

                {/* Is Artist */}
                <div
                  className={`w-full text-center bg-darkGray ${
                    isEditing ? "py-1" : "py-2"
                  } px-5 rounded-xl`}
                >
                  <label className="font-semibold">Is Artist : </label>
                  {isEditing ? (
                    <select
                      name="isArtist"
                      value={formData.isArtist}
                      onChange={handleInputChange}
                      className="bg-darkGray outline-none px-4 py-1 ml-2 rounded-xl"
                    >
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </select>
                  ) : (
                    <span>{formData?.isArtist ? "Yes" : "No"}</span>
                  )}
                </div>

                {/* Buttons */}
                <div className="text-center mt-5 space-x-4">
                  {isEditing ? (
                    <div className="flex items-center justify-between gap-5">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(formData); // Reset to original data
                          setIsEditing(false);
                        }}
                        className="w-full bg-primary hover:bg-primary-light px-4 py-2 rounded text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white"
                      >
                        Submit
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-500 px-4 py-2 rounded text-white"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </LoggedInContainer>
  );
};

export default UserProfile;
