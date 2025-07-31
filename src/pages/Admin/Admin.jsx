import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import {
  getPendingDeals,
  approveDeal,
  rejectDeal,
  getAllCoupons,
  deleteCoupon,
  editCoupon as updateCoupon,
} from "../../services/couponService";
import useAuth from "../../hooks/useAuth";
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

const Admin = () => {
  const { profile, user } = useAuth();
  const [tab, setTab] = useState("pending");
  const [pendingDeals, setPendingDeals] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    description: "",
    promoCode: "",
    storeName: "",
    storeLogo: "",
    expiryDate: ""
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    if (!profile || profile.role !== "admin") return;
    setLoading(true);
    Promise.all([getPendingDeals(), getAllCoupons()])
      .then(([deals, coupons]) => {
        setPendingDeals(deals);
        setCoupons(coupons);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading admin data:", error);
        setLoading(false);
      });
  }, [profile]);



  if (!profile || profile.role !== "admin") {
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
        <main style={{ maxWidth: 800, margin: "32px auto", padding: "0 16px" }}>
          <h2>Admin Dashboard</h2>
          <p>You must be an admin to view this page.</p>
        </main>
      </>
    );
  }

  if (loading) {
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
        <main style={{ maxWidth: 800, margin: "32px auto", padding: "0 16px", textAlign: "center" }}>
          <h2>Loading Admin Dashboard...</h2>
        </main>
      </>
    );
  }

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
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} showClose={true}>
        <form style={{ minWidth: 320, padding: 24 }} onSubmit={async e => {
          e.preventDefault();
          setEditLoading(true);
          setEditError("");
          try {
            // Simple update with form data
            console.log("Updating coupon with form data:", editForm);
            setEditModalOpen(false);
          } catch (err) {
            setEditError("Failed to update coupon.");
          } finally {
            setEditLoading(false);
          }
        }}>
            <h3>Edit Coupon</h3>
            <div style={{ marginBottom: 12 }}>
              <label>Description</label>
              <input type="text" value={editForm.description || ""} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} style={{ width: "100%", padding: 8 }} required />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Promo Code</label>
              <input type="text" value={editForm.promoCode || ""} onChange={e => setEditForm(f => ({ ...f, promoCode: e.target.value }))} style={{ width: "100%", padding: 8 }} required />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Store Name</label>
              <input type="text" value={editForm.storeName || ""} onChange={e => setEditForm(f => ({ ...f, storeName: e.target.value }))} style={{ width: "100%", padding: 8 }} required />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Store Logo URL</label>
              <input type="url" value={editForm.storeLogo || ""} onChange={e => setEditForm(f => ({ ...f, storeLogo: e.target.value }))} style={{ width: "100%", padding: 8 }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Expiry Date</label>
              <input type="date" value={editForm.expiryDate || ""} onChange={e => setEditForm(f => ({ ...f, expiryDate: e.target.value }))} style={{ width: "100%", padding: 8 }} />
            </div>
            {editError && <div style={{ color: "#dc3545", marginBottom: 8 }}>{editError}</div>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button variant="secondary" type="button" onClick={() => setEditModalOpen(false)}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={editLoading}>{editLoading ? "Saving..." : "Save"}</Button>
            </div>
          </form>
      </Modal>
      <main style={{ maxWidth: 1000, margin: "32px auto", padding: "0 16px" }}>
        <h2>Admin Dashboard</h2>
        <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
          <Button variant={tab === "pending" ? "primary" : "secondary"} onClick={() => setTab("pending")}>Pending Deal Submissions</Button>
          <Button variant={tab === "coupons" ? "primary" : "secondary"} onClick={() => setTab("coupons")}>Coupon Database</Button>
        </div>
        {tab === "pending" && (
          <section>
            <h3>Pending Deals</h3>
            {loading && <p>Loading...</p>}
            {pendingDeals.length === 0 && !loading && <p>No pending deals.</p>}
            <div style={{ display: "grid", gap: 24 }}>
              {pendingDeals.map(deal => (
                <Card key={deal.id} variant="promoCard">
                  <div style={{ marginBottom: 8 }}>
                    <b>{deal.storeName}</b> — {deal.description}
                  </div>
                  <div>Code: <b>{deal.promoCode}</b></div>
                  <div style={{ marginTop: 8 }}>
                    <Button variant="primary" onClick={async () => {
                      await approveDeal(deal.id, deal);
                      setPendingDeals(pendingDeals.filter(d => d.id !== deal.id));
                      setCoupons([...coupons, deal]);
                    }}>Approve</Button>
                    <Button variant="secondary" style={{ marginLeft: 8 }} onClick={async () => {
                      await rejectDeal(deal.id);
                      setPendingDeals(pendingDeals.filter(d => d.id !== deal.id));
                    }}>Reject</Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
        {tab === "coupons" && (
          <section>
            <h3>Coupon Database</h3>
            {loading && <p>Loading...</p>}
            {coupons.length === 0 && !loading && <p>No coupons in database.</p>}
            <div style={{ display: "grid", gap: 24 }}>
              {coupons.map(coupon => (
                <Card key={coupon.id} variant="promoCard">
                  <div style={{ marginBottom: 8 }}>
                    <b>{coupon.storeName}</b> — {coupon.description}
                  </div>
                  <div>Code: <b>{coupon.promoCode}</b></div>
                  <div style={{ marginTop: 8 }}>
                    <Button variant="secondary" onClick={() => {
                      setEditModalOpen(true);
                    }}>Edit</Button>
                    <Button variant="secondary" style={{ marginLeft: 8 }} onClick={async () => {
                      await deleteCoupon(coupon.id);
                      setCoupons(coupons.filter(c => c.id !== coupon.id));
                    }}>Delete</Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export default Admin;