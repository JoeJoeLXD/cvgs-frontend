// src/pages/EventsPage.js

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getSession } from "../services/authService"; // To get user session
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState([]); // Store registered events
  const navigate = useNavigate(); // Initialize navigate

  // Fetch existing events
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("https://localhost:7245/api/Events");
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();

        // Sort events by date, time, then event name
        const sortedEvents = data["$values"].sort((a, b) => {
          const dateA = new Date(a.eventDateTime);
          const dateB = new Date(b.eventDateTime);

          // Compare dates
          if (dateA < dateB) return -1;
          if (dateA > dateB) return 1;

          // If dates are the same, compare event names
          return a.eventName.localeCompare(b.eventName);
        });

        setEvents(sortedEvents);
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
  const fetchRegisteredEvents = async () => {
    const MemberId = getSession("userId"); // Fetch the user ID from session storage

    if (!MemberId) {
      console.error("User is not logged in");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7245/api/EventRegisters?MemberId=${MemberId}`
      );
      if (!response.ok)
        throw new Error(
          `Failed to fetch registered events. Status: ${response.status}`
        );

      const data = await response.json();
      console.log("Registered events raw response data:", data); // Log data to verify structure
      const filteredData = data["$values"].filter(
        (reg) => reg.memberId === MemberId
      );
      // Check if `$values` exists and is an array
      if (filteredData && Array.isArray(filteredData)) {
        setRegisteredEvents(filteredData.map((reg) => reg.eventId)); // Store registered event IDs
      } else {
        console.error("Unexpected data format:", data);
        toast.error("Unexpected data format for registered events.");
      }
    } catch (error) {
      console.error("Error fetching registered events:", error);
      toast.error("Failed to load registered events.");
    }
  };

  // Call fetchRegisteredEvents on component mount
  useEffect(() => {
    fetchRegisteredEvents();
  }, []);

  // Handle registering for an event
  const handleRegister = async (eventId) => {
    const MemberId = getSession("userId");

    if (!MemberId) {
      toast.error("You must be logged in to register for an event.");
      navigate("/login"); // Redirect to login page if not logged in
      return;
    }

    // Prepare the payload
    const payload = { EventId: eventId, MemberId };

    try {
      const response = await fetch(
        "https://localhost:7245/api/EventRegisters",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Response error data:", errorData);
        toast.error(errorData.title || "Failed to register for the event.");
        return;
      }

      setRegisteredEvents((prev) => [...prev, eventId]);
      toast.success(`Successfully registered for this event`);
      fetchRegisteredEvents(); // Refresh after successful registration
    } catch (error) {
      console.error("Error registering for event:", error);
      toast.error("Failed to register for the event.");
    }
  };

  // Handle cancelling a registration for an event
  const handleCancel = async (eventId) => {
    const MemberId = getSession("userId");

    if (!MemberId) {
      toast.error("You must be logged in to cancel a registration.");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7245/api/EventRegisters/${eventId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Response error data:", errorData);
        toast.error(
          errorData.title || "Failed to cancel the event registration."
        );
        return;
      }

      setRegisteredEvents((prev) => prev.filter((id) => id !== eventId));
      toast.success(`Successfully cancelled registration for this event`);
      fetchRegisteredEvents(); // Refresh after successful cancellation
    } catch (error) {
      console.error("Error cancelling registration for event:", error);
      toast.error("Failed to cancel the event registration.");
    }
  };

  // Check if the user is already registered for the event
  const isRegistered = (eventId) => registeredEvents.includes(eventId);

  // Filter for upcoming events
  const upcomingEvents = events.filter(
    (event) => new Date(event.eventDateTime) > new Date()
  );

  if (loading) {
    return <div>Loading events...</div>;
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
                      <>
                        <div className="flex justify-center items-center space-x-6">
                          <span className="text-green-500">
                            <i className="bi bi-check-circle-fill"></i>
                          </span>

                          <span
                            onClick={() => handleCancel(event.id)}
                            className="relative text-red-500 cursor-pointer hover:text-red-600 transition dark:text-red-700 dark:hover:text-red-600 group"
                            aria-label="Cancel"
                          >
                            <i className="bi bi-trash3"></i>
                            <span className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                              Cancel
                            </span>
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-center items-center h-full">
                        <span className="relative group">
                          <i
                            onClick={() => handleRegister(event.id)}
                            className="bi bi-person-plus-fill text-blue-500 cursor-pointer hover:text-blue-600 transition dark:text-blue-700 dark:hover:text-blue-600"
                            aria-label="Register"
                          ></i>
                          <span className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            Register
                          </span>
                        </span>
                      </div>
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
