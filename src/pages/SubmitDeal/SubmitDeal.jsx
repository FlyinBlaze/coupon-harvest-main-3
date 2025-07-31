import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import { addCoupon } from "../../services/couponService";

const initialState = {
  description: "",
  promoCode: "",
  storeName: "",
  storeLogo: "",
  expiryDate: ""
};

const SubmitDeal = ({ asModal, onSuccess }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      await addCoupon({
        ...form,
        expiryDate: form.expiryDate ? new Date(form.expiryDate) : null
      });
      setSuccess("Coupon submitted!");
      setForm(initialState);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Failed to submit coupon.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!asModal && <Header />}
      <main style={{ maxWidth: asModal ? 400 : 600, margin: asModal ? 0 : "32px auto", padding: asModal ? 0 : "0 16px" }}>
        <Card>
          <h2 style={{ fontSize: "var(--font-size-h2, 22px)", fontWeight: 600, marginTop: 0 }}>Submit a Coupon or Deal</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label>Description</label>
              <input name="description" type="text" value={form.description} onChange={handleChange} style={{ width: "100%", padding: 8, marginTop: 4 }} required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Promo Code</label>
              <input name="promoCode" type="text" value={form.promoCode} onChange={handleChange} style={{ width: "100%", padding: 8, marginTop: 4 }} required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Store Name</label>
              <input name="storeName" type="text" value={form.storeName} onChange={handleChange} style={{ width: "100%", padding: 8, marginTop: 4 }} required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Store Logo URL</label>
              <input name="storeLogo" type="url" value={form.storeLogo} onChange={handleChange} style={{ width: "100%", padding: 8, marginTop: 4 }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Expiry Date</label>
              <input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} style={{ width: "100%", padding: 8, marginTop: 4 }} />
            </div>
            <Button type="submit" variant="primary" disabled={loading}>{loading ? "Submitting..." : "Submit"}</Button>
            {success && <p style={{ color: 'green', marginTop: 12 }}>{success}</p>}
            {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
          </form>
        </Card>
      </main>
    </>
  );
};

export default SubmitDeal; 