import { useState, useEffect, useCallback } from "react";
import { auth, db } from "../services/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updatePassword,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

// Sync user profile to Firestore
async function syncUserProfile(user) {
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName || user.email.split("@")[0],
      role: "user",
      createdAt: new Date(),
    });
  }
}

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setUser(firebaseUser);
        setLoading(false);
        if (firebaseUser) {
          await syncUserProfile(firebaseUser);
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          setProfile(userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null);
        } else {
          setProfile(null);
        }
        setError(null);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }, (err) => {
      setError(err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      await syncUserProfile(res.user);
      setUser(res.user);
      const userRef = doc(db, "users", res.user.uid);
      const userSnap = await getDoc(userRef);
      setProfile(userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null);
      setLoading(false);
      return res.user;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, []);

  // Signup
  const signup = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await syncUserProfile(res.user);
      setUser(res.user);
      const userRef = doc(db, "users", res.user.uid);
      const userSnap = await getDoc(userRef);
      setProfile(userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null);
      setLoading(false);
      return res.user;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (newPassword) => {
    if (!auth.currentUser) throw new Error("No user logged in");
    setLoading(true);
    setError(null);
    try {
      await updatePassword(auth.currentUser, newPassword);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, []);

  return { user, profile, loading, error, login, signup, logout, changePassword };
} 