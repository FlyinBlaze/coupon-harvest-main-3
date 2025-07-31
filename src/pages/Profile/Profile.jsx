import React from "react";
import Header from "../../components/Header/Header";
import Card from "../../components/Card/Card";
import useAuth from "../../hooks/useAuth";
import useCoupons from "../../hooks/useCoupons";

const Profile = () => {
  const { user } = useAuth();
  const { coupons } = useCoupons();
  // For demo, show all coupons as submitted by user if user is logged in
  const submittedDeals = user ? coupons.filter(c => c.userId === user.uid) : [];

  return (
    <>
      <Header />
      <main style={{ maxWidth: 800, margin: "32px auto", padding: "0 16px" }}>
        <h2>My Profile</h2>
        <section style={{ marginBottom: 32 }}>
          <h3>Saved Coupons</h3>
          <div style={{ display: "flex", gap: 24 }}>
            {/* Placeholder for saved coupons */}
            <Card>Saved Coupon 1</Card>
            <Card>Saved Coupon 2</Card>
          </div>
        </section>
        <section style={{ marginBottom: 32 }}>
          <h3>Submitted Deals</h3>
          <div style={{ display: "flex", gap: 24 }}>
            {submittedDeals.length === 0 && <Card>No submitted deals yet.</Card>}
            {submittedDeals.map(deal => (
              <Card key={deal.id}>{deal.description}</Card>
            ))}
          </div>
        </section>
        <section>
          <h3>Account Info</h3>
          <Card>Email: {user ? user.email : "Not logged in"}</Card>
        </section>
      </main>
    </>
  );
};

export default Profile; 