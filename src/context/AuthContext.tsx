import { createContext, useState, useContext, type ReactNode } from "react";

type User = {
  email: string;
  password: string;
} | null

function createAuthStore() {
  const [user, setUser] = useState<User>(
    localStorage.getItem("currentUser")
      ? { email: localStorage.getItem(JSON.parse("currentUser").email) as string, password: localStorage.getItem(JSON.parse("currentUser").password) as string }
      : null,
  );

  function signUp(email: string, password: string) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find((u: User) => u?.email === email)) {
      return { success: false, error: "Email already exists" };
    }
    const newUser = { email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(user));

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

  return {user, setUser, signUp, login, logout}
}

type AuthContextType = ReturnType<typeof createAuthStore>

const AuthContext = createContext<AuthContextType>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const store = createAuthStore()

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
