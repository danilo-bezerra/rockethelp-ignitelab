import { NavigationContainer } from "@react-navigation/native";

import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

import { AppRoutes } from "./app.routes";
import { useState, useEffect, useContext } from "react";
import { Loading } from "../components/Loading";
import { AuthRoutes } from "./auth.routes";
import { UserContext } from "../contexts/UserContext";

export function Routes() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>();

  const {
    user: contextUser,
    isLoading,
    setIsLoading,
  } = useContext(UserContext);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((response) => {
      setUser(response);
      setIsLoading(false);
    });

    return subscriber;
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {contextUser ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
