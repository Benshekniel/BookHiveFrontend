import React, { useState } from "react";
import { Settings, Camera } from "lucide-react";

const ProfileSettings = () => {
  // Mock current user data (replace with actual data from context or props)
  const initialUser = {
    id: 1,
    name: "Nive",
    email: "nive@example.com",
    location: "Colombo, Sri Lanka",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    bio: "Passionate reader and occasional writer enjoying Sri Lankan literature.",
    phone: "",
  };

  // State for form data, image file, and toast notifications
  const [userData, setUserData] = useState(initialUser);
  const [previewAvatar, setPreviewAvatar] = useState(null); // For image preview
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" }); // Toast state

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setToast({ visible: true, message: "File size must be less than 2MB", type: "error" });
        return;
      }

      // Check file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setToast({ visible: true, message: "Only JPG, PNG, or GIF files are allowed", type: "error" });
        return;
      }

      // Convert file to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result); // Update preview
        setUserData((prev) => ({ ...prev, avatar: reader.result })); // Update state with base64
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission (placeholder for API call)
  const handleSave = (e) => {
    e.preventDefault();
    // Simulate API call or validation
    setTimeout(() => {
      console.log("Saving user data:", userData);
      setToast({ visible: true, message: "Profile updated successfully!", type: "success" });
      // Add API call or state persistence logic here
      // e.g., fetch('/api/update-profile', { method: 'POST', body: JSON.stringify(userData) })
    }, 500); // Simulate delay
  };

  // Hide toast after 3 seconds
  React.useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-8xl mx-auto p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
              <p className="text-blue-100 text-lg">Update your personal details and preferences</p>
            </div>
          </div>
        </div>

        {/* Profile Settings Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
            </div>
          </div>
          <div className="p-6">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                <img
                  src={previewAvatar || userData.avatar} // Show preview if available, otherwise original avatar
                  alt={userData.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-blue-600"
                />
                <div>
                  <label
                    htmlFor="avatar-upload"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 cursor-pointer transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Change Photo</span>
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleImageUpload}
                    className="hidden" // Hide the input
                  />
                  <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB</p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={userData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    placeholder="+94 77 123 4567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  rows={4}
                  name="bio"
                  value={userData.bio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Tell others about yourself and your reading interests..."
                />
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                >
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div
          className={`fixed top-6 right-6 p-4 rounded-lg shadow-lg ${
            toast.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;