// src/pages/EventsPage.js

import React, { useState } from "react";

const EventsPage = () => {
  const [events] = useState([
    { id: 1, name: "GameHub Championship", date: "2024-10-15", registered: false },
    { id: 2, name: "Developers Meet and Greet", date: "2024-11-05", registered: false },
  ]);

  const handleRegister = (eventId) => {
    alert(`You have successfully registered for event ID: ${eventId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Upcoming Events</h1>
      {events.length === 0 ? (
        <p>No upcoming events at this time.</p>
      ) : (
        <div className="grid gap-6">
          {events.map((event) => (
            <div key={event.id} className="border p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold">{event.name}</h2>
              <p>Date: {event.date}</p>
              <button
                onClick={() => handleRegister(event.id)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Register
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;

