import { useContext, createContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, updatePassword, sendPasswordResetEmail, sendEmailVerification } from "firebase/auth";

const AuthContext = createContext();

const LoadingScreen = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
    );
};

export function userAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log('Running onAuthStateChanged')
            console.log(user);
            setUser(user);
            setInitializing(false);
        });
        return unsubscribe;
    }, []);


    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    const logOut = () => {
        signOut(auth);
    };

    const emailSignUp = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const emailSignIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const changePassword = (password) => {
        updatePassword(auth.currentUser, password);
    };

    const resetPassword = (email) => {
        sendPasswordResetEmail(auth, email);
    };

    const verifyEmail = () => {
        sendEmailVerification(auth.currentUser);
    };

    const value = {
        user,
        googleSignIn,
        logOut,
        emailSignUp,
        verifyEmail,
        emailSignIn,
        changePassword,
        resetPassword,
        initializing,
    };

    return (
        <AuthContext.Provider value={value}>
            {initializing ? <LoadingScreen /> : children}
        </AuthContext.Provider>
    );
}


