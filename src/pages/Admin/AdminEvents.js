// src/pages/Admin/AdminEvents.js
import React, { useState, useEffect } from 'react';


const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({ eventName: '', eventDateTime: '', eventDescription: '' });
  const [editingEvent, setEditingEvent] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch existing events from the server
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('https://localhost:7245/api/Events'); // Ensure this endpoint is correct
        const contentType = response.headers.get('content-type');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        } else if (contentType && contentType.indexOf('application/json') === -1) {
          const text = await response.text();
          throw new Error(`Expected JSON, received ${contentType}: ${text}`);
        }
        const data = await response.json();
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setErrorMessage('Failed to load events. Please try again later.');
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Handle adding a new event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:7245/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });
      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else if (contentType && contentType.indexOf('application/json') === -1) {
        const text = await response.text();
        throw new Error(`Expected JSON, received ${contentType}: ${text}`);
      }
      const data = await response.json();
      setEvents((prevEvents) => [...prevEvents, data]); // Add new event to list
      setNewEvent({ name: '', date: '', description: '' }); // Reset form
    } catch (error) {
      console.error('Error adding event:', error);
      setErrorMessage('Failed to add event. Please try again.');
    }
  };

  // Handle editing an event
  const handleEditEvent = async (eventId) => {
    try {
      const response = await fetch(`https://localhost:7245/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingEvent),
      });
      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else if (contentType && contentType.indexOf('application/json') === -1) {
        const text = await response.text();
        throw new Error(`Expected JSON, received ${contentType}: ${text}`);
      }
      const updatedEvent = await response.json();
      setEvents((prevEvents) =>
        prevEvents.map((event) => (event.id === eventId ? updatedEvent : event))
      );
      setEditingEvent(null); // Reset editing state
    } catch (error) {
      console.error('Error editing event:', error);
      setErrorMessage('Failed to edit event. Please try again.');
    }
  };

  // Handle deleting an event
  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`https://localhost:7245/api/events/${eventId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      setErrorMessage('Failed to delete event. Please try again.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold my-4">Manage Events</h1>

      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      {loading ? (
        <div>Loading events...</div>
      ) : (
        <>
          {/* Add New Event Form */}
          <form onSubmit={handleAddEvent} className="mb-6">
            <h2 className="text-xl mb-4">Add New Event</h2>
            <div className="mb-4">
              <label htmlFor="eventName" className="block text-sm font-medium">
                Event Name
              </label>
              <input
                type="text"
                id="eventName"
                className="border rounded p-2 w-full"
                value={newEvent.eventName}
                onChange={(e) => setNewEvent({ ...newEvent, eventName: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="eventDate" className="block text-sm font-medium">
                Event Date
              </label>
              <input
                type="date"
                id="eventDate"
                className="border rounded p-2 w-full"
                value={newEvent.eventDateTime}
                onChange={(e) => setNewEvent({ ...newEvent, eventDateTime: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="eventDescription" className="block text-sm font-medium">
                Event Description
              </label>
              <textarea
                id="eventDescription"
                className="border rounded p-2 w-full"
                value={newEvent.eventDescription}
                onChange={(e) => setNewEvent({ ...newEvent, eventDescription: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Add Event
            </button>
          </form>

          {/* Events List */}
          <h2 className="text-xl mb-4">Upcoming Events</h2>
          {events.length > 0 ? (
            <table className="min-w-full border-collapse block md:table">
              <thead className="block md:table-header-group">
                <tr className="border border-gray-300 md:border-none block md:table-row">
                  <th className="p-2 text-left">Event Name</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group">
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className="border border-gray-300 md:border-none block md:table-row"
                  >
                    <td className="p-2">{event.eventName}</td>
                    <td className="p-2">{event.eventDateTime}</td>
                    <td className="p-2">{event.eventDescription}</td>
                    <td className="p-2 flex space-x-2">
                      <button
                        className="bg-yellow-500 text-white px-4 py-1 rounded"
                        onClick={() => setEditingEvent(event)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-1 rounded"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No events available.</p>
          )}

          {/* Edit Event Section */}
          {editingEvent && (
            <div className="mt-6">
              <h2 className="text-xl mb-4">Edit Event</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditEvent(editingEvent.id);
                }}
              >
                <div className="mb-4">
                  <label htmlFor="editEventName" className="block text-sm font-medium">
                    Event Name
                  </label>
                  <input
                    type="text"
                    id="editEventName"
                    className="border rounded p-2 w-full"
                    value={editingEvent.eventName}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, eventName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="editEventDate" className="block text-sm font-medium">
                    Event Date
                  </label>
                  <input
                    type="date"
                    id="editEventDate"
                    className="border rounded p-2 w-full"
                    value={editingEvent.eventDateTime}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, eventDateTime: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="editEventDescription" className="block text-sm font-medium">
                    Event Description
                  </label>
                  <textarea
                    id="editEventDescription"
                    className="border rounded p-2 w-full"
                    value={editingEvent.eventDescription}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, eventDescription: e.target.value })
                    }
                    required
                  />
                </div>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setEditingEvent(null)}
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminEvents;

