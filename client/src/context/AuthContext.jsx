import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    {/* 2-step access */ }
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const onAuthState = onAuthStateChanged(auth, (cur) => {
            setUser(cur)
            console.log("Cur user data : ", user);
            setLoading(false)
        })
        return () => onAuthState()
    }, [])

    console.log("first")

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children} {/* 3-step consume */}
        </AuthContext.Provider>
    )

}

export function useAuth() {
    return useContext(AuthContext);
}