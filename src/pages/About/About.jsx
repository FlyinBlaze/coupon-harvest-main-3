import React from "react";
import Header from "../../components/Header/Header";
import useAuth from "../../hooks/useAuth";
import Modal from "../../components/Modal/Modal";
import Button from "../../components/Button/Button";
import ProfileModal from "../../components/ProfileModal/ProfileModal";

function AuthModal({ open, onClose }) {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isLogin) await login(email, password);
      else await signup(email, password);
      onClose();
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ minWidth: 300, textAlign: "center" }}>
        <h2 style={{ fontSize: "var(--font-size-h2, 22px)", fontWeight: 600, marginTop: 0 }}>{isLogin ? "Login" : "Sign Up"}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 12, borderRadius: 6, border: "1px solid #E0E0E0" }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 12, borderRadius: 6, border: "1px solid #E0E0E0" }}
          required
        />
        {error && <div style={{ color: "var(--color-system-error, #DC3545)", marginBottom: 8 }}>{error}</div>}
        <Button type="submit" variant="primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? (isLogin ? "Logging in..." : "Signing up...") : (isLogin ? "Login" : "Sign Up")}
        </Button>
        <div style={{ marginTop: 16 }}>
          <span style={{ color: "var(--color-neutral-dark-gray, #6C6C6C)", fontSize: 14 }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <Button
            type="button"
            variant="secondary"
            style={{ marginLeft: 8, fontSize: 14, padding: "4px 12px" }}
            onClick={() => setIsLogin(l => !l)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

const About = () => {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);
  return (
    <>
      <Header
        isLoggedIn={!!user}
        onLoginClick={() => setAuthModalOpen(true)}
        onProfileClick={() => setProfileModalOpen(true)}
        hideSearchBar={true}
        searchValue={""}
        onSearchChange={() => {}}
        onSearchSubmit={() => {}}
      />
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <ProfileModal open={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
      <main style={{ maxWidth: 700, margin: "48px auto", background: "var(--color-neutral-white)", borderRadius: 16, boxShadow: "var(--shadow-standard)", padding: 32 }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 700, marginBottom: 16 }}>About Coupon Harvest</h1>
        <p style={{ fontSize: 18, color: "var(--color-neutral-dark-gray)" }}>
          Coupon Harvest is your one-stop destination for the latest coupons, promo codes, and cash back offers. We help you save more at your favorite stores by curating the best deals and making them easy to find and use.
        </p>
        <ul style={{ fontSize: 16, color: "var(--color-neutral-dark-gray)", marginTop: 24 }}>
          <li>Curated deals from top stores</li>
          <li>Easy-to-use promo codes</li>
          <li>Exclusive cash back offers</li>
          <li>Community-driven submissions</li>
        </ul>
      </main>
    </>
  );
};

export default About;