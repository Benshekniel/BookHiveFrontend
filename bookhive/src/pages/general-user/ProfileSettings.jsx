import React, { useState, useEffect, useCallback, memo } from "react";
import { User, Mail, Phone, MapPin, Camera, Save, Edit, Link, Share2, X } from "lucide-react";
import Button from "../../components/profile/Button";
import Input from "../../components/profile/Input";
import Toast from "../../components/common/Toast";

// Memoized form sections for better performance
const PersonalInfo = memo(({ userData, handleInputChange, isEditing }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Input
      label="Full Name"
      icon={User}
      name="name"
      value={userData.name}
      onChange={handleInputChange}
      disabled={!isEditing}
    />
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
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
));

const ContactInfo = memo(({ userData, handleInputChange, isEditing }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Input
      label="Email Address"
      icon={Mail}
      type="email"
      name="email"
      value={userData.email}
      onChange={handleInputChange}
      disabled={!isEditing}
    />
    <Input
      label="Phone Number"
      icon={Phone}
      type="tel"
      name="phone"
      value={userData.phone}
      onChange={handleInputChange}
      disabled={!isEditing}
      placeholder="+94 77 123 4567"
    />
    <Input
      label="Location"
      icon={MapPin}
      name="location"
      value={userData.location}
      onChange={handleInputChange}
      disabled={!isEditing}
    />
  </div>
));

