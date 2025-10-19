import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Camera, Save, Edit, Lock, Shield, Eye, EyeOff, CheckCircle, AlertCircle, X, Loader } from "lucide-react";
import Button from "../../components/shared/Button";
import UserService from "../../services/userService";

const ProfileSettings = () => {
  // Get userId from localStorage, props, or auth context
  // For now, using a mock userId - replace with actual implementation
  const currentUserId = localStorage.getItem('userId') || 1;

  // State for form data, edit mode, image preview, toast notifications, and password change
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    id: null,
    name: "",
    email: "",
    location: "",
    avatar: "",
    bio: "",
    phone: "",
  });
  const [initialUserData, setInitialUserData] = useState({});
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
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  /**
   * Fetch user profile from API
   */
  const fetchUserProfile = async () => {
    setPageLoading(true);
    try {
      const response = await UserService.getUserProfile(currentUserId);
      setUserData(response);
      setInitialUserData(response);
    } catch (error) {
      const errorMessage = UserService.handleError(error);
      showToast(errorMessage, "error");
    } finally {
      setPageLoading(false);
    }
  };

  /**
   * Show toast notification
   */
  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
  };

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
    setUserData(initialUserData);
    setPreviewAvatar(null);
    setAvatarFile(null);
    setIsEditing(false);
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwordData;

    // Client-side validation
    if (!oldPassword || oldPassword.trim().length === 0) {
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

    setLoading(true);

    try {
      const response = await UserService.updatePassword(currentUserId, passwordData);
      
      showToast(response.message || "Password updated successfully!", "success");
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

  // Password strength indicator
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  // Show loading spinner while fetching data
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading profile...</p>
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
            {!isEditing && (
              <Button
                variant="primary"
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                icon={<Edit size={16} />}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Profile Information Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200">
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
              </div>

              {/* Security Tips */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Security Recommendations</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700">Use a strong, unique password</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700">Keep your email address updated</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700">Review your account regularly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Modal */}
        {showPasswordForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2 flex items-center space-x-2">
                      <Lock className="h-6 w-6 text-blue-600" />
                      <span>Change Password</span>
                    </h3>
                    <p className="text-gray-600">Update your account password</p>
                  </div>
                  <button
                    onClick={handlePasswordCancel}
                    className="text-gray-500 hover:text-gray-700"
                    disabled={loading}
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.old ? "text" : "password"}
                        name="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('old')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={loading}
                      >
                        {showPasswords.old ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={loading}
                      >
                        {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {passwordData.newPassword && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                passwordStrength <= 2 ? 'bg-red-500' :
                                passwordStrength <= 3 ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            />
                          </div>
                          <span className={`text-xs font-medium ${
                            passwordStrength <= 2 ? 'text-red-600' :
                            passwordStrength <= 3 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 3 ? 'Medium' : 'Strong'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={loading}
                      >
                        {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {passwordError && (
                    <p className="text-red-600 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {passwordError}
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
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;