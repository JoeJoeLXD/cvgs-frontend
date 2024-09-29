// src/pages/PreferencesPage.js
import React from "react";
import { usePreferences } from "../context/PreferencesContext";

const PreferencesPage = () => {
  const {
    favoritePlatforms,
    setFavoritePlatforms,
    favoriteCategories,
    setFavoriteCategories,
    languagePreferences,
    setLanguagePreferences,
  } = usePreferences();

  return (
    <div className="max-w-4xl m-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Preferences</h1>

      {/* Favorite Platforms */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Favorite Platforms:</label>
        <select
          value={favoritePlatforms}
          onChange={(e) => setFavoritePlatforms([e.target.value])}
          className="border p-2 w-full"
        >
          <option value="" disabled>Select a Platform</option>
          <option value="PC">PC</option>
          <option value="PlayStation">PlayStation</option>
          <option value="Xbox">Xbox</option>
          <option value="Nintendo Switch">Nintendo Switch</option>
          <option value="Mobile">Mobile</option>
        </select>
      </div>

      {/* Favorite Game Categories */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Favorite Game Categories:</label>
        <select
          value={favoriteCategories}
          onChange={(e) => setFavoriteCategories([e.target.value])}
          className="border p-2 w-full"
        >
          <option value="" disabled>Select a Game Category</option>
          <option value="Action">Action</option>
          <option value="Adventure">Adventure</option>
          <option value="RPG">RPG</option>
          <option value="Strategy">Strategy</option>
          <option value="Sports">Sports</option>
          <option value="Racing">Racing</option>
          <option value="Simulation">Simulation</option>
        </select>
      </div>

      {/* Language Preferences */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Language Preferences:</label>
        <select
          value={languagePreferences}
          onChange={(e) => setLanguagePreferences(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="" disabled>Select a Language</option>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Chinese">Chinese</option>
          <option value="Japanese">Japanese</option>
        </select>
      </div>
    </div>
  );
};

export default PreferencesPage;


