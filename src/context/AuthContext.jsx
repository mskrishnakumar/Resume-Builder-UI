import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    // Helper to force update user state (e.g. after updateProfile)
    const refreshUser = async () => {
        if (auth.currentUser) {
            await auth.currentUser.reload();
            // Create a new object reference that inherits from the user prototype
            // This ensures methods like getIdToken work while triggering React updates
            const updatedUser = Object.create(Object.getPrototypeOf(auth.currentUser));
            Object.assign(updatedUser, auth.currentUser);
            setUser(updatedUser);
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        signOut,
        loading,
        refreshUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
