import React, { useState, useEffect, useCallback } from "react";
import { User, Mail, Phone, MapPin, Camera, Save, Edit } from "lucide-react";
import { useAuth } from '../../components/AuthContext';

const ProfileSettings = () => {
  const { user } = useAuth();

  // Initial user data structure
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    fname: "",
    lname: "",
    email: "",
    address: "",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    bio: "",
    phone: "",
    password: "", // For password validation only
  });

  // State for form data, edit mode, image preview, toast notifications, and password change
  const [isEditing, setIsEditing] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [loadingUserData, setLoadingUserData] = useState(true);

  // Fetch user details from backend
  const fetchUserDetails = useCallback(async () => {
    // Dummy user vector for profile fallback
    const dummyUser = {
      id: "dummy_001",
      name: "John Doe",
      fname: "John",
      lname: "Doe",
      email: "john.doe@example.com",
      address: "123 Main Street, Colombo 03, Western Province, Sri Lanka",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      bio: "Passionate reader and book enthusiast who loves exploring different genres and sharing book recommendations.",
      phone: "+94 77 123 4567",
      password: "", // Never store actual password
    };

    try {
      setLoadingUserData(true);
      console.log('Fetching user details for email:', user.email);
      
      // URL encode the email to handle special characters
      const encodedEmail = encodeURIComponent(user.email);
      const url = `http://localhost:9090/api/getLoginUser?email=${encodedEmail}`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch user details: ${response.status} - ${errorText}`);
      }
      
      const fetchedUserData = await response.json();
      console.log('User data received:', fetchedUserData);
      
      // Update user data with fetched information
      setUserData({
        id: fetchedUserData.id || "",
        name: fetchedUserData.fname && fetchedUserData.lname ? 
          `${fetchedUserData.fname} ${fetchedUserData.lname}` : 
          (fetchedUserData.name || ""),
        fname: fetchedUserData.fname || "",
        lname: fetchedUserData.lname || "",
        email: fetchedUserData.email || user.email || "",
        address: fetchedUserData.address || "",
        avatar: fetchedUserData.avatar || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        bio: fetchedUserData.bio || "Passionate reader and book enthusiast.",
        phone: fetchedUserData.phone ? 
          (fetchedUserData.phone.toString().startsWith('+') ? 
            fetchedUserData.phone.toString() : 
            `+94 ${fetchedUserData.phone}`) : "",
        password: "", // Never store actual password
      });
      
    } catch (error) {
      console.error('Error fetching user details:', error);
      setToast({ visible: true, message: "Failed to load user details, using demo profile", type: "error" });
      
      // Use dummy user data as fallback when backend fails
      setUserData({
        ...dummyUser,
        email: user.email || dummyUser.email, // Preserve actual user email if available
      });
    } finally {
      setLoadingUserData(false);
    }
  }, [user.email]);

  // Fetch user details on component mount
  useEffect(() => {
    console.log('useEffect triggered with user:', user);
    if (user?.email) {
      console.log('User email exists, calling fetchUserDetails');
      fetchUserDetails();
    } else {
      console.log('No user email available');
      setLoadingUserData(false);
    }
  }, [user, fetchUserDetails]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password form input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordError(""); // Clear error on input change
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
        setPreviewAvatar(reader.result);
        setUserData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      console.log("Saving user data:", userData);
      setToast({ visible: true, message: "Profile updated successfully!", type: "success" });
      setIsEditing(false);
    }, 500);
  };

  // Handle cancel
  const handleCancel = () => {
    // Refetch user data to reset any changes
    fetchUserDetails();
    setPreviewAvatar(null);
    setIsEditing(false);
  };

  // Handle password form submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwordData;

    // Validation
    if (!oldPassword.trim()) {
      setPasswordError("Old password is required");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match");
      return;
    }

    // TODO: Implement actual password update API call
    setTimeout(() => {
      setToast({ visible: true, message: "Password updated successfully!", type: "success" });
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordError("");
      setShowPasswordForm(false);
    }, 500);
  };

  // Handle password form cancel
  const handlePasswordCancel = () => {
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError("");
    setShowPasswordForm(false);
  };

  // Handle referral link copy
  const handleCopyReferralLink = () => {
    const referralLink = `https://book-sharing-app.com/referral/${userData.id}`;
    navigator.clipboard.writeText(referralLink).then(() => {
      setToast({ visible: true, message: "Referral link copied to clipboard!", type: "success" });
    }).catch(() => {
      setToast({ visible: true, message: "Failed to copy referral link", type: "error" });
    });
  };

  // Handle social sharing
  const handleShare = (platform) => {
    const referralLink = `https://book-sharing-app.com/referral/${userData.id}`;
    let shareUrl;
    const shareText = `Join me on this awesome book-sharing app! 📚 ${referralLink}`;
    switch (platform) {
      case "email":
        shareUrl = `mailto:?subject=Join our Book Sharing App!&body=${encodeURIComponent(shareText)}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, "_blank");
  };

  // Toast auto-hide
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-8xl mx-auto p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
              <p className="text-blue-100 text-lg">Update your personal details and preferences</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Settings Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            {loadingUserData ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a]"></div>
                <span className="ml-3 text-gray-600">Loading profile data...</span>
              </div>
            ) : (
              <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                <img
                  src={previewAvatar || userData.avatar}
                  alt={userData.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#1e3a8a]"
                />
                <div>
                  {isEditing && (
                    <label
                      htmlFor="avatar-upload"
                      className="bg-[#1e3a8a] hover:bg-blue-800 text-white px-3 py-2 rounded-lg font-medium flex items-center space-x-2 cursor-pointer transition-colors text-sm"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Change Photo</span>
                    </label>
                  )}
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB</p>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] disabled:bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={userData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] disabled:bg-gray-50"
                    placeholder="Tell others about yourself and your reading interests..."
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] disabled:bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="+94 77 123 4567"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] disabled:bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      name="address"
                      value={userData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your full address"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Account Security */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Account Security
                </h3>
                <div className="space-y-4">
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowPasswordForm(true)}
                      className="bg-[#1e3a8a] text-white px-3 py-2 rounded-lg hover:bg-blue-800 transition-colors text-sm"
                    >
                      Change Password
                    </button>
                    <p className="text-sm text-gray-600 mt-2">
                      Last changed 3 months ago
                    </p>
                  </div>
                </div>
              </div>

              {/* Password Change Form */}
              {showPasswordForm && (
                <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Change Password
                    </h3>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Old Password
                        </label>
                        <input
                          type="password"
                          name="oldPassword"
                          value={passwordData.oldPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                          required
                        />
                      </div>
                      {passwordError && (
                        <p className="text-sm text-red-600">{passwordError}</p>
                      )}
                      <div className="flex items-center space-x-4">
                        <button
                          type="submit"
                          className="flex items-center space-x-2 bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors text-sm"
                        >
                          <Save className="h-4 w-4" />
                          <span>Update Password</span>
                        </button>
                        <button
                          type="button"
                          onClick={handlePasswordCancel}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
              </div>
            )}
          </div>
        </div>

        {/* Toast Notification */}
        {toast.visible && (
          <div
            className={`fixed top-18 right-6 p-4 rounded-lg shadow-lg z-1000 ${
              toast.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;