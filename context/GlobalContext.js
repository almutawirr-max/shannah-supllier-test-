import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { deleteItemAsync, getItemAsync } from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext(null);

export function useGlobal() {
  return useContext(GlobalContext);
}

export function GlobalProvider({ children }) {
  const [signedIn, setSignedIn] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const token = await getItemAsync("token");
        if (token !== null) {
          setSignedIn(true);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    signedIn &&
      (async () => {
        const userDataJson = await AsyncStorage.getItem("user");
        const userData = JSON.parse(userDataJson);
        setUserData(userData);
      })();
  }, [signedIn]);

  const signOut = async () => {
    await deleteItemAsync("token");
    await AsyncStorage.removeItem("user");
    setSignedIn(false);
    setUserData({});
    router.navigate("sign-in");
  };

  return (
    <GlobalContext.Provider
      value={{
        signedIn,
        setSignedIn,
        userData,
        setUserData,
        signOut,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
