import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import useCoupons from "../../hooks/useCoupons";
import useAuth from "../../hooks/useAuth";
import Modal from "../../components/Modal/Modal";
import SubmitDeal from "../SubmitDeal/SubmitDeal";
import ProfileModal from "../../components/ProfileModal/ProfileModal";

const sectionStyle = {
  background: "var(--color-neutral-white)",
  borderRadius: 16,
  boxShadow: "var(--shadow-standard)",
  padding: 32,
  marginBottom: 40,
};

const headingStyle = {
  fontSize: "var(--font-size-h2)",
  fontWeight: "var(--font-weight-semi-bold)",
  color: "var(--color-neutral-text-black)",
  marginTop: 0,
  marginBottom: 24,
};

const tagStyle = {
  display: "inline-block",
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 600,
  padding: "4px 8px",
  marginRight: 8,
  marginBottom: 8,
};

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
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
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

const Home = () => {
  const { coupons, loading, error } = useCoupons();
  const { user, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [copied, setCopied] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const navigate = useNavigate();

  // Filter coupons by storeName
  const filteredCoupons = search
    ? coupons.filter(c => c.storeName && c.storeName.toLowerCase().includes(search.toLowerCase()))
    : coupons;

  // Trending coupons: first 3 filtered
  const trendingCoupons = filteredCoupons.slice(0, 3);
  // Top stores: group by storeName, get logo and name, count coupons
  const storeMap = {};
  filteredCoupons.forEach(c => {
    if (c.storeName) {
      if (!storeMap[c.storeName]) storeMap[c.storeName] = { ...c, count: 0 };
      storeMap[c.storeName].count++;
    }
  });
  const topStores = Object.values(storeMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

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
      {/* Hero Section */}
      <div style={{
        background: "var(--color-neutral-black, #000)",
        color: "#fff",
        padding: "48px 0 32px 0",
        textAlign: "center",
        marginBottom: 32,
        border: "1px solid var(--color-neutral-medium-gray, #4A4A4A)",
        borderRadius: "16px",
      }}>
        <h1 style={{ fontSize: "var(--font-size-h1, 28px)", fontWeight: "var(--font-weight-bold, 700)", margin: 0, color: "#fff" }}>Find the Best Coupons & Deals</h1>
        <p style={{ fontSize: 20, margin: "16px 0 24px 0", color: "#fff" }}>Save more at your favorite stores with exclusive promo codes and cash back offers.</p>
        <Button variant="primary" style={{ fontSize: 18, padding: "12px 32px", marginRight: 16 }} onClick={() => {
          if (!user) {
            setAuthModalOpen(true);
          } else {
            setSubmitModalOpen(true);
          }
        }}>
          Submit a Deal
        </Button>
      </div>
      <main>
        {/* Trending Coupons */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>Trending Coupons</h2>
          {loading && <p style={{ color: "var(--color-neutral-dark-gray, #6C6C6C)" }}>Loading coupons...</p>}
          {error && <p style={{ color: 'var(--color-system-error, #DC3545)' }}>Error loading coupons.</p>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {trendingCoupons.length === 0 && !loading && <p>No trending coupons found.</p>}
            {trendingCoupons.map(coupon => (
              <Card key={coupon.id} variant="promoCard" style={{ cursor: "pointer", transition: "box-shadow 0.2s" }}>
                <div className="imageContainer" style={{ borderBottom: "1px solid var(--color-neutral-medium-gray, #E0E0E0)", paddingBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  <img src={coupon.storeLogo} alt={coupon.storeName} style={{ height: 32, borderRadius: 6, background: "#fff" }} />
                  <span style={{ fontWeight: 600, fontSize: 18 }}>{coupon.storeName}</span>
                </div>
                <div className="textContainer" style={{ padding: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 18, color: "var(--color-neutral-text-black, #222222)", fontWeight: 600 }}>{coupon.description}</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "8px 0" }}>
                    <p style={{ margin: 0, color: "var(--color-neutral-dark-gray, #6C6C6C)", fontSize: 14 }}>Use code <b style={{ color: "var(--color-primary-purple, #4A1D96)" }}>{coupon.promoCode}</b></p>
                    <Button variant="primary" onClick={() => { setSelectedCoupon(coupon); setModalOpen(true); }}>Copy Code</Button>
                  </div>
                  {/* Discount/Cashback tags */}
                  {coupon.discount && (
                    <span style={{ ...tagStyle, background: "var(--color-accent-light-purple, #E6DFF6)", color: "var(--color-primary-purple, #4A1D96)" }}>{coupon.discount}</span>
                  )}
                  {coupon.cashBack && (
                    <span style={{ ...tagStyle, background: "var(--color-neutral-white, #fff)", color: "var(--color-secondary-teal, #00A3A3)", border: "1px solid var(--color-neutral-medium-gray, #E0E0E0)" }}>{coupon.cashBack}</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
        {/* Top Stores */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>Top Stores</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 32, justifyItems: "center" }}>
            {topStores.length === 0 && !loading && <p>No stores found.</p>}
            {topStores.map(store => (
              <div
                key={store.storeName}
                style={{ cursor: "pointer", textAlign: "center" }}
                onClick={() => navigate(`/store/${encodeURIComponent(store.storeName)}`)}
              >
                <div style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  background: "#fff",
                  boxShadow: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px auto",
                  border: "1px solid var(--color-neutral-medium-gray, #E0E0E0)",
                  transition: "box-shadow 0.2s, border 0.2s",
                }}>
                  <img
                    src={store.storeLogo}
                    alt={store.storeName}
                    style={
                      store.storeName === "Walmart"
                        ? {
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            objectFit: "contain",
                            background: "#fff",
                            padding: 6,
                            display: "block",
                            margin: "0 auto"
                          }
                        : {
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            background: "#fff",
                            display: "block",
                            margin: "0 auto"
                          }
                    }
                  />
                </div>
                <div style={{ fontWeight: 600, fontSize: 16, marginTop: 4, color: "var(--color-neutral-text-black, #222222)" }}>{store.storeName}</div>
                <div style={{ fontSize: 13, color: "var(--color-neutral-dark-gray, #6C6C6C)" }}>{store.count} deal{store.count > 1 ? "s" : ""}</div>
              </div>
            ))}
          </div>
        </section>
        {/* More Trending Coupons */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>More Trending Coupons</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {filteredCoupons.filter(c => !trendingCoupons.some(tc => tc.id === c.id)).slice(0, 7).map(coupon => (
              <Card key={coupon.id} variant="promoCard" style={{ cursor: "pointer", transition: "box-shadow 0.2s" }}>
                <div className="imageContainer" style={{ borderBottom: "1px solid var(--color-neutral-medium-gray, #E0E0E0)", paddingBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  <img src={coupon.storeLogo} alt={coupon.storeName} style={{ height: 32, borderRadius: 6, background: "#fff" }} />
                  <span style={{ fontWeight: 600, fontSize: 18 }}>{coupon.storeName}</span>
                </div>
                <div className="textContainer" style={{ padding: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 18, color: "var(--color-neutral-text-black, #222222)", fontWeight: 600 }}>{coupon.description}</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "8px 0" }}>
                    <p style={{ margin: 0, color: "var(--color-neutral-dark-gray, #6C6C6C)", fontSize: 14 }}>Use code <b style={{ color: "var(--color-primary-purple, #4A1D96)" }}>{coupon.promoCode}</b></p>
                    <Button variant="primary" onClick={() => { setSelectedCoupon(coupon); setModalOpen(true); }}>Copy Code</Button>
                  </div>
                  {/* Discount/Cashback tags */}
                  {coupon.discount && (
                    <span style={{ ...tagStyle, background: "var(--color-accent-light-purple, #E6DFF6)", color: "var(--color-primary-purple, #4A1D96)" }}>{coupon.discount}</span>
                  )}
                  {coupon.cashBack && (
                    <span style={{ ...tagStyle, background: "var(--color-neutral-white, #fff)", color: "var(--color-secondary-teal, #00A3A3)", border: "1px solid var(--color-neutral-medium-gray, #E0E0E0)" }}>{coupon.cashBack}</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
        {/* More Top Stores */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>More Top Stores</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 32, justifyItems: "center" }}>
            {Object.values(storeMap).filter(s => !topStores.some(ts => ts.storeName === s.storeName)).slice(0, 7).map(store => (
              <div
                key={store.storeName}
                style={{ cursor: "pointer", textAlign: "center" }}
                onClick={() => navigate(`/store/${encodeURIComponent(store.storeName)}`)}
              >
                <div style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  background: "#fff",
                  boxShadow: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px auto",
                  border: "1px solid var(--color-neutral-medium-gray, #E0E0E0)",
                  transition: "box-shadow 0.2s, border 0.2s",
                }}>
                  <img
                    src={store.storeLogo}
                    alt={store.storeName}
                    style={
                      store.storeName === "Walmart"
                        ? {
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            objectFit: "contain",
                            background: "#fff",
                            padding: 6,
                            display: "block",
                            margin: "0 auto"
                          }
                        : {
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            background: "#fff",
                            display: "block",
                            margin: "0 auto"
                          }
                    }
                  />
                </div>
                <div style={{ fontWeight: 600, fontSize: 16, marginTop: 4, color: "var(--color-neutral-text-black, #222222)" }}>{store.storeName}</div>
                <div style={{ fontSize: 13, color: "var(--color-neutral-dark-gray, #6C6C6C)" }}>{store.count} deal{store.count > 1 ? "s" : ""}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedCoupon && (
          <div style={{ textAlign: "center" }}>
            <h2 style={{ marginBottom: 8, fontSize: "var(--font-size-h2, 22px)", fontWeight: 600 }}>{selectedCoupon.storeName}</h2>
            <p style={{ marginBottom: 16, color: "var(--color-neutral-dark-gray, #6C6C6C)" }}>{selectedCoupon.description}</p>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 2, marginBottom: 16, background: "#F2F2F2", padding: 12, borderRadius: 8, display: "inline-block", color: "var(--color-primary-purple, #4A1D96)" }}>
              {selectedCoupon.promoCode}
            </div>
            <div>
              <Button variant="primary" onClick={handleCopy}>{copied ? "Copied!" : "Copy Code"}</Button>
            </div>
          </div>
        )}
      </Modal>
      <Modal open={submitModalOpen} onClose={() => setSubmitModalOpen(false)}>
        <SubmitDeal asModal onSuccess={() => setSubmitModalOpen(false)} />
      </Modal>
    </>
  );
};

export default Home; 