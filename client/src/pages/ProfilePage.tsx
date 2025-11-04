import React, { useEffect, useState } from "react";
import { fetchUser, updateUserProfile, logout } from "../api/authFetch";
import SideNav from "../components/ui/SideNav";
import Footer from "../components/ui/Footer";
import { User, Mail, Edit2, LogOut, Save, X } from "lucide-react";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Local form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchUser();
        // backend may return the user directly or wrapped, try both
        const u = data?.user ?? data;
        setUser(u || null);
        setFirstName(u?.first_name ?? u?.firstname ?? "");
        setLastName(u?.last_name ?? u?.lastname ?? "");
        setUsername(u?.username ?? "");
      } catch (err: any) {
        setError(err?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const updates: Record<string, unknown> = {
      first_name: firstName,
      last_name: lastName,
      username,
    };

    try {
      const updated = await updateUserProfile(updates);
      const u = updated?.user ?? updated;
      setUser(u || user);
      setFirstName(u?.first_name ?? u?.firstname ?? firstName);
      setLastName(u?.last_name ?? u?.lastname ?? lastName);
      setUsername(u?.username ?? username);
      setIsEditing(false);
    } catch (err: any) {
      setError(err?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    // Reset form to current user data
    setFirstName(user?.first_name ?? user?.firstname ?? "");
    setLastName(user?.last_name ?? user?.lastname ?? "");
    setUsername(user?.username ?? "");
    setIsEditing(false);
    setError(null);
  };

  const handleLogout = () => {
    logout();
    // redirect to home or login
    window.location.href = "/";
  };

  const getInitials = () => {
    const first = firstName || user?.first_name || user?.firstname || "";
    const last = lastName || user?.last_name || user?.lastname || "";
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "U";
  };

  if (loading) {
    return (
      <>
        <SideNav />
        <div className="min-h-screen pl-72 pr-6 py-8 overflow-x-hidden">
          <div className="text-center py-12">Loading profile...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SideNav />
      <div className="min-h-screen pl-72 pr-6 py-8 overflow-x-hidden">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300">
            {error}
          </div>
        )}

        {!user ? (
          <div className="p-4 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-300">
            No profile found.
          </div>
        ) : (
          <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            {/* TOP - Avatar Card */}
            <div>
              <div
                className="rounded-xl p-6 border border-white/10 shadow-lg text-center"
                style={{
                  background: "rgba(42, 53, 68, 0.7)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  <div
                    className="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #92C5E4 0%, #B8DCF0 100%)",
                    }}
                  >
                    {getInitials()}
                  </div>
                </div>

                {/* Name and Username */}
                <h2 className="text-2xl font-bold text-white mb-1">
                  {firstName} {lastName}
                </h2>
                <p className="text-white/70 mb-1">@{username}</p>
                <div className="flex items-center justify-center gap-2 text-white/60 text-sm mb-6">
                  <Mail size={14} />
                  <span>{user.email}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center max-w-md mx-auto">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-[#92C5E4] to-[#B8DCF0] text-white font-semibold rounded-lg hover:from-[#7bb5d4] hover:to-[#a3cce0] transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit2 size={18} />
                        Edit Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex-1 py-3 px-4 bg-red-500/80 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors flex items-center justify-center gap-2"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleCancel}
                      className="w-full max-w-xs py-3 px-4 bg-gray-500/80 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors flex items-center justify-center gap-2"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* BOTTOM - Information Panel */}
            <div>
              <div
                className="rounded-xl p-6 border border-white/10 shadow-lg"
                style={{
                  background: "rgba(42, 53, 68, 0.7)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                <h3 className="text-xl font-semibold text-white mb-6">
                  {isEditing
                    ? "Edit Profile Information"
                    : "Profile Information"}
                </h3>

                <form onSubmit={handleSave}>
                  <div className="space-y-4">
                    {/* Email (Read-only) */}
                    <div>
                      <label className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                        <Mail size={16} />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user.email ?? ""}
                        readOnly
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white/50 cursor-not-allowed outline-none"
                      />
                      <small className="text-white/50 text-xs mt-1 block">
                        Email cannot be changed
                      </small>
                    </div>

                    {/* First Name */}
                    <div>
                      <label className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                        <User size={16} />
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-[#92C5E4] focus:border-transparent outline-none transition-all"
                          placeholder="Enter your first name"
                        />
                      ) : (
                        <div className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white">
                          {firstName || "Not set"}
                        </div>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                        <User size={16} />
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-[#92C5E4] focus:border-transparent outline-none transition-all"
                          placeholder="Enter your last name"
                        />
                      ) : (
                        <div className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white">
                          {lastName || "Not set"}
                        </div>
                      )}
                    </div>

                    {/* Username */}
                    <div>
                      <label className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                        <User size={16} />
                        Username
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-[#92C5E4] focus:border-transparent outline-none transition-all"
                          placeholder="Enter your username"
                        />
                      ) : (
                        <div className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white">
                          @{username || "Not set"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Save/Cancel Buttons (only shown in edit mode) */}
                  {isEditing && (
                    <div className="flex gap-4 mt-6">
                      <button
                        type="submit"
                        className="flex-1 py-3 px-4 bg-green-500/80 text-white font-semibold rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center gap-2"
                      >
                        <Save size={18} />
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 py-3 px-4 bg-gray-500/80 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors flex items-center justify-center gap-2"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default ProfilePage;
