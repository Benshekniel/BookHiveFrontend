import React from "react";
import { X } from "lucide-react";

const CompetitionDetails = ({ competition, currentUserEmail, closeModal }) => {
  // Utility function to format date-time to 12-hour format with AM/PM
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "Not set";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Calculate days left until votingEndDateTime
  const calculateDaysLeft = (votingEndDateTime) => {
    if (!votingEndDateTime) return "Not set";
    const endDate = new Date(votingEndDateTime);
    if (isNaN(endDate.getTime())) return "Invalid date";
    const now = new Date("2025-08-20T07:40:00+05:30"); // Current date and time
    const timeDiff = endDate - now;
    if (timeDiff < 0) return "Ended";
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return `${daysLeft} day${daysLeft === 1 ? "" : "s"}`;
  };

  return (
    <div className="p-6 space-y-6 relative">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{competition.title}</h2>
          <p className="text-sm text-purple-600 font-medium">
            Max Participants: {competition.maxParticipants || "Unlimited"}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <span
            className={`text-sm font-medium lowercase px-2 py-1 rounded-full ${
              competition.createdBy === currentUserEmail
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {competition.createdBy === currentUserEmail ? "you" : competition.createdBy}
          </span>
          <button
            onClick={closeModal}
            className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">General Information</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>
              <span className="font-medium">Type:</span>{" "}
              <span className="text-blue-600">{competition.type || "Writing"}</span>
            </li>
            <li>
              <span className="font-medium">Status:</span>{" "}
              <span className="text-green-600">
                {competition.dateStatus.charAt(0).toUpperCase() + competition.dateStatus.slice(1)}
              </span>
            </li>
            <li>
              <span className="font-medium">Active Status:</span>{" "}
              <span className="text-red-600">{competition.activeStatus ? "Active" : "Paused"}</span>
            </li>
            <li>
              <span className="font-medium">Voting Status:</span>{" "}
              <span className="text-yellow-600">
                {competition.votingStatus.charAt(0).toUpperCase() + competition.votingStatus.slice(1)}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800">Dates and Times</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>
              <span className="font-medium">Competition Start:</span>{" "}
              {formatDateTime(competition.startDateTime)}
            </li>
            <li>
              <span className="font-medium">Competition End:</span>{" "}
              {formatDateTime(competition.endDateTime)}
            </li>
            <li>
              <span className="font-medium">Voting Start:</span>{" "}
              {formatDateTime(competition.votingStartDateTime)}
            </li>
            <li>
              <span className="font-medium">Voting End:</span>{" "}
              {formatDateTime(competition.votingEndDateTime)}
            </li>
            <li>
              <span className="font-medium">Days Left:</span>{" "}
              {calculateDaysLeft(competition.votingEndDateTime)}
            </li>
            <li>
              <span className="font-medium">Duration:</span>{" "}
              {competition.startDate || "Not set"} - {competition.votingEndDate || "Not set"}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800">Trust Scores</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>
              <span className="font-medium">Entry Trust Score:</span>{" "}
              {competition.entryTrustScore || "Not set"}
            </li>
            <li>
              <span className="font-medium">Prize Trust Score:</span>{" "}
              {competition.prizeTrustScore || "Not set"}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800">Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{competition.description}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800">Rules</h3>
          {competition.rules && competition.rules.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
              {competition.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">No rules specified</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800">Judging Criteria</h3>
          {competition.judgingCriteria && competition.judgingCriteria.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
              {competition.judgingCriteria.map((criterion, index) => (
                <li key={index}>{criterion}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">No judging criteria specified</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800">Participant Emails</h3>
          {competition.participantEmails && competition.participantEmails.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
              {competition.participantEmails.map((email, index) => (
                <li key={index}>{email}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">No participants registered</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompetitionDetails;

// import React from "react";
// import { X } from "lucide-react";

// const CompetitionDetails = ({ competition, currentUserEmail }) => {
//   // Utility function to format date-time to 12-hour format with AM/PM
//   const formatDateTime = (dateStr) => {
//     if (!dateStr) return "Not set";
//     const date = new Date(dateStr);
//     if (isNaN(date.getTime())) return "Invalid date";
//     return date.toLocaleString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "numeric",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   // Calculate days left until votingEndDateTime
//   const calculateDaysLeft = (votingEndDateTime) => {
//     if (!votingEndDateTime) return "Not set";
//     const endDate = new Date(votingEndDateTime);
//     if (isNaN(endDate.getTime())) return "Invalid date";
//     const now = new Date("2025-08-20T07:32:00+05:30"); // Current date and time
//     const timeDiff = endDate - now;
//     if (timeDiff < 0) return "Ended";
//     const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
//     return `${daysLeft} day${daysLeft === 1 ? "" : "s"}`;
//   };

//   return (
//     <div className="p-6 space-y-6 relative">
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">{competition.title}</h2>
//           <p className="text-sm text-purple-600 font-medium">
//             Max Participants: {competition.maxParticipants || "Unlimited"}
//           </p>
//         </div>
//         <div className="text-sm font-medium lowercase">
//           <span
//             className={`px-2 py-1 rounded-full ${
//               competition.createdBy === currentUserEmail
//                 ? "bg-green-100 text-green-800"
//                 : "bg-blue-100 text-blue-800"
//             }`}
//           >
//             {competition.createdBy === currentUserEmail ? "you" : competition.createdBy}
//           </span>
//         </div>
//       </div>
//       <button
//         onClick={() => window.dispatchEvent(new CustomEvent("closeDetailsModal"))}
//         className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-full transition-colors"
//         aria-label="Close"
//       >
//         <X className="w-5 h-5" />
//       </button>
//       <div className="space-y-4">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-800">General Information</h3>
//           <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
//             <li>
//               <span className="font-medium">Type:</span>{" "}
//               <span className="text-blue-600">{competition.type || "Writing"}</span>
//             </li>
//             <li>
//               <span className="font-medium">Status:</span>{" "}
//               <span className="text-green-600">
//                 {competition.dateStatus.charAt(0).toUpperCase() + competition.dateStatus.slice(1)}
//               </span>
//             </li>
//             <li>
//               <span className="font-medium">Active Status:</span>{" "}
//               <span className="text-red-600">{competition.activeStatus ? "Active" : "Paused"}</span>
//             </li>
//             <li>
//               <span className="font-medium">Voting Status:</span>{" "}
//               <span className="text-yellow-600">
//                 {competition.votingStatus.charAt(0).toUpperCase() + competition.votingStatus.slice(1)}
//               </span>
//             </li>
//           </ul>
//         </div>

//         <div>
//           <h3 className="text-lg font-semibold text-gray-800">Dates and Times</h3>
//           <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
//             <li>
//               <span className="font-medium">Competition Start:</span>{" "}
//               {formatDateTime(competition.startDateTime)}
//             </li>
//             <li>
//               <span className="font-medium">Competition End:</span>{" "}
//               {formatDateTime(competition.endDateTime)}
//             </li>
//             <li>
//               <span className="font-medium">Voting Start:</span>{" "}
//               {formatDateTime(competition.votingStartDateTime)}
//             </li>
//             <li>
//               <span className="font-medium">Voting End:</span>{" "}
//               {formatDateTime(competition.votingEndDateTime)}
//             </li>
//             <li>
//               <span className="font-medium">Days Left:</span>{" "}
//               {calculateDaysLeft(competition.votingEndDateTime)}
//             </li>
//             <li>
//               <span className="font-medium">Duration:</span>{" "}
//               {competition.startDate || "Not set"} - {competition.votingEndDate || "Not set"}
//             </li>
//           </ul>
//         </div>

//         <div>
//           <h3 className="text-lg font-semibold text-gray-800">Trust Scores</h3>
//           <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
//             <li>
//               <span className="font-medium">Entry Trust Score:</span>{" "}
//               {competition.entryTrustScore || "Not set"}
//             </li>
//             <li>
//               <span className="font-medium">Prize Trust Score:</span>{" "}
//               {competition.prizeTrustScore || "Not set"}
//             </li>
//           </ul>
//         </div>

//         <div>
//           <h3 className="text-lg font-semibold text-gray-800">Description</h3>
//           <p className="text-sm text-gray-600 leading-relaxed">{competition.description}</p>
//         </div>

//         <div>
//           <h3 className="text-lg font-semibold text-gray-800">Rules</h3>
//           {competition.rules && competition.rules.length > 0 ? (
//             <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
//               {competition.rules.map((rule, index) => (
//                 <li key={index}>{rule}</li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-sm text-gray-600">No rules specified</p>
//           )}
//         </div>

//         <div>
//           <h3 className="text-lg font-semibold text-gray-800">Judging Criteria</h3>
//           {competition.judgingCriteria && competition.judgingCriteria.length > 0 ? (
//             <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
//               {competition.judgingCriteria.map((criterion, index) => (
//                 <li key={index}>{criterion}</li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-sm text-gray-600">No judging criteria specified</p>
//           )}
//         </div>

//         <div>
//           <h3 className="text-lg font-semibold text-gray-800">Participant Emails</h3>
//           {competition.participantEmails && competition.participantEmails.length > 0 ? (
//             <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
//               {competition.participantEmails.map((email, index) => (
//                 <li key={index}>{email}</li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-sm text-gray-600">No participants registered</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CompetitionDetails;