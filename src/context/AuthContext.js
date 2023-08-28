import { useContext, createContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { useGlobalContext } from "./GlobalContext";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, updatePassword, sendPasswordResetEmail, sendEmailVerification } from "firebase/auth";
import axios from "axios";

const baseUrl = process.env.API_BASE_URL
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
    const [userDetails, setUserDetails] = useState({});
    const [initializing, setInitializing] = useState(true);
    const [blurFirstImage, setBlurFirstImage] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': user.accessToken,
                    };
                    const response = await axios.get(`${baseUrl}/api/v1/user/profile`, { headers: headers });
                    setUserDetails(response.data); // Backend sends updated details, including updated limits
                    if (response.data.plan === 'free' && response.data.current_usage > response.data.limit) {
                        setBlurFirstImage(true);
                    }

                } catch (err) {
                    console.log(err)
                    // console.error("Error fetching user details:", err.response.data.message); // Handle error another way
                }
            }

            setUser(user);
            setInitializing(false);
        });

        return unsubscribe;
    }, []);


    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    const logOut = () => {
        return signOut(auth);
    };

    const emailSignUp = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const emailSignIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const changePassword = (password) => {
        return updatePassword(auth.currentUser, password);
    };

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    const verifyEmail = () => {
        return sendEmailVerification(auth.currentUser);
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
        userDetails,
        blurFirstImage,
        setBlurFirstImage

    };

    return (
        <AuthContext.Provider value={value}>
            {initializing ? <LoadingScreen /> : children}
        </AuthContext.Provider>
    );
}


