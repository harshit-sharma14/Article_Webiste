import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../UserContext";
import Navbar from "./Navbar";
import axios from "axios";

const Profile = () => {
  const [formData, setFormData] = useState({});
  const { user, setUser } = useContext(UserContext);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState(null);

  // Handle file selection
  const handleimage = (e) => {
    setImage(e.target.files[0]); // Fix: Use e.target.files[0]
  };

  // Handle image upload
  const submitImage = async (e) => {
    e.preventDefault();
    setMessage(null); // Reset message state

    try {
      // Check if an image is selected
      if (!image) {
        setMessage("Please select an image to upload.");
        return;
      }

      // Create FormData object
      const formDataToSend = new FormData();
      formDataToSend.append("coverImage", image); // Append the image file

      // Get token from localStorage
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      if (!token) {
        setMessage("User not authenticated. Please log in.");
        return;
      }

      // Send the request
      const response = await axios.post("/setProfileImage", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle success
      if (response.status === 200) {
        setMessage("Profile photo uploaded successfully!");
        alert("Profile photo uploaded successfully!"); // Alert after state update

        // Update the user context with the new avatar
        setUser((prevUser) => ({
          ...prevUser,
          avatar: response.data.user.avatar, // Assuming the backend returns the updated user object
        }));
      }
    } catch (error) {
      // Handle errors
      console.error("Error uploading profile photo:", error);
      setMessage("Failed to upload profile photo. Please try again.");
      alert("Failed to upload profile photo. Please try again.");
    }
  };

  // Check if user is null or undefined
  if (!user) {
    return <div>Loading...</div>; // Or any other fallback UI
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-2xl">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
            {/* File input for image upload */}
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleimage}
            />
            <label htmlFor="avatar-upload">
              <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center mb-4 cursor-pointer">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <span className="text-3xl font-bold text-blue-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}33
              </div>
              <button onClick={submitImage}>Upload image</button>
            </label>
            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
            <p className="text-sm text-blue-100 mt-2">{user.email}</p>
            <div className="mt-4">
              <span className="inline-block bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-semibold">
                {user.role}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Account Created At */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Last Updated At */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="bg-gray-50 p-6 text-center">
            <p className="text-sm text-gray-500">
              &copy; 2025 Your Company. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;