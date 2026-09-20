// authContext.ts
import { createContext, useContext } from "react";
import type { User } from "firebase/auth";
import type { DbUserProfile } from "../services/profile.service";

export interface AuthUserTemplate {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
}

export interface AuthContextType {
  user: User | null;
  profile: AuthUserTemplate | null;
  /** Persisted profile record from the backend DB (name/phone/address). */
  dbProfile: DbUserProfile | null;
  role: "admin" | "customer" | null;
  loading: boolean;
  logout: () => Promise<void>;
  /** Re-fetch the DB profile (call after editing it). */
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth must be called from inside an active AuthProvider context shell.",
    );
  }
  return context;
};
