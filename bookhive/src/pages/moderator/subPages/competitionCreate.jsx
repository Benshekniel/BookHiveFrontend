import React, { useState } from 'react';

const CompetitionCreate = ({ setShowCreateEvent, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prizePoints: '',
    startDateTime: '',
    deadlineDateTime: '',
    maxParticipants: '',
    rules: '',
    judgingCriteria: '',
    entryTrustscore: '',
    bannerImage: null,
    theme: '',
    contactEmail: ''
  });

  // Predefined options for dropdowns
  const rulesOptions = [
    'Original work only - no plagiarism',
    'Word limit: 1,500-3,000 words',
    'One entry per participant',
    'No explicit content',
    'Custom'
  ];

  const judgingCriteriaOptions = [
    'Creativity and originality (40%)',
    'Writing style and technique (30%)',
    'Character development (20%)',
    'Overall impact (10%)',
    'Custom'
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, bannerImage: file }));
    }
  };

  const handleDropdownChange = (field, value) => {
    if (value === 'Custom') {
      // Preserve existing value when switching to Custom
      setFormData((prev) => ({ ...prev, [field]: prev[field] || '' }));
    } else {
      // Append new selection to existing value, avoiding duplicates
      setFormData((prev) => {
        const currentValue = prev[field] || '';
        const lines = currentValue.split('\n').filter(line => line.trim() !== '');
        if (!lines.includes(value)) {
          return { ...prev, [field]: currentValue ? `${currentValue}\n${value}` : value };
        }
        return prev;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.startDateTime || !formData.deadlineDateTime || !formData.prizePoints) {
      alert("Please complete all required fields.");
      return;
    }

    if (new Date(formData.startDateTime) >= new Date(formData.deadlineDateTime)) {
      alert("Start date must be before the deadline.");
      return;
    }

    if (isNaN(formData.prizePoints) || formData.prizePoints <= 0) {
      alert("Prize points must be a positive number.");
      return;
    }

    if (formData.entryTrustscore && (isNaN(formData.entryTrustscore) || formData.entryTrustscore < 0)) {
      alert("Entry Trustscore must be a non-negative number.");
      return;
    }

    const newCompetition = {
      ...formData,
      id: Date.now(),
      participants: 0
    };

    if (onCreate) onCreate(newCompetition);
    setFormData({
      title: '',
      description: '',
      prizePoints: '',
      startDateTime: '',
      deadlineDateTime: '',
      maxParticipants: '',
      rules: '',
      judgingCriteria: '',
      entryTrustscore: '',
      bannerImage: null,
      theme: '',
      contactEmail: ''
    });
    setShowCreateEvent(false);
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Create New Writing Competition</h2>
      <p className="text-sm text-gray-500 mb-6">Fill in the competition details below to create a new event.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Title ✱</label>
          <input
            type="text"
            value={formData.title}
            onChange={e => handleChange('title', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="e.g. Short Story Championship 2024"
            required
          />
        </div>

        {/* Entry Trustscore */}
        <div>
          <label className="block text-sm font-medium">Minimum Entry Trustscore</label>
          <input
            type="number"
            min="0"
            value={formData.entryTrustscore}
            onChange={e => handleChange('entryTrustscore', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="e.g. 500"
          />
        </div>

        {/* Prize Points */}
        <div>
          <label className="block text-sm font-medium">Prize (Trustscore Points) ✱</label>
          <input
            type="number"
            min="1"
            value={formData.prizePoints}
            onChange={e => handleChange('prizePoints', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="e.g. 1000"
            required
          />
        </div>

        {/* Start Date/Time & Deadline Date/Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Start Date/Time ✱</label>
            <input
              type="datetime-local"
              value={formData.startDateTime}
              onChange={e => handleChange('startDateTime', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Deadline Date/Time ✱</label>
            <input
              type="datetime-local"
              value={formData.deadlineDateTime}
              onChange={e => handleChange('deadlineDateTime', e.target.value)}
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
            onChange={e => handleChange('maxParticipants', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="e.g. 100"
          />
        </div>

        {/* Theme */}
        <div>
          <label className="block text-sm font-medium">Theme</label>
          <input
            type="text"
            value={formData.theme}
            onChange={e => handleChange('theme', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="e.g. Fantasy, Mystery, or Open"
          />
        </div>

        {/* Rules */}
        <div>
          <label className="block text-sm font-medium">Rules</label>
          <select
            onChange={e => handleDropdownChange('rules', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-2"
          >
            <option value="" disabled selected>Select or add rules</option>
            {rulesOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
          <textarea
            rows={4}
            value={formData.rules}
            onChange={e => handleChange('rules', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="Add or edit rules (each rule on a new line)..."
          />
        </div>

        {/* Judging Criteria */}
        <div>
          <label className="block text-sm font-medium">Judging Criteria</label>
          <select
            onChange={e => handleDropdownChange('judgingCriteria', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-2"
          >
            <option value="" disabled selected>Select or add criteria</option>
            {judgingCriteriaOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
          <textarea
            rows={4}
            value={formData.judgingCriteria}
            onChange={e => handleChange('judgingCriteria', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="Add or edit judging criteria (each criterion on a new line)..."
          />
        </div>

        {/* Contact Email */}
        <div>
          <label className="block text-sm font-medium">Contact Email</label>
          <input
            type="email"
            value={formData.contactEmail}
            onChange={e => handleChange('contactEmail', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="e.g. info@writingcomp.com"
          />
        </div>

        {/* Banner Image */}
        <div>
          <label className="block text-sm font-medium">Banner Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          {formData.bannerImage && <p className="text-sm text-gray-500 mt-1">Selected: {formData.bannerImage.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description ✱</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={e => handleChange('description', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="e.g. Unleash your creativity in this premier writing competition..."
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 px-4 py-2 text-white rounded-md text-sm"
          >
            Create Competition
          </button>
        </div>
      </form>
    </>
  );
};

export default CompetitionCreate;


// import React, { useState } from 'react';

// const CompetitionCreate = ({ setShowCreateEvent, onCreate }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     prize: '',
//     deadline: '',
//     maxParticipants: '',
//     rules: '',
//     judgingCriteria: ''
//   });

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.title || !formData.description || !formData.deadline) {
//       alert("Please complete all required fields.");
//       return;
//     }

//     const newCompetition = {
//       ...formData,
//       id: Date.now(),
//       participants: 0
//     };

//     if (onCreate) onCreate(newCompetition);
//     setFormData({
//       title: '',
//       description: '',
//       prize: '',
//       deadline: '',
//       maxParticipants: '',
//       rules: '',
//       judgingCriteria: ''
//     });
//     setShowCreateEvent(false);
//   };

//   return (
//     <>
//       <h2 className="text-2xl font-bold mb-4">Create New Writing Competition</h2>
//       <p className="text-sm text-gray-500 mb-6">Fill in the competition details below to create a new event.</p>

//       <form onSubmit={handleSubmit} className="space-y-5">
//         {/* Title */}
//         <div>
//           <label className="block text-sm font-medium">Title ✱</label>
//           <input
//             type="text"
//             value={formData.title}
//             onChange={e => handleChange('title', e.target.value)}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//             placeholder="e.g. Short Story Contest"
//             required
//           />
//         </div>

//         {/* Description */}
//         <div>
//           <label className="block text-sm font-medium">Description ✱</label>
//           <textarea
//             rows={3}
//             value={formData.description}
//             onChange={e => handleChange('description', e.target.value)}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//             placeholder="Brief summary or details of the event..."
//             required
//           />
//         </div>

//         {/* Prize */}
//         <div>
//           <label className="block text-sm font-medium">Prize</label>
//           <input
//             type="text"
//             value={formData.prize}
//             onChange={e => handleChange('prize', e.target.value)}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//             placeholder="e.g. Rs. 10,000 + certificate"
//           />
//         </div>

//         {/* Deadline & Max Participants */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium">Deadline ✱</label>
//             <input
//               type="date"
//               value={formData.deadline}
//               onChange={e => handleChange('deadline', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium">Max Participants</label>
//             <input
//               type="number"
//               min="1"
//               value={formData.maxParticipants}
//               onChange={e => handleChange('maxParticipants', parseInt(e.target.value))}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//               placeholder="e.g. 100"
//             />
//           </div>
//         </div>

//         {/* Rules */}
//         <div>
//           <label className="block text-sm font-medium">Rules</label>
//           <textarea
//             rows={3}
//             value={formData.rules}
//             onChange={e => handleChange('rules', e.target.value)}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//             placeholder="e.g. Word count 800-1200, originality required..."
//           />
//         </div>

//         {/* Judging Criteria */}
//         <div>
//           <label className="block text-sm font-medium">Judging Criteria</label>
//           <textarea
//             rows={3}
//             value={formData.judgingCriteria}
//             onChange={e => handleChange('judgingCriteria', e.target.value)}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//             placeholder="e.g. Creativity (40%), Language (30%)..."
//           />
//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-end">
//           <button
//             type="submit"
//             className="bg-blue-700 hover:bg-blue-800 px-4 py-2 text-white rounded-md text-sm"
//           >
//             Create Competition
//           </button>
//         </div>
//       </form>
//     </>
//   );
// };

// export default CompetitionCreate;