// src/pages/PreferencesPage.js
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getSession } from "../services/authService";
import { usePreferences } from "../context/PreferencesContext";

const PreferencesPage = () => {
  const { preferences } = usePreferences();
  const { favoritePlatforms, favoriteCategories, language } = preferences;

  const [platformOptions, setPlatformOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [memberPreferenceId, setMemberPreferenceId] = useState(null);

  // Local state for managing current selections
  const [selectedPlatform, setSelectedPlatform] = useState(
    favoritePlatforms[0] || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    favoriteCategories[0] || ""
  );
  const [selectedLanguage, setSelectedLanguage] = useState(language || "");

  useEffect(() => {
    const memberId = getSession("userId");

    if (!memberId) {
      toast.error("User is not logged in.");
      return;
    }

    const fetchPlatforms = async () => {
      try {
        const response = await fetch("https://localhost:7245/api/Platforms");
        if (!response.ok) throw new Error("Failed to fetch platforms");
        const data = await response.json();
        setPlatformOptions(data.$values);
      } catch (error) {
        console.error("Error fetching platforms:", error);
        toast.error("Failed to load platforms. Please try again later.");
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://localhost:7245/api/GameCategories"
        );
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategoryOptions(data.$values);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load game categories. Please try again later.");
      }
    };

    const fetchLanguages = async () => {
      try {
        const response = await fetch("https://localhost:7245/api/Languages");
        if (!response.ok) throw new Error("Failed to fetch languages");
        const data = await response.json();
        setLanguageOptions(data.$values);
      } catch (error) {
        console.error("Error fetching languages:", error);
        toast.error("Failed to load languages. Please try again later.");
      }
    };

    const fetchMemberPreferences = async () => {
      try {
        const response = await fetch(
          `https://localhost:7245/api/MemberPreferences?MemberId=${memberId}`
        );
        if (!response.ok)
          throw new Error(
            `Failed to fetch member preferences. Status: ${response.status}`
          );

        const data = await response.json();
        const values = data.$values.filter((p) => p.memberId === memberId);
        if (values && values.length > 0) {
          const preference = values[0];
          setMemberPreferenceId(preference.id);
          setSelectedPlatform(preference.favoritePlatform.name);
          setSelectedCategory(preference.favoriteGameCategory.name);
          setSelectedLanguage(preference.languagePreference.name);
        }
      } catch (error) {
        console.error("Error fetching member preferences:", error);
        toast.error("Failed to load member preferences.");
      }
    };
    fetchPlatforms();
    fetchCategories();
    fetchLanguages();
    fetchMemberPreferences();
  }, []);

  const handleSavePreferences = async () => {
    const memberId = getSession("userId");

    if (!memberId) {
      toast.error("You must be logged in to save preferences.");
      return;
    }

    // Fetch the selected values
    const platformId =
      platformOptions.find((p) => p.name === selectedPlatform)?.id || null;
    const gameCategoryId =
      categoryOptions.find((c) => c.name === selectedCategory)?.id || null;
    const languageId =
      languageOptions.find((l) => l.name === selectedLanguage)?.id || null;

    // Log the IDs to verify values before sending
    console.log("Member ID:", memberId);
    console.log("Platform ID:", platformId);
    console.log("Game Category ID:", gameCategoryId);
    console.log("Language ID:", languageId);

    // Check if any required value is missing
    if (!platformId || !gameCategoryId || !languageId) {
      toast.error("Please select valid preferences for all categories.");
      return;
    }

    const memberPreferences = {
      id: memberPreferenceId || undefined,
      memberId,
      platformId,
      gameCategoryId,
      languageId,
      updateTime: new Date().toISOString(),
    };

    // Log the payload to verify correctness
    console.log("Payload to be sent:", memberPreferences);

    try {
      let response;
      if (memberPreferenceId) {
        // Update existing preferences
        response = await fetch(
          `https://localhost:7245/api/MemberPreferences/${memberPreferenceId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(memberPreferences),
          }
        );
      } else {
        // Create new preferences
        response = await fetch("https://localhost:7245/api/MemberPreferences", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(memberPreferences),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Response error data:", errorData);
        toast.error(errorData.title || "Failed to save preferences.");
        return;
      }

      const updatedData = await response.json();
      setMemberPreferenceId(updatedData.id);
      toast.success("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("An error occurred while saving preferences.");
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-6 py-4 dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Preferences</h1>

      {/* Favorite Platforms */}
      <div className="mb-4">
        <label className="block text-sm font-medium dark:text-white">
          Favorite Platforms:
        </label>
        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="" disabled>
            Please select
          </option>
          {platformOptions.map((platform) => (
            <option key={platform.id} value={platform.name}>
              {platform.name}
            </option>
          ))}
        </select>
      </div>

      {/* Favorite Game Categories */}
      <div className="mb-4">
        <label className="block text-sm font-medium dark:text-white">
          Favorite Game Categories:
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="" disabled>
            Please select
          </option>
          {categoryOptions.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Language Preferences */}
      <div className="mb-4">
        <label className="block text-sm font-medium dark:text-white">
          Language Preferences:
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="" disabled>
            Please select
          </option>
          {languageOptions.map((language) => (
            <option key={language.id} value={language.name}>
              {language.name}
            </option>
          ))}
        </select>
      </div>

      {/* Save Preferences Button */}
      <button
        onClick={handleSavePreferences}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition dark:bg-blue-700 dark:hover:bg-blue-600"
      >
        Save Preferences
      </button>
    </div>
  );
};

export default PreferencesPage;
