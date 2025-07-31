import React, { useState } from "react";
import Modal from "../Modal/Modal";
import useAuth from "../../hooks/useAuth";
import useCoupons from "../../hooks/useCoupons";
import Card from "../Card/Card";

const tabStyle = {
  display: "flex",
  borderBottom: "2px solid #eee",
  marginBottom: 24,
};
const tabBtnStyle = isActive => ({
  flex: 1,
  padding: "16px 0 12px 0",
  background: "none",
  border: "none",
  borderBottom: isActive ? "3px solid #7c3aed" : "none",
  color: isActive ? "#7c3aed" : "#888",
  fontWeight: 600,
  fontSize: 18,
  cursor: "pointer",
  outline: "none",
  transition: "color 0.2s, border 0.2s",
});

const ProfileModal = ({ open, onClose }) => {
  const { user, logout, changePassword } = useAuth();
  const { coupons } = useCoupons();
  const [tab, setTab] = useState("profile");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");

  // For demo, show all coupons as submitted by user if user is logged in
  const submittedDeals = user ? coupons.filter(c => c.userId === user.uid) : [];
  // Placeholder for saved coupons
  const savedCoupons = [
    { id: 1, description: "Saved Coupon 1" },
    { id: 2, description: "Saved Coupon 2" },
  ];

  const handlePasswordChange = async e => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");
    if (!currentPassword) {
      setPwError("Please enter your current password.");
      return;
    }
    if (!password || password.length < 6) {
      setPwError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setPwError("Passwords do not match.");
      return;
    }
    setPwLoading(true);
    try {
      await changePassword(password, currentPassword);
      setPwSuccess("Password changed successfully!");
      setPassword("");
      setConfirm("");
      setCurrentPassword("");
    } catch (err) {
      setPwError(err.message || "Failed to change password.");
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ minWidth: 350, maxWidth: 500, background: "#fff", borderRadius: 16, boxShadow: "var(--shadow-standard)", padding: 0 }}>
        <div style={tabStyle}>
          <button style={tabBtnStyle(tab === "profile")}
            onClick={() => setTab("profile")}>Profile Details</button>
          <button style={tabBtnStyle(tab === "password")}
            onClick={() => setTab("password")}>Change Password</button>
        </div>
        {tab === "profile" && (
          <div style={{ textAlign: "center", padding: 32 }}>
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || "user"}`}
              alt="Profile"
              style={{ width: 80, height: 80, borderRadius: "50%", marginBottom: 16 }}
            />
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>{user?.displayName || user?.email?.split("@")?.[0] || "User"}</div>
            <div style={{ color: "#888", fontSize: 16, marginBottom: 16 }}>@{user?.email?.split("@")?.[0]}</div>
            <div style={{ color: "#444", fontSize: 15, marginBottom: 24 }}>
              From your account you can edit your <b>Profile Details</b> and <b>Edit Your Password</b>.
            </div>
            <section style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 17, margin: "16px 0 8px 0" }}>Submitted Deals</h3>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                {submittedDeals.map(deal => (
                  <Card key={deal.id}>{deal.description}</Card>
                ))}
              </div>
            </section>
            <section>
              <h3 style={{ fontSize: 17, margin: "16px 0 8px 0" }}>Account Info</h3>
              <Card>Email: {user ? user.email : "Not logged in"}</Card>
            </section>
            <div style={{ color: "#888", fontSize: 14, margin: "24px 0 16px 0" }}>
              Not <b>{user?.displayName || user?.email?.split("@")?.[0] || "User"}</b>?
            </div>
            <button
              onClick={logout}
              style={{ color: "#7c3aed", background: "none", border: "none", fontWeight: 600, fontSize: 16, cursor: "pointer" }}
            >
              Sign Out
            </button>
          </div>
        )}
        {tab === "password" && (
          <form onSubmit={handlePasswordChange} style={{ padding: 32, textAlign: "center" }}>
            <div style={{ marginBottom: 16 }}>
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd", fontSize: 16, marginBottom: 8 }}
                autoComplete="current-password"
              />
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd", fontSize: 16, marginBottom: 8 }}
                autoComplete="new-password"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd", fontSize: 16 }}
                autoComplete="new-password"
              />
            </div>
            {pwError && <div style={{ color: "#dc3545", marginBottom: 8 }}>{pwError}</div>}
            {pwSuccess && <div style={{ color: "#28a745", marginBottom: 8 }}>{pwSuccess}</div>}
            <button
              type="submit"
              style={{ background: "#7c3aed", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 700, fontSize: 16, cursor: "pointer", marginTop: 8 }}
              disabled={pwLoading}
            >
              {pwLoading ? "Changing..." : "Change Password"}
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default ProfileModal;