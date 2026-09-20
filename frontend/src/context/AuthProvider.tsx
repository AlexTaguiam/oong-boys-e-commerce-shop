// AuthProvider.tsx
import React, { useCallback, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { AuthContext, type AuthUserTemplate } from "./authContext";
import { logOut } from "../services/auth.service";
import {
  getMyProfile,
  type DbUserProfile,
} from "../services/profile.service";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthUserTemplate | null>(null);
  const [dbProfile, setDbProfile] = useState<DbUserProfile | null>(null);
  const [role, setRole] = useState<"admin" | "customer" | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch the persisted DB profile (name/phone/address). Safe to call anytime
  // a Firebase user is present; silently no-ops when signed out.
  const refreshProfile = useCallback(async () => {
    const currentUser = getAuth().currentUser;
    if (!currentUser) {
      setDbProfile(null);
      return;
    }
    try {
      const res = await getMyProfile();
      setDbProfile(res.data ?? null);
    } catch (error) {
      // A missing profile (404) or transient error shouldn't crash auth state.
      console.error("Failed to load DB profile:", error);
      setDbProfile(null);
    }
  }, []);

  useEffect(() => {
    const authInstance = getAuth();

    const unsubscribe = onAuthStateChanged(
      authInstance,
      async (currentUser) => {
        setLoading(true);
        if (currentUser) {
          setUser(currentUser);
          setProfile({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            phoneNumber: currentUser.phoneNumber,
            photoURL: currentUser.photoURL,
          });

          try {
            const tokenResult = await currentUser.getIdTokenResult();
            const extractedRole = tokenResult.claims.role as
              | "admin"
              | "customer";
            setRole(extractedRole || "customer");
          } catch (error) {
            console.error("Error reading Firebase custom token claims:", error);
            setRole("customer");
          }

          // Hydrate the persisted profile from the backend.
          await refreshProfile();
        } else {
          setUser(null);
          setProfile(null);
          setDbProfile(null);
          setRole(null);
        }
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [refreshProfile]);

  const logout = async () => {
    setLoading(true);
    try {
      await logOut();
      setUser(null);
      setProfile(null);
      setDbProfile(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, dbProfile, role, loading, logout, refreshProfile }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
