import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";


const CharityCreate  = ({ setShowCreateEvent }) => {
  const [activeTab, setActiveTab] = useState('requests');
    const navigate = useNavigate();

  return (
    <div className="p-8 w-full bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Event</h2>

      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium">Event Name</label>
          <input
            type="text"
            placeholder="Event name"
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => setShowCreateEvent(false)} // 👈 Close modal
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );

};




export default CharityCreate;