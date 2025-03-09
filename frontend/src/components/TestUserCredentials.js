import React from "react";
import { toast } from "react-toastify";

const TestUserCredentials = ({setValue}) => {
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
    <div className="w-full text-center my-4">
      {/* Test User Info */}
      <div className="bg-gray-800 text-white p-4 rounded-md mb-4 w-full text-center">
        <div className="font-semibold text-lg mb-5">
          <span className="border-b px-3"> Test User Info</span>
        </div>
        <div>
          Email: <span className="text-primary">test@gmail.com</span>
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
  );
};

export default TestUserCredentials;
