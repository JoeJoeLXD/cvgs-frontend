// src/pages/EventsPage.js

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getSession } from "../services/authService"; // To get user session

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState([]); // Store registered events

  // Fetch existing events
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("https://localhost:7245/api/Events");
        const data = await response.json();
        setEvents(data["$values"]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events. Please try again later.");
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Fetch registered events for the current user
  useEffect(() => {
    async function fetchRegisteredEvents() {
      const userId = getSession("userId"); // Fetch the user ID from session storage

      if (!userId) {
        console.error("User is not logged in");
        return;
      }

      try {
        const response = await fetch(`https://localhost:7245/api/EventRegisters/user/${userId}`); // Adjust this endpoint according to your backend
        if (response.ok) {
          const data = await response.json();

          // Ensure correct response format
          if (data && Array.isArray(data)) {
            setRegisteredEvents(data.map((reg) => reg.eventId)); // Store registered event IDs
          } else {
            console.error("Unexpected data format:", data);
          }
        } else {
          console.error(`Failed to fetch registered events. Status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching registered events:", error);
        toast.error("Failed to load registered events.");
      }
    }
    fetchRegisteredEvents();
  }, []);

  // Handle registering for an event
  const handleRegister = async (eventId) => {
    const userId = getSession("userId"); // Fetch the user ID from session storage

    // Ensure userId is available
    if (!userId) {
      toast.error("You must be logged in to register for an event.");
      return;
    }

    try {
      const response = await fetch("https://localhost:7245/api/EventRegisters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId, userId }), // Send the correct eventId and userId
      });

      const responseData = await response.json(); 

      if (response.ok) {
        // Update registered events in the UI
        setRegisteredEvents((prev) => [...prev, eventId]); // Add the eventId to registered events
        toast.success(`Successfully registered for event ID: ${eventId}`);
      } else {
        console.error("Response error:", responseData);
        toast.error(responseData.message || "Failed to register for the event.");
      }
    } catch (error) {
      console.error("Error registering for event:", error);
      toast.error("Failed to register for the event.");
    }
  };

  // Check if the user is already registered for the event
  const isRegistered = (eventId) => registeredEvents.includes(eventId);

  // Filter for upcoming events
  const upcomingEvents = events.filter(
    (event) => new Date(event.eventDateTime) > new Date()
  );

  if (loading) {
    return <div>Loading events...</div>; // Display loading message
  }

  return (
    <div className="container mx-auto max-w-6xl px-0 py-4 dark:bg-gray-800">
      <h2 className="text-2xl font-semibold mb-6 dark:text-white">
        Upcoming Events
      </h2>
      {upcomingEvents.length > 0 ? (
        <table className="min-w-full border border-gray-300 dark:border-gray-600">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-4 border text-left font-semibold dark:text-gray-300">
                Event Name
              </th>
              <th className="p-4 border text-left font-semibold dark:text-gray-300">
                Date
              </th>
              <th className="p-4 border text-left font-semibold dark:text-gray-300">
                Time
              </th>
              <th className="p-4 border text-left font-semibold dark:text-gray-300">
                Description
              </th>
              <th className="p-4 border text-left font-semibold dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {upcomingEvents.map((event) => (
              <tr
                key={event.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="p-4 border dark:border-gray-600 dark:text-gray-200">
                  {event.eventName}
                </td>
                <td className="p-4 border dark:border-gray-600 dark:text-gray-200">
                  {new Date(event.eventDateTime).toLocaleDateString()}
                </td>
                <td className="p-4 border dark:border-gray-600 dark:text-gray-200">
                  {new Date(event.eventDateTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="p-4 border dark:border-gray-600 dark:text-gray-200">
                  {event.eventDescription}
                </td>
                <td className="p-4 border-t-0">
                  <div className="flex space-x-2">
                    {isRegistered(event.id) ? (
                      <span className="text-green-500">Registered</span>
                    ) : (
                      <button
                        onClick={() => handleRegister(event.id)}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition dark:bg-blue-700 dark:hover:bg-blue-600"
                      >
                        Register
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No upcoming events available.</p>
      )}
    </div>
  );
};

export default EventsPage;
