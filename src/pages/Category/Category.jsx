import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import useCoupons from "../../hooks/useCoupons";
import Modal from "../../components/Modal/Modal";

const Category = () => {
  const { categoryId } = useParams();
  const { coupons, loading, error } = useCoupons();
  const categoryCoupons = coupons.filter(c => c.category?.toLowerCase() === categoryId?.toLowerCase());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (selectedCoupon?.promoCode) {
      navigator.clipboard.writeText(selectedCoupon.promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <>
      <Header />
      <main>
        <Breadcrumbs items={[
          { label: "Home", to: "/" },
          { label: categoryId, to: `/category/${categoryId}` }
        ]} />
        <h2>{categoryId} Coupons</h2>
        {loading && <p>Loading coupons...</p>}
        {error && <p style={{ color: 'red' }}>Error loading coupons.</p>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {categoryCoupons.map(coupon => (
            <Card key={coupon.id} variant="promoCard">
              <div className="imageContainer" style={{ borderBottom: "1px solid #E0E0E0", paddingBottom: 8 }}>
                {coupon.storeLogo && <img src={coupon.storeLogo} alt={coupon.storeName} style={{ height: 32 }} />}
              </div>
              <div className="textContainer" style={{ padding: 12 }}>
                <h3 style={{ margin: 0 }}>{coupon.storeName}: {coupon.description}</h3>
                <p style={{ margin: "8px 0" }}>Use code <b>{coupon.promoCode}</b></p>
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
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 2, marginBottom: 16, background: "#F2F2F2", padding: 12, borderRadius: 8, display: "inline-block" }}>
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

export default Category; 