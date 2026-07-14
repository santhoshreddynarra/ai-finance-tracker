import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, changePassword, clearError } from "../store/slices/authSlice";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [profileMessage, setProfileMessage] = useState("");
  const [profileErrors, setProfileErrors] = useState({});

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || "", email: user.email || "" });
    }
  }, [user]);

  // Handlers for Profile Info
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name]) setProfileErrors((prev) => ({ ...prev, [name]: "" }));
    if (error) dispatch(clearError());
    setProfileMessage("");
  };

  const validateProfile = () => {
    const errors = {};
    if (!profileForm.name.trim()) errors.name = "Name is required.";
    if (!profileForm.email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) errors.email = "Enter a valid email address.";
    return errors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const errors = validateProfile();
    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }
    const result = await dispatch(updateProfile({ name: profileForm.name.trim(), email: profileForm.email.trim() }));
    if (updateProfile.fulfilled.match(result)) {
      setProfileMessage("Profile updated successfully!");
    }
  };

  // Handlers for Password Change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    if (error) dispatch(clearError());
    setPasswordMessage("");
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordForm.currentPassword) errors.currentPassword = "Current password is required.";
    if (!passwordForm.newPassword) errors.newPassword = "New password is required.";
    else if (passwordForm.newPassword.length < 8) errors.newPassword = "New password must be at least 8 characters.";
    if (passwordForm.newPassword !== passwordForm.confirmPassword) errors.confirmPassword = "Passwords do not match.";
    return errors;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errors = validatePassword();
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    const result = await dispatch(
      changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
    );
    if (changePassword.fulfilled.match(result)) {
      setPasswordMessage("Password changed successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Your Profile</h1>
        <p className="text-slate-400 mt-2">Manage your account settings and preferences.</p>
      </div>

      {error && (
        <div role="alert" className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-11.25a.75.75 0 011.5 0v4.5a.75.75 0 01-1.5 0v-4.5zm.75 7.5a1 1 0 110-2 1 1 0 010 2z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Info Section */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-xl shadow-black/20">
          <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-5" noValidate>
            {profileMessage && (
              <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium">
                {profileMessage}
              </div>
            )}
            <InputField
              id="name"
              label="Full name"
              type="text"
              value={profileForm.name}
              onChange={handleProfileChange}
              error={profileErrors.name}
            />
            <InputField
              id="email"
              label="Email address"
              type="email"
              value={profileForm.email}
              onChange={handleProfileChange}
              error={profileErrors.email}
            />
            <div className="pt-2">
              <Button type="submit" loading={loading && !passwordForm.currentPassword}>
                Save Changes
              </Button>
            </div>
          </form>
        </section>

        {/* Change Password Section */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-xl shadow-black/20">
          <h2 className="text-xl font-semibold text-white mb-6">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-5" noValidate>
            {passwordMessage && (
              <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium">
                {passwordMessage}
              </div>
            )}
            <InputField
              id="currentPassword"
              label="Current password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.currentPassword}
            />
            <InputField
              id="newPassword"
              label="New password"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.newPassword}
            />
            <InputField
              id="confirmPassword"
              label="Confirm new password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.confirmPassword}
            />
            <div className="pt-2">
              <Button type="submit" loading={loading && !!passwordForm.currentPassword}>
                Update Password
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Profile;
