// src/context/FriendsAndFamilyContext.js
import React, { createContext, useContext, useState } from "react";

const FriendsAndFamilyContext = createContext();

// Custom hook to use the FriendsAndFamily context
export const useFriendsAndFamily = () => {
  return useContext(FriendsAndFamilyContext);
};

export const FriendsAndFamilyProvider = ({ children }) => {
  // State to hold friends and family relationships
  const [friendsAndFamily, setFriendsAndFamily] = useState([]);

  // Add a new friend to the list, if not already added
  const addFriend = (userId, friendId) => {
    if (!friendsAndFamily.find((relation) => relation.userId === userId && relation.friendId === friendId)) {
      const newFriend = {
        userId,
        friendId,
        addedAt: new Date().toISOString(),
        id: friendsAndFamily.length + 1, // Unique ID for each relation
      };
      setFriendsAndFamily([...friendsAndFamily, newFriend]);
      return { success: true, message: "Member added successfully." };
    } else {
      return { success: false, message: "This member is already in your Friends and Family list." };
    }
  };

  // Get all friends of a specific user by their user ID
  const getFriends = (userId) => {
    return friendsAndFamily.filter((relation) => relation.userId === userId);
  };

  return (
    <FriendsAndFamilyContext.Provider value={{ friendsAndFamily, addFriend, getFriends }}>
      {children}
    </FriendsAndFamilyContext.Provider>
  );
};

