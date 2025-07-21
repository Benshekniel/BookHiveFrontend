import React, { useState } from 'react';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setStatus('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!file) {
      setStatus('⚠️ Please select a file first.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    // 🔍 Log FormData content (text + file names)
    console.log("📦 FormData being sent:");
    for (let pair of formData.entries()) {
      console.log(`👉 ${pair[0]}:`, pair[1]);
    }
  
    try {
      const res = await fetch('http://localhost:9090/api/upload', {
        method: 'POST',
        body: formData,
        // Note: Do NOT set 'Content-Type'; the browser does it for you
      });
  
      console.log("📡 Request Headers (auto-handled by browser): multipart/form-data");
  
      const resText = await res.text();
      if (res.ok) {
        console.log("✅ Server Response:", resText);
        setStatus('✅ File uploaded successfully!');
      } else {
        console.error("❌ Server Error:", res.status, resText);
        setStatus(`❌ Upload failed: ${resText}`);
      }
    } catch (err) {
      console.error("💥 Upload Error:", err);
      setStatus(`❌ Error: ${err.message}`);
    }
  };
  

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h3>📤 Upload Image</h3>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleChange} />
        <br /><br />
        <button type="submit">Upload</button>
      </form>
      {status && <p style={{ marginTop: '10px' }}>{status}</p>}
    </div>
  );
};

export default UploadForm;
