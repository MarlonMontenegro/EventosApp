import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../firebase/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

export const AuthContext = createContext(null);

const API_URL = "http://192.168.1.15:3000/api";

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null); // ID token de Firebase
  const [loading, setLoading] = useState(true); // carga inicial app
  const [isLoading, setIsLoading] = useState(false); // login/register
  const [error, setError] = useState(null); // mensaje de error para UI

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          setUserToken(token);
          await AsyncStorage.setItem("token", token);
        } else {
          setUserToken(null);
          await AsyncStorage.removeItem("token");
        }
      } catch (e) {
        console.log("Error al obtener o guardar token:", e);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();
      setUserToken(token);
      await AsyncStorage.setItem("token", token);

      // Más adelante: aquí podríamos llamar a /api/users/me si quieres
    } catch (e) {
      console.log("Error login Firebase:", e);
      setError("No se pudo iniciar sesión. Verifica tus datos.");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // helper para hablar con tu backend
  const syncUserWithBackend = async (token, name, email) => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // authMiddleware lo lee aquí
        },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        console.log("Error al registrar usuario en backend:", data);
        // no lanzamos error obligatorio para no romper el flujo de registro
      } else {
        const data = await res.json();
        console.log("Usuario sincronizado con backend:", data);
      }
    } catch (e) {
      console.log("Error de red al llamar a backend /api/users:", e);
    }
  };

  const register = async (email, password, name) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1) Crear usuario en Firebase
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }

      // 2) Obtener ID token
      const token = await cred.user.getIdToken();

      setUserToken(token);
      await AsyncStorage.setItem("token", token);

      // 3) Avisar a tu backend para guardar en Firestore
      await syncUserWithBackend(token, name, email);
    } catch (e) {
      console.log("Error register Firebase:", e);
      setError("No se pudo crear la cuenta. Inténtalo de nuevo.");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (e) {
      console.log("Error al cerrar sesión:", e);
    } finally {
      setUserToken(null);
      setError(null);
      await AsyncStorage.removeItem("token");
    }
  };

  const value = {
    userToken,
    loading,
    isLoading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
