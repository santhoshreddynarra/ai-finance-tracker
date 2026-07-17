import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../services/api";
import { updateProfile, changePassword } from "../store/slices/authSlice";

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [theme, setTheme] = useState(user?.preferences?.theme || "dark");
  const [currency, setCurrency] = useState(user?.preferences?.currency || "INR");


  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile({ name, email, preferences: { theme, currency } })).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err || "Failed to update profile");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await dispatch(changePassword({ currentPassword, newPassword })).unwrap();
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err || "Failed to change password");
    }
  };

  const handleDeleteAccount = async () => {
    const password = prompt("WARNING: This will permanently delete your account and all data. Enter your password to confirm:");
    if (!password) return;
    
    setLoadingDelete(true);
    try {
      await api.delete("/auth/account", { data: { password } });
      toast.success("Account deleted.");
      localStorage.clear();
      window.location.href = "/login";
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account");
      setLoadingDelete(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account preferences and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <form onSubmit={handleUpdateProfile} className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Profile Information</h2>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500" />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500">
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Theme</label>
                <select value={theme} onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500">
                  <option value="dark">Dark Mode</option>
                  <option value="light">Light Mode</option>
                </select>
              </div>
            </div>

            <button type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 rounded-xl text-sm transition-colors mt-2">
              Save Changes
            </button>
          </form>
        </div>

        <div className="space-y-8">
          <form onSubmit={handleChangePassword} className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Change Password</h2>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required minLength={8}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500" />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500" />
            </div>

            <button type="submit"
              className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2.5 rounded-xl text-sm transition-colors mt-2">
              Update Password
            </button>
          </form>

          <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-rose-400 mb-2">Danger Zone</h2>
            <p className="text-slate-400 text-xs mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <button onClick={handleDeleteAccount} disabled={loadingDelete}
              className="w-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-medium py-2.5 rounded-xl text-sm transition-colors border border-rose-500/30">
              {loadingDelete ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
