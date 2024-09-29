// src/context/PreferencesContext.js
import React, { createContext, useContext, useState } from "react";

const PreferencesContext = createContext();

export const usePreferences = () => {
  return useContext(PreferencesContext);
};

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    favoritePlatforms: [],
    favoriteCategories: [],
    language: "English",
  });

  const updatePreferences = (updatedPreferences) => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      ...updatedPreferences,
    }));
  };

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};
