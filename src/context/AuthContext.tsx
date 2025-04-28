import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "firebaseApp";
import { createContext, useEffect, useState } from "react";

interface AuthContextProps {
  children: React.ReactNode;
}

const AuthContext = createContext({
  user: null as User | null,
});

export const AuthContextProvider = ({ children }: AuthContextProps) => {
  const auth = getAuth(app);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user: currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;