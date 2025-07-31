import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function useCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const couponsSnap = await getDocs(collection(db, "coupons"));
        const storesSnap = await getDocs(collection(db, "stores"));
        setCoupons(couponsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setStores(storesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { coupons, stores, loading, error };
} 