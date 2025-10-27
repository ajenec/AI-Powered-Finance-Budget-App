import React, { useEffect, useState } from "react";
import { fetchUser, updateUserProfile, logout } from "../api/authFetch";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err: any) {
      setError(err?.message || "Failed to update profile");
    }
  };

  const handleLogout = () => {
    logout();
    // redirect to home or login
    window.location.href = "/";
  };

  if (loading) return <div className="p-4">Loading profile...</div>;

  return (
    <>
      <NavBar />
      <div className="container py-4">
        <h2>My Profile</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {!user ? (
          <div className="alert alert-warning">No profile found.</div>
        ) : (
          <form onSubmit={handleSave} className="mt-3">
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={user.email ?? ""}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label">First name</label>
              <input
                className="form-control"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Last name</label>
              <input
                className="form-control"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary me-2">
              Save
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleLogout}
            >
              Logout
            </button>
          </form>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
