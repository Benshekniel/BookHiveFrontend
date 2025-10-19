// src/context/TrustScoreContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

export const TrustScoreContext = createContext();

export const useTrustScore = () => useContext(TrustScoreContext);

export const TrustScoreProvider = ({ children }) => {
  const { user } = useAuth();
  const [trustScore, setTrustScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTrustScore = async () => {
    if (!user || !user.email || user.role !== 'user') {
      setTrustScore(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:9090/api/trustscore/${encodeURIComponent(user.email)}`);
      setTrustScore(response.data.score !== null ? response.data.score : null);
    } catch (error) {
      console.error('Error fetching trust score:', error);
      setTrustScore(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let intervalId;

    if (user && user.role === 'user') {
      fetchTrustScore();
      intervalId = setInterval(fetchTrustScore, 30000);
    } else {
      setTrustScore(null);
      setIsLoading(false);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user]);

  return (
    <TrustScoreContext.Provider value={{ trustScore, fetchTrustScore, isLoading }}>
      {children}
    </TrustScoreContext.Provider>
  );
};

// // src/context/TrustScoreContext.jsx
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useAuth } from './AuthContext';
// import axios from 'axios'; // Assuming axios is installed; alternatively, use fetch

// export const TrustScoreContext = createContext();

// export const useTrustScore = () => useContext(TrustScoreContext);

// export const TrustScoreProvider = ({ children }) => {
//   const { user } = useAuth();
//   const [trustScore, setTrustScore] = useState(null);

//   const fetchTrustScore = async () => {
//     if (!user || !user.email || user.role !== 'user') {
//       setTrustScore(null); // Reset trustScore if not a 'user' role
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`http://localhost:8080/api/trustscore/${user.email}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setTrustScore(response.data.score);
//     } catch (error) {
//       console.error('Error fetching trust score:', error);
//       setTrustScore(null); // Reset on error
//     }
//   };

//   useEffect(() => {
//     let intervalId;

//     if (user && user.role === 'user') {
//       fetchTrustScore(); // Initial fetch
//       intervalId = setInterval(fetchTrustScore, 30000); // Poll every 30 seconds
//     } else {
//       setTrustScore(null); // Clear trustScore if not a 'user'
//     }

//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [user]);

//   return (
//     <TrustScoreContext.Provider value={{ trustScore, fetchTrustScore }}>
//       {children}
//     </TrustScoreContext.Provider>
//   );
// };
