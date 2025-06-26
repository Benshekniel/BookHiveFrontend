import React, { useState ,useEffect } from 'react';
import { Shield, AlertTriangle, FileText, Eye, Clock, CheckCircle } from 'lucide-react';

// const Testing = () => {
//   const [activeTab, setActiveTab] = useState('reports');
  
//   return (
//     <div className="space-y-6">
//         <h1>hi</h1>
//     </div>
//   );
// };


const Testing = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:9090/api/message')
      .then((res) => res.text()) // use .json() if response is JSON
      .then((data) => setMessage(data))
      .catch((err) => console.error(err));
  }, []);


   return (
    <div style={{ padding: '20px' }}>
      <h2>Testing Page</h2>
      <p>{message}</p>
    </div>
  );
};

export default Testing;