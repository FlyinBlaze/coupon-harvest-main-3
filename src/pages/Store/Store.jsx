import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import useCoupons from "../../hooks/useCoupons";
import Modal from "../../components/Modal/Modal";
import useAuth from "../../hooks/useAuth";
import ProfileModal from "../../components/ProfileModal/ProfileModal";

function AuthModal({ open, onClose }) {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      </form>
    </Modal>
  );
}

const Store = () => {
  const { storeId } = useParams();
  const { coupons, loading, error } = useCoupons();
  const storeCoupons = coupons.filter(c => c.storeName?.toLowerCase() === storeId?.toLowerCase());
  const storeLogo = storeCoupons[0]?.storeLogo;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Filter coupons by search
  const filteredCoupons = search
    ? storeCoupons.filter(c => c.storeName && c.storeName.toLowerCase().includes(search.toLowerCase()))
    : storeCoupons;

  const handleCopy = () => {
    if (selectedCoupon?.promoCode) {
      navigator.clipboard.writeText(selectedCoupon.promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <>
      <Header
        isLoggedIn={!!user}
        onLoginClick={() => setAuthModalOpen(true)}
        onProfileClick={() => setProfileModalOpen(true)}
        searchValue={search}
        onSearchChange={e => setSearch(e.target.value)}
        onSearchSubmit={() => {}}
      />
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <ProfileModal open={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
      <main>
        <Breadcrumbs items={[
          { label: "Home", to: "/" },
          { label: storeId, to: `/store/${storeId}` }
        ]} />
        <h2>{storeId} Coupons</h2>
        {loading && <p>Loading coupons...</p>}
        {error && <p style={{ color: 'red' }}>Error loading coupons.</p>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {filteredCoupons.map(coupon => (
            <Card key={coupon.id} variant="promoCard">
              <div className="imageContainer" style={{ borderBottom: "1px solid #E0E0E0", paddingBottom: 8 }}>
                {storeLogo && <img src={storeLogo} alt={coupon.storeName} style={{ height: 32 }} />}
              </div>
              <div className="textContainer" style={{ padding: 12 }}>
                <h3 style={{ margin: 0 }}>{coupon.description}</h3>
                <p style={{ margin: "8px 0" }}>Use code <b style={{ color: "#7c3aed" }}>{coupon.promoCode}</b></p>
                <Button variant="primary" onClick={() => { setSelectedCoupon(coupon); setModalOpen(true); }}>Copy Code</Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedCoupon && (
          <div style={{ textAlign: "center" }}>
            <h2 style={{ marginBottom: 8 }}>{selectedCoupon.storeName}</h2>
            <p style={{ marginBottom: 16 }}>{selectedCoupon.description}</p>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 2, marginBottom: 16, background: "#F2F2F2", padding: 12, borderRadius: 8, display: "inline-block", color: "#7c3aed" }}>
              {selectedCoupon.promoCode}
            </div>
            <div>
              <Button variant="primary" onClick={handleCopy}>{copied ? "Copied!" : "Copy Code"}</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Store; 