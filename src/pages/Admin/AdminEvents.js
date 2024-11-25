// src/pages/Admin/AdminEvents.js
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [editingEvent, setEditingEvent] = useState(null); // For editing event
  const [deleteEvent, setDeleteEvent] = useState(null); // Event to delete

  // Default state for a new event or editing
  const defaultEventState = {
    eventName: "",
    eventDate: "",
    eventTime: "",
    eventDescription: "",
    updateTime: null,
  };

  const [newEvent, setNewEvent] = useState(defaultEventState); // Add/Edit form state

  // Fetch existing events
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("https://localhost:7245/api/Events");
        const data = await response.json();

        // Sort events by date, then time, then event name
        const sortedEvents = data["$values"].sort((a, b) => {
          const dateA = new Date(a.eventDateTime);
          const dateB = new Date(b.eventDateTime);
          if (dateA < dateB) return -1;
          if (dateA > dateB) return 1;
          // If dates are the same, sort by event name
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

  // Handle Add or Update Event
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    const url = editingEvent
      ? `https://localhost:7245/api/Events/${newEvent.id}` // Update event
      : "https://localhost:7245/api/Events"; // Add new event

    const method = editingEvent ? "PUT" : "POST"; // Set method based on the action

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newEvent,
          eventDateTime: `${newEvent.eventDate}T${newEvent.eventTime}`,
          updateTime: new Date().toISOString(), // Set UpdateTime to current time
        }),
      });

      if (!response.ok) throw new Error("Failed to save event.");

      const data = await response.json();

      if (editingEvent) {
        // Update event in list
        setEvents((prevEvents) =>
          prevEvents.map((event) => (event.id === newEvent.id ? data : event))
        );
        toast.success("Event updated successfully!");
      } else {
        // Add new event to the list
        setEvents((prevEvents) => [...prevEvents, data]);
        toast.success("Event added successfully!");
      }

      setNewEvent(defaultEventState);
      setShowModal(false); // Close modal after submission
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event. Please try again.");
    }
  };

  // Open the modal for adding a new event
  const openAddModal = () => {
    setNewEvent(defaultEventState); // Clear form
    setEditingEvent(null); // Clear editing state
    setShowModal(true); // Show modal
  };

  // Open modal for editing an event
  const openEditModal = (event) => {
    const [date, time] = event.eventDateTime.split("T");
    setNewEvent({
      ...event,
      eventDate: date,
      eventTime: time.slice(0, 5), // Ensures time format is "HH:MM"
    }); // Set the form with selected event data
    setEditingEvent(event);
    setShowModal(true); // Show modal
  };

  // Open delete modal
  const openDeleteModal = (event) => {
    setDeleteEvent(event);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteEvent(null);
  };

  // Delete Event
  const handleDeleteEvent = async () => {
    if (!deleteEvent) return;

    try {
      const response = await fetch(
        `https://localhost:7245/api/Events/${deleteEvent.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete event.");

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== deleteEvent.id)
      );
      toast.success("Event deleted successfully!");
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event. Please try again.");
    }
  };

  // Filter for upcoming events
  const upcomingEvents = events.filter(
    (event) => new Date(event.eventDateTime) > new Date()
  );

  // Get today's date in 'YYYY-MM-DD' format to use for date input restrictions
  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return <div>Loading events...</div>; // Display loading message
  }

  return (
    <div className="container mx-auto max-w-6xl px-6 py-4 dark:bg-gray-800">
      <button
        className="bg-blue-500 text-white px-6 py-3 rounded-lg mb-6 hover:bg-blue-600 transition duration-150 dark:bg-blue-700 dark:hover:bg-blue-600"
        onClick={openAddModal}
      >
        Add New Event
      </button>

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
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition dark:bg-blue-700 dark:hover:bg-blue-600"
                      onClick={() => openEditModal(event)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition dark:bg-gray-400 dark:hover:bg-gray-600"
                      onClick={() => openDeleteModal(event)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No upcoming events available.</p>
      )}

      {/* Delete Confirmation Modal */}
      {deleteEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-6 dark:text-white">
              Confirm Deletion
            </h2>
            <p className="mb-6 dark:text-gray-200">
              Are you sure you want to delete the event:{" "}
              <strong>{deleteEvent.eventName}</strong>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition dark:bg-gray-600 dark:hover:bg-gray-500"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition dark:bg-red-700 dark:hover:bg-red-600"
                onClick={handleDeleteEvent}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form for Add/Edit Event */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-semibold mb-6 dark:text-white">
              {editingEvent ? "Edit Event" : "Add New Event"}
            </h2>
            <form onSubmit={handleSaveEvent}>
              <div className="mb-4">
                <label
                  htmlFor="eventName"
                  className="block text-sm font-medium dark:text-gray-200"
                >
                  Event Name
                </label>
                <input
                  type="text"
                  id="eventName"
                  className="border rounded p-3 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={newEvent.eventName}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, eventName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="eventDate"
                  className="block text-sm font-medium dark:text-gray-200"
                >
                  Event Date
                </label>
                <input
                  type="date"
                  id="eventDate"
                  className="border rounded p-3 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={newEvent.eventDate}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, eventDate: e.target.value })
                  }
                  min={today} // Ensure future dates only
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="eventTime"
                  className="block text-sm font-medium dark:text-gray-200"
                >
                  Event Time
                </label>
                <input
                  type="time"
                  id="eventTime"
                  className="border rounded p-3 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={newEvent.eventTime}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, eventTime: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="eventDescription"
                  className="block text-sm font-medium dark:text-gray-200"
                >
                  Event Description
                </label>
                <textarea
                  id="eventDescription"
                  className="border rounded p-3 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={newEvent.eventDescription}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      eventDescription: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition dark:bg-gray-600 dark:hover:bg-gray-500"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  {editingEvent ? "Update Event" : "Add Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
