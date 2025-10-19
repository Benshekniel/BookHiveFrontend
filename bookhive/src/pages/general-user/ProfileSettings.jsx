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
  const [avatarFile, setAvatarFile] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [loadingUserData, setLoadingUserData] = useState(true);

  // Fetch user details from backend
  const fetchUserDetails = useCallback(async () => {
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
      setToast({ visible: true, message: "Failed to load user details", type: "error" });
      // Set defaults with user email from auth context
      setUserData(prev => ({
        ...prev,
        email: user.email || "",
      }));
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

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validation = UserService.validateAvatarFile(file);
    if (!validation.valid) {
      showToast(validation.error, "error");
      return;
    }

    // Store file for upload
    setAvatarFile(file);

    // Convert file to base64 for preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload avatar if changed
      if (avatarFile) {
        const avatarResponse = await UserService.uploadAvatar(currentUserId, avatarFile);
        userData.avatar = avatarResponse.avatarUrl;
      }

      // Update profile
      const response = await UserService.updateUserProfile(currentUserId, userData);
      
      // Update local state with response
      if (response.user) {
        setUserData(response.user);
        setInitialUserData(response.user);
      }

      showToast(response.message || "Profile updated successfully!", "success");
      setIsEditing(false);
      setPreviewAvatar(null);
      setAvatarFile(null);
    } catch (error) {
      const errorMessage = UserService.handleError(error);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    // Refetch user data to reset any changes
    fetchUserDetails();
    setPreviewAvatar(null);
    setAvatarFile(null);
    setIsEditing(false);
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e) => {
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
    } catch (error) {
      const errorMessage = UserService.handleError(error);
      setPasswordError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle password form cancel
  const handlePasswordCancel = () => {
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError("");
    setShowPasswordForm(false);
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

  // Early return if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to view your profile settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Toast Notification */}
      {toast.visible && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          <div className="flex items-center space-x-2">
            {toast.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
              <p className="text-blue-100 text-lg">
                Manage your personal information and security preferences
              </p>
            </div>
            {!isEditing && !loadingUserData && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                icon={<Edit size={16} />}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loadingUserData ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading profile data...</span>
            </div>
          </div>
        ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-3 mb-4">
              <User className="h-6 w-6 text-blue-600" />
              <span>Personal Information</span>
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Profile Picture Section */}
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                  <div className="relative">
                    <img
                      src={previewAvatar || userData.avatar || "https://via.placeholder.com/150"}
                      alt={userData.name}
                      className="w-24 h-24 rounded-full object-cover border-2 border-blue-100 shadow-md"
                    />
                    {isEditing && (
                      <div className="absolute -bottom-1 -right-1">
                        <label
                          htmlFor="avatar-upload"
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer transition-colors shadow-md flex items-center justify-center"
                        >
                          <Camera className="w-4 h-4" />
                        </label>
                      </div>
                    )}
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{userData.name}</h3>
                    <p className="text-gray-600 mb-3">Upload a new profile picture to personalize your account</p>
                    <p className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg inline-block">
                      JPG, PNG or GIF files • Maximum size: 2MB
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="name"
                          value={userData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="email"
                          name="email"
                          value={userData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="tel"
                          name="phone"
                          value={userData.phone || ""}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="+94 77 123 4567"
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          name="location"
                          value={userData.location || ""}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={userData.bio || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="6"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50 disabled:text-gray-500 transition-all resize-none"
                      placeholder="Tell others about yourself and your reading interests..."
                    />
                    <p className="text-sm text-gray-500 mt-2">Share your interests, favorite books, or anything you'd like others to know about you.</p>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleCancel}
                      disabled={loading}
                      className="border-gray-200 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Account Security Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-3 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <span>Account Security</span>
            </h2>
            <div className="space-y-4">
              {/* Password Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                      <Lock className="h-5 w-5 text-gray-600" />
                      <span>Password</span>
                    </h3>
                    <p className="text-gray-600 mb-3">Keep your account secure with a strong password</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-gray-600">Last updated: 3 months ago</span>
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => setShowPasswordForm(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-300 transition-colors"
                  >
                    Change Password
                  </Button>
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
                  )}

                  <div className="flex justify-end space-x-3 mt-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handlePasswordCancel}
                      disabled={loading}
                      className="border-gray-200 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          <span>Update Password</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        )}

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