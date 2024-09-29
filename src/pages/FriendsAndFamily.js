// src/pages/FriendsAndFamily.js
import React, { useState } from "react";
import { toast } from "react-toastify";

const FriendsAndFamily = () => {
  const [members] = useState([]); // List of all users, assuming you fetch this from a service
  const [friendsList, setFriendsList] = useState([]); // Friends and Family List
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddFriend = (member) => {
    if (friendsList.some(friend => friend.id === member.id)) {
      toast.error("This member is already in your Friends and Family list.");
      return;
    }
    setFriendsList([...friendsList, member]);
    toast.success("Member added to your Friends and Family list.");
  };

  const handleSearch = () => {
    // Assuming `members` is already populated, filter based on the search query
    if (!searchQuery) {
      return [];
    }
    return members.filter((member) => 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Friends and Family List</h1>
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search members by name or email..."
          className="p-2 border rounded-lg w-full mb-4"
        />
        <div className="search-results">
          {handleSearch().map((member) => (
            <div key={member.id} className="flex justify-between items-center mb-2">
              <span>{member.name} ({member.email})</span>
              <button
                onClick={() => handleAddFriend(member)}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
              >
                Add to Friends
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Your Friends and Family</h2>
        {friendsList.length === 0 ? (
          <div className="text-gray-600">You have not added any friends or family members yet.</div>
        ) : (
          <ul>
            {friendsList.map(friend => (
              <li key={friend.id} className="mb-2">
                {friend.name} ({friend.email})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FriendsAndFamily;
