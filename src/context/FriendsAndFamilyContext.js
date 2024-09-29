//src/context/FriendsAndFamilyContext.js
import React, { createContext, useContext, useState } from "react";

const FriendsAndFamilyContext = createContext();

export const useFriendsAndFamily = () => {
  return useContext(FriendsAndFamilyContext);
};

export const FriendsAndFamilyProvider = ({ children }) => {
  const [friendsAndFamily, setFriendsAndFamily] = useState([]);

  const addFriend = (userId, friendId) => {
    if (!friendsAndFamily.find((relation) => relation.userId === userId && relation.friendId === friendId)) {
      const newFriend = {
        userId,
        friendId,
        addedAt: new Date().toISOString(),
        id: friendsAndFamily.length + 1
      };
      setFriendsAndFamily([...friendsAndFamily, newFriend]);
    }
  };

  const getFriends = (userId) => {
    return friendsAndFamily.filter((relation) => relation.userId === userId);
  };

  return (
    <FriendsAndFamilyContext.Provider value={{ friendsAndFamily, addFriend, getFriends }}>
      {children}
    </FriendsAndFamilyContext.Provider>
  );
};
