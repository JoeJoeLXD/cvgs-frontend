// src/pages/Profile.js
import React, { useState, useEffect } from "react";
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

  const [userId, setUserId] = useState(null); // Store the user ID

  useEffect(() => {
    async function fetchUserData() {
      try {
        const user = await getUserProfile();
        if (user) {
          setProfile({
            userId: user.userId,
            displayName: user.displayName,
            email: user.email,
            gender: user.gender || "",
            birthDate: user.birthDate || "",
            promotionalEmails: user.promotionalEmails || false,
          });
          setUserId(user.userId);
           // Save the user ID
        }
      } catch (error) {
        toast.error("Failed to fetch user data");
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
    try {
      
      await updateUser(userId, profile); // Send updated profile to backend
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="displayName" className="block text-sm font-medium">Name</label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={profile.displayName}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
            disabled
          />
        </div>
        <div className="mb-4">
          <label htmlFor="gender" className="block text-sm font-medium">Gender</label>
          <select
            id="gender"
            name="gender"
            value={profile.gender}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="birthDate" className="block text-sm font-medium">Birth Date</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={profile.birthDate}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="receivePromos" className="block text-sm font-medium">Receive Promotional Emails</label>
          <input
            type="checkbox"
            id="receivePromos"
            name="receivePromos"
            checked={profile.receivePromos}
            onChange={handleChange}
            className="mt-1 p-2"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;

