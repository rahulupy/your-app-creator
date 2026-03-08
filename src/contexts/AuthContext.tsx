import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const ML_API_BASE_URL = import.meta.env.VITE_ML_API_URL || "https://nontutorial-sharolyn-intersocial.ngrok-free.dev";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("mediscan_user");
    if (stored) {
      setUsername(stored);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (user: string, password: string) => {
    const response = await fetch(`${ML_API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ username: user, password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.message || "Invalid credentials");
    }

    setUsername(user);
    setIsAuthenticated(true);
    sessionStorage.setItem("mediscan_user", user);
  };

  const logout = () => {
    setUsername(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem("mediscan_user");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