const ReferralSection = memo(({ userId, handleCopyReferralLink, handleShare }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h3 className="text-xl font-semibold text-gray-900 mb-4">Referral Program</h3>
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-gray-900">Your Referral Link</h4>
        <p className="text-sm text-gray-600">Invite friends to join the book-sharing community!</p>
        <div className="mt-2 flex items-center space-x-2">
          <input
            type="text"
            value={`https://book-sharing-app.com/referral/${userId}`}
            readOnly
            className="w-[300px] px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
          />
          <Button onClick={handleCopyReferralLink}>
            <Link className="h-4 w-4" />
            <span>Copy Link</span>
          </Button>
        </div>
      </div>
      <div>
        <h4 className="font-medium text-gray-900">Share Your Link</h4>
        <div className="mt-2 flex space-x-2">
          {["email", "whatsapp", "twitter"].map((platform) => (
            <Button
              key={platform}
              onClick={() => handleShare(platform)}
            >
              {platform === "email" ? <Mail className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  </div>
));

const PasswordForm = memo(({ passwordData, passwordError, handlePasswordChange, handlePasswordSubmit, handlePasswordCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h3>
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <Input
          label="Old Password"
          type="password"
          name="oldPassword"
          value={passwordData.oldPassword}
          onChange={handlePasswordChange}
          required
        />
        <Input
          label="New Password"
          type="password"
          name="newPassword"
          value={passwordData.newPassword}
          onChange={handlePasswordChange}
          required
        />
        <Input
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          value={passwordData.confirmPassword}
          onChange={handlePasswordChange}
          required
        />
        {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
        <div className="flex items-center space-x-4">
          <Button type="submit" variant="yellow">
            <Save className="h-4 w-4" />
            <span>Update Password</span>
          </Button>
          <Button variant="secondary" onClick={handlePasswordCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  </div>
));

const ProfileSettings = () => {
  // Mock current user data
  const defaultAvatar = "https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg";
  const initialUser = {
    id: 1,
    name: "Nive",
    email: "nive@example.com",
    location: "Colombo, Sri Lanka",
    avatar: defaultAvatar,
    bio: "Passionate reader and occasional writer enjoying Sri Lankan literature.",
    phone: "",
    password: "oldPassword123",
  };

  // State for form data, edit mode, image preview, toast notifications, and password change
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(initialUser);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [imageError, setImageError] = useState("");

  // Memoized handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handlePasswordChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");
  }, []);

  const handleImageUpload = useCallback((e) => {
    console.log("handleImageUpload triggered");
    const file = e.target.files[0];
    if (!file) {
      setImageError("No file selected");
      setToast({ visible: true, message: "No file selected", type: "error" });
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      setImageError("File size must be less than 2MB");
      setToast({ visible: true, message: "File size must be less than 2MB", type: "error" });
      e.target.value = null; // Reset file input
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setImageError("Only JPG, PNG, or GIF files are allowed");
      setToast({ visible: true, message: "Only JPG, PNG, or GIF files are allowed", type: "error" });
      e.target.value = null; // Reset file input
      return;
    }

    // Clear previous errors
    setImageError("");

    // Create image object to validate dimensions
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      console.log("Image loaded successfully, dimensions:", img.width, img.height);
      // Validate image dimensions (min 100x100, max 1000x1000)
      if (img.width < 100 || img.height < 100) {
        setImageError("Image dimensions must be at least 100x100 pixels");
        setToast({ visible: true, message: "Image dimensions must be at least 100x100 pixels", type: "error" });
        URL.revokeObjectURL(objectUrl);
        e.target.value = null;
        return;
      }
      if (img.width > 1000 || img.height > 1000) {
        setImageError("Image dimensions must not exceed 1000x1000 pixels");
        setToast({ visible: true, message: "Image dimensions must not exceed 1000x1000 pixels", type: "error" });
        URL.revokeObjectURL(objectUrl);
        e.target.value = null;
        return;
      }

      // Read file and set preview
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("FileReader completed, setting preview");
        setPreviewAvatar(reader.result);
        setUserData((prev) => ({ ...prev, avatar: reader.result }));
        setToast({ visible: true, message: "Profile picture preview updated", type: "success" });
      };
      reader.onerror = () => {
        console.error("FileReader error");
        setImageError("Failed to read image file");
        setToast({ visible: true, message: "Failed to read image file", type: "error" });
        URL.revokeObjectURL(objectUrl);
        e.target.value = null;
      };
      reader.readAsDataURL(file);
      URL.revokeObjectURL(objectUrl);
    };

    img.onerror = () => {
      console.error("Image load error");
      setImageError("Invalid image file");
      setToast({ visible: true, message: "Invalid image file", type: "error" });
      URL.revokeObjectURL(objectUrl);
      e.target.value = null;
    };

    img.src = objectUrl;
  }, []);

  const handleRemovePhoto = useCallback(() => {
    console.log("handleRemovePhoto triggered");
    setPreviewAvatar(null);
    setUserData((prev) => ({ ...prev, avatar: defaultAvatar }));
    setImageError("");
    setToast({ visible: true, message: "Profile picture reset to default", type: "success" });
    const fileInput = document.getElementById("avatar-upload");
    if (fileInput) {
      fileInput.value = null;
      console.log("File input reset");
    }
  }, [defaultAvatar]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    console.log("handleSubmit triggered, imageError:", imageError);
    if (imageError) {
      setToast({ visible: true, message: "Please resolve image errors before saving", type: "error" });
      return;
    }
    // Simulate API call
    setTimeout(() => {
      setToast({ visible: true, message: "Profile updated successfully!", type: "success" });
      setIsEditing(false);
    }, 500);
  }, [imageError]);

  const handleCancel = useCallback(() => {
    console.log("handleCancel triggered");
    setUserData(initialUser);
    setPreviewAvatar(null);
    setImageError("");
    setIsEditing(false);
    const fileInput = document.getElementById("avatar-upload");
    if (fileInput) {
      fileInput.value = null;
      console.log("File input reset");
    }
  }, [initialUser]);

  const handlePasswordSubmit = useCallback((e) => {
    e.preventDefault();
    console.log("handlePasswordSubmit triggered");
    const { oldPassword, newPassword, confirmPassword } = passwordData;

    // Validation
    if (oldPassword !== userData.password) {
      setPasswordError("Old password is incorrect");
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

    // Simulate password update
    setTimeout(() => {
      setUserData((prev) => ({ ...prev, password: newPassword }));
      setToast({ visible: true, message: "Password updated successfully!", type: "success" });
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordError("");
      setShowPasswordForm(false);
    }, 500);
  }, [passwordData, userData.password]);

  const handlePasswordCancel = useCallback(() => {
    console.log("handlePasswordCancel triggered");
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError("");
    setShowPasswordForm(false);
  }, []);

  const handleCopyReferralLink = useCallback(() => {
    console.log("handleCopyReferralLink triggered");
    const referralLink = `https://book-sharing-app.com/referral/${userData.id}`;
    navigator.clipboard.writeText(referralLink)
      .then(() => setToast({ visible: true, message: "Referral link copied!", type: "success" }))
      .catch(() => setToast({ visible: true, message: "Failed to copy link", type: "error" }));
  }, [userData.id]);

  const handleShare = useCallback((platform) => {
    console.log("handleShare triggered for platform:", platform);
    const referralLink = `https://book-sharing-app.com/referral/${userData.id}`;
    const shareText = `Join me on this awesome book-sharing app! 📚 ${referralLink}`;
    const shareUrls = {
      email: `mailto:?subject=Join our Book Sharing App!&body=${encodeURIComponent(shareText)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    };
    window.open(shareUrls[platform], "_blank");
  }, [userData.id]);

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
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
              <p className="text-blue-100 text-lg">Update your personal details and preferences</p>
            </div>
            {!isEditing && (
              <Button variant="yellow" onClick={() => {
                console.log("Edit Profile button clicked");
                setIsEditing(true);
              }}>
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
            )}
          </div>
        </div>

        {/* Profile Settings Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <img
                    src={previewAvatar || userData.avatar}
                    alt={userData.name || "Profile"}
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#1e3a8a]"
                    onError={(e) => {
                      console.error("Image load failed, reverting to default");
                      e.target.src = defaultAvatar;
                    }}
                  />
                  {isEditing && (
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">
                      <Camera className="h-5 w-5 text-[#1e3a8a]" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  {isEditing && (
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="primary"
                          onClick={() => {
                            console.log("Change Photo button clicked");
                            const fileInput = document.getElementById("avatar-upload");
                            if (fileInput) {
                              fileInput.click();
                            } else {
                              console.error("File input not found");
                            }
                          }}
                        >
                          <Camera className="h-4 w-4" />
                          <span>Change Photo</span>
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={handleRemovePhoto}
                          disabled={userData.avatar === defaultAvatar}
                        >
                          <X className="h-4 w-4" />
                          <span>Remove Photo</span>
                        </Button>
                      </div>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={(e) => {
                          console.log("File input changed");
                          handleImageUpload(e);
                        }}
                        className="hidden"
                      />
                      <p className="text-sm text-gray-500">
                        JPG, PNG, or GIF. Max size 2MB. Recommended 150x150 pixels.
                      </p>
                      {imageError && <p className="text-sm text-red-600">{imageError}</p>}
                    </div>
                  )}
                </div>
              </div>

              <PersonalInfo
                userData={userData}
                handleInputChange={handleInputChange}
                isEditing={isEditing}
              />

              <ContactInfo
                userData={userData}
                handleInputChange={handleInputChange}
                isEditing={isEditing}
              />

              <ReferralSection
                userId={userData.id}
                handleCopyReferralLink={handleCopyReferralLink}
                handleShare={handleShare}
              />

              {/* Account Security */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Security</h3>
                <div className="space-y-4">
                  <div>
                    <Button onClick={() => {
                      console.log("Change Password button clicked");
                      setShowPasswordForm(true);
                    }}>
                      Change Password
                    </Button>
                    <p className="text-sm text-gray-600 mt-2">Last changed 3 months ago</p>
                  </div>
                </div>
              </div>

              {/* Password Change Form */}
              {showPasswordForm && (
                <PasswordForm
                  passwordData={passwordData}
                  passwordError={passwordError}
                  handlePasswordChange={handlePasswordChange}
                  handlePasswordSubmit={handlePasswordSubmit}
                  handlePasswordCancel={handlePasswordCancel}
                />
              )}

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex items-center space-x-4">
                  <Button variant="yellow" onClick={handleSubmit}>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </Button>
                  <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {toast.visible && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;