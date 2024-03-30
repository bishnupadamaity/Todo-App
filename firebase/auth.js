import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { auth } from "./firebase";

const AuthUserContext = createContext({
    authUser: null,
    isLoading: true,
});

export default function useFirebaseAuth() {
    const [authUser, setAuthUser] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const clear = () => {
        setAuthUser(null);
        setLoading(false);
    };
    const authStateChanged = async (user) => {
        setLoading(true);
        if (!user) {
            clear();
            return;
        }

        setAuthUser({
            uid: user.uid,
            email: user.email,
            userName: user.displayName,
            accessToken: user?.accessToken,
        });
        setLoading(false);
    };

    const signOut = () => {
        console.log("sign out is called");
        authSignOut(auth).then(() => clear());
    };
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, authStateChanged);
        return () => unsubscribe();
    }, []);
    return {
        authUser,
        isLoading,
        signOut,
        setAuthUser,
    };
}

export const AuthUserProvider = ({ children }) => {
    const auth = useFirebaseAuth();
    return (
        <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
    );
};

export const useAuth = () => useContext(AuthUserContext);
