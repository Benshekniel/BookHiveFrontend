import axios from "axios";
import { X, KeySquare, Save } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const PasswordSection = () => {
  // const {user} = useAuth();
  const myOldPassword = "pass123";
  // const user = { userId: 603 }; // hard-coded userId until login completed
  const userId = 603

  const [showPopup, setShowPopup] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const editPassword = async () => {
    const formData = new FormData();

    const passChangeDTO = { userId, oldPassword, newPassword };
    const jsonBlob = new Blob([JSON.stringify(passChangeDTO)], {
      type: "application/json",
    });
    formData.append("passChangeDTO", jsonBlob);

    const response = await axios.put(`http://localhost:9090/api/bookstore/password-change`, formData);
    return response.data;
  }

  const editMutation = useMutation({
    mutationFn: editPassword,
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setShowPopup(false);
    },
    onError: (e) => {
      toast.error("Something went wrong! Please try again later!");
      console.error(e);
    },
  });


  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (oldPassword !== myOldPassword) {
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

    try {
      editMutation.mutate();
    }
    catch (e) {
      console.error("Form error: " + e)
    };

  };

  const exitPopup = () => {
    setShowPopup(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <>
      <button
        onClick={() => setShowPopup(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-amber-400 text-slate-800 rounded-lg hover:bg-amber-500 transition-colors duration-200 font-medium">
        <KeySquare className="w-4 h-4" />
        <span>Change Password</span>
      </button>
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-w/2 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Change your Account Password</h2>
              <button onClick={exitPopup}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors" >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Old Password
                </label>
                <input type="password"
                  name="oldPassword" id="oldPassword"
                  value={oldPassword}
                  onChange={e => { setOldPassword(e.target.value); setPasswordError("") }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  required
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input type="password"
                  name="newPassword" id="newPassword"
                  value={newPassword}
                  onChange={e => { setNewPassword(e.target.value); setPasswordError("") }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input type="password"
                  name="confirmPassword" id="confirmPassword"
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setPasswordError("") }}
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
                  className="flex items-center space-x-2 bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors text-sm" >
                  <Save className="h-4 w-4" />
                  <span>Update Password</span>
                </button>
                <button type="button" onClick={exitPopup}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm" >
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>)
};
export default PasswordSection;

// 3 inputs - password type but also with eye thingy
// old pass, new pass, confirm new pass
// check new pass equals b4 submitting
// 1 submit