// src/pages/FriendsAndFamily.js
import React, { useState, useEffect } from "react";
import { useFriendsAndFamily } from "../context/FriendsAndFamilyContext";
import { toast } from "react-toastify";

const FriendsAndFamily = () => {
  const { addFriend, getFriends } = useFriendsAndFamily(); // Removed friendsAndFamily
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [friendsList, setFriendsList] = useState([]);
  const currentUserId = 1; // Mocked current user ID for testing

  useEffect(() => {
    // Mock data for members
    const mockMembers = [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" },
      { id: 3, name: "Alice Johnson", email: "alice@example.com" },
    ];
    setMembers(mockMembers);

    // Fetch friends for the current user
    setFriendsList(getFriends(currentUserId));
  }, [getFriends, currentUserId]);

  const handleAddFriend = (member) => {
    const result = addFriend(currentUserId, member.id);
    if (result.success) {
      toast.success(result.message);
      setFriendsList(getFriends(currentUserId)); // Update the displayed friends list
    } else {
      toast.error(result.message);
    }
  };

  const handleSearch = () => {
    if (!searchQuery) return [];
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        Friends and Family List
      </h1>
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search members by name or email..."
          className="p-2 border border-gray-300 rounded-lg w-full mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <div className="search-results">
          {handleSearch().length > 0 ? (
            handleSearch().map((member) => (
              <div
                key={member.id}
                className="flex justify-between items-center mb-2"
              >
                <span>
                  {member.name} ({member.email})
                </span>
                <button
                  onClick={() => handleAddFriend(member)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                >
                  Add to Friends
                </button>
              </div>
            ))
          ) : (
            searchQuery && (
              <div className="text-gray-600 dark:text-gray-300">
                No members found with this name or email.
              </div>
            )
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 dark:text-white">
          Your Friends and Family
        </h2>
        {friendsList.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-300">
            You have not added any friends or family members yet.
          </div>
        ) : (
          <ul>
            {friendsList.map((friend) => (
              <li key={friend.id} className="mb-2">
                {friend.friendId} - Added on {friend.addedAt}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FriendsAndFamily;

