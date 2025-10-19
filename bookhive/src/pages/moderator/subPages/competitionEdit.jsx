import React, { useState, useEffect } from 'react';

const CompetitionEdit = ({ competition, onCancel, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prize: '',
    startDate: '',
    endDate: '',
    maxParticipants: '',
    rules: '',
    judgingCriteria: ''
  });

  useEffect(() => {
    setFormData(competition);
  }, [competition]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.startDate || !formData.endDate) {
      alert("Please complete all required fields.");
      return;
    }
    onUpdate(formData);
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Edit Writing Competition</h2>
      <p className="text-sm text-gray-500 mb-6">Update the competition details below.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Title ✱</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="e.g. Short Story Contest"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description ✱</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="Brief summary or details of the event..."
            required
          />
        </div>

        {/* Prize */}
        <div>
          <label className="block text-sm font-medium">Prize</label>
          <input
            type="text"
            value={formData.prize}
            onChange={(e) => handleChange('prize', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="e.g. Rs. 10,000 + certificate"
          />
        </div>

        {/* Start Date & End Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Start Date ✱</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End Date ✱</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
            />
          </div>
        </div>

        {/* Max Participants */}
        <div>
          <label className="block text-sm font-medium">Max Participants</label>
          <input
            type="number"
            min="1"
            value={formData.maxParticipants}
            onChange={(e) => handleChange('maxParticipants', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="e.g. 100"
          />
        </div>

        {/* Rules */}
        <div>
          <label className="block text-sm font-medium">Rules</label>
          <textarea
            rows={3}
            value={formData.rules}
            onChange={(e) => handleChange('rules', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="e.g. Word count 800-1200, originality required..."
          />
        </div>

        {/* Judging Criteria */}
        <div>
          <label className="block text-sm font-medium">Judging Criteria</label>
          <textarea
            rows={3}
            value={formData.judgingCriteria}
            onChange={(e) => handleChange('judgingCriteria', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="e.g. Creativity (40%), Language (30%)..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 px-4 py-2 text-white rounded-md text-sm"
          >
            Save Changes
          </button>
        </div>
      </form>
    </>
  );
};

export default CompetitionEdit;