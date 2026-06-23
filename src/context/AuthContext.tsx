import { createContext, useState, useContext, type ReactNode, useMemo } from "react";

type User = {
  email: string;
  password: string;
} | null

function useAuthStore() {
  const [user, setUser] = useState<User>(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (!storedUser) return null;

    return JSON.parse(storedUser);
  });

  function signUp(email: string, password: string) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find((u: User) => u?.email === email)) {
      return { success: false, error: "Email already exists" };
    }
    const newUser = { email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    setUser({ email, password });

    return { success: true };
  }

  function login(email: string, password: string) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u: User) => u?.email === email && u?.password === password,
    );

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    setUser({ email, password });

    return { success: true };
  }

  function logout() {
    localStorage.removeItem("currentUser");
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      signUp,
      login,
      logout,
    }),
    [user],
  );

  return value;
}

type AuthContextType = ReturnType<typeof useAuthStore>

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const store = useAuthStore()

  return (
    <AuthContext.Provider value={store}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthContext is not valid!");
  }

  return context;
}
