import { createContext, useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

export const UserContext = createContext(null);

export function UserContextProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((response) => {
      setUser(response);
      setIsLoading(false);
    });

    return subscriber;
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, setIsLoading }}>
      {children}
    </UserContext.Provider>
  );
}
