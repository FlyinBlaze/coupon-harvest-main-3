import { db } from "./firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";

// Add a new coupon to pending deals (for admin review)
export async function addCoupon(deal) {
  const pendingDealsRef = collection(db, "pendingDeals");
  const docRef = await addDoc(pendingDealsRef, deal);
  return docRef.id;
}

// Move a pending deal to the main coupons collection (admin approval)
export async function approveDeal(dealId, dealData) {
  const couponsRef = collection(db, "coupons");
  const newCouponRef = doc(couponsRef);
  await setDoc(newCouponRef, dealData);
  await deleteDoc(doc(db, "pendingDeals", dealId));
}

// Reject (delete) a pending deal
export async function rejectDeal(dealId) {
  await deleteDoc(doc(db, "pendingDeals", dealId));
}

// Edit a coupon
export async function editCoupon(couponId, updatedData) {
  const couponRef = doc(db, "coupons", couponId);
  await updateDoc(couponRef, updatedData);
}

// Delete a coupon
export async function deleteCoupon(couponId) {
  await deleteDoc(doc(db, "coupons", couponId));
}

// Get all pending deals
export async function getPendingDeals() {
  const snap = await getDocs(collection(db, "pendingDeals"));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get all coupons
export async function getAllCoupons() {
  const snap = await getDocs(collection(db, "coupons"));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get all stores
export async function getAllStores() {
  const snap = await getDocs(collection(db, "stores"));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Edit a store
export async function editStore(storeId, updatedData) {
  const storeRef = doc(db, "stores", storeId);
  await updateDoc(storeRef, updatedData);
}

// Delete a store
export async function deleteStore(storeId) {
  await deleteDoc(doc(db, "stores", storeId));
} 