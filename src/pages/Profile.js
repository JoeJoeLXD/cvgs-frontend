// src/pages/Profile.js
import React, { useState, useEffect, useRef } from "react";
import { getUserProfile, updateUser } from "../services/dataService";
import { toast } from "react-toastify";

const Profile = () => {
  const [profile, setProfile] = useState({
    displayName: "",
    email: "",
    gender: "",
    birthDate: "",
    promotionalEmails: false,
  });

  const [userId, setUserId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const toastId = useRef(null); // Ref to store the toast ID to prevent duplicates

  useEffect(() => {
    console.log("Component Mounted. Fetching user data...");
    async function fetchUserData() {
      try {
        const user = await getUserProfile();
        if (user) {
          const formattedBirthDate =
            user.birthOfDate && user.birthOfDate !== "0001-01-01"
              ? user.birthOfDate.split("T")[0]
              : "";

          setProfile({
            displayName: user.displayName || "",
            email: user.email || "",
            gender: user.gender || "",
            birthDate: formattedBirthDate,
            promotionalEmails: user.isReceivePromotionalEmails || false,
          });
          setUserId(user.userId);
          console.log("User data fetched successfully.");
        }
      } catch (error) {
        if (!toastId.current) {
          toastId.current = toast.error("Failed to fetch user data");
        }
      }
    }

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isUpdating) {
      console.log(
        "Update already in progress. Preventing multiple submissions."
      );
      return;
    }

    setIsUpdating(true);
    console.log("Updating user profile...");
    try {
      const updatedProfile = {
        ...profile,
        birthOfDate: profile.birthDate,
        isReceivePromotionalEmails: profile.promotionalEmails,
      };

      await updateUser(userId, updatedProfile);

      console.log("Profile updated in the backend.");
      sessionStorage.setItem("displayName", updatedProfile.displayName);
      sessionStorage.setItem("email", updatedProfile.email);

      setProfile((prevState) => ({
        ...prevState,
        ...updatedProfile,
      }));

      // Only show the toast if it hasn't been shown already
      if (!toastId.current) {
        toastId.current = toast.success("Profile updated successfully!");
        console.log("Displaying success toast...");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
      toastId.current = null; // Reset the toastId for future updates
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-0 py-4 dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        <div className="mb-4">
          <label
            htmlFor="displayName"
            className="block text-sm font-medium dark:text-white"
          >
            Name
          </label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={profile.displayName}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium dark:text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="gender"
            className="block text-sm font-medium dark:text-white"
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={profile.gender}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="birthDate"
            className="block text-sm font-medium dark:text-white"
          >
            Birth Date
          </label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={profile.birthDate}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="promotionalEmails"
            className="block text-sm font-medium dark:text-white"
          >
            Receive Promotional Emails
          </label>
          <input
            type="checkbox"
            id="promotionalEmails"
            name="promotionalEmails"
            checked={profile.promotionalEmails}
            onChange={handleChange}
            className="mt-1 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
