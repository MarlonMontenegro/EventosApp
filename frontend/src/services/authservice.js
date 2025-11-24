import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../firebase/firebaseConfig";

const TOKEN_KEY = "auth_token";

export const loginWithEmail = async (email, password) => {
  // Login con Firebase Auth
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const idToken = await userCredential.user.getIdToken();

  // Guardar token en AsyncStorage
  await AsyncStorage.setItem(TOKEN_KEY, idToken);

  return {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
  };
};

export const logout = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

export const getStoredToken = async () => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};
