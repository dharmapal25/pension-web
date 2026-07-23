import { createContext, useContext, useEffect, useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import API from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);
  

  const loginWithGoogle = async () => {
    const { user: firebaseUser } = await signInWithPopup(auth, googleProvider);
    const { data } = await API.post("/api/auth/login", {
      name: firebaseUser.displayName,
      email: firebaseUser.email,
      firebaseUid: firebaseUser.uid,
      profileImage: firebaseUser.photoURL,
    });
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    setUser(null);
    await API.post("/api/auth/logout");
    await signOut(auth);
  };

  return <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
