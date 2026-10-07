import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  loginRequest,
  signupRequest,
  logoutRequest,
  fetchCurrentUser,
  refreshSession,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, try to silently re-establish a session from the
  // httpOnly refresh cookie (e.g. after a hard page refresh).
  useEffect(() => {
    const restoreSession = async () => {
      try {
        await refreshSession();
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  // If any API call hits an unrecoverable 401, the api interceptor
  // dispatches this event so the whole app drops back to logged-out.
  useEffect(() => {
    const handleForceLogout = () => setUser(null);
    window.addEventListener("tradeflow:logout", handleForceLogout);
    return () => window.removeEventListener("tradeflow:logout", handleForceLogout);
  }, []);

  const login = useCallback(async (credentials) => {
    const loggedInUser = await loginRequest(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const signup = useCallback(async (payload) => {
    const newUser = await signupRequest(payload);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
