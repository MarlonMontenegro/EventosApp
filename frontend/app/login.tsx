import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { AuthContext } from "../src/context/authContext";

// Firebase
import { auth } from "../src/firebase/firebaseConfig";
import { FacebookAuthProvider, signInWithCredential } from "firebase/auth";

// Expo Facebook
import * as Facebook from "expo-facebook";

export default function LoginScreen() {
  const authCtx: any = useContext(AuthContext as any) || {};
  const { login, isLoading, error } = authCtx;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      await login(email.trim(), password);
      router.replace("/(tabs)");
    } catch {
      // El contexto ya maneja el error
    }
  }

  function goToRegister() {
    router.push("/register");
  }

  const isDisabled = !email || !password || isLoading;

  // 🔵 Login real con Facebook + Firebase
  const handleFacebookLogin = async () => {
    try {
      // 1) Inicializar SDK de Facebook
      await Facebook.initializeAsync({
        appId: "TU_FACEBOOK_APP_ID", // 👈 pon aquí tu App ID de Facebook
        appName: "Eventos Comunitarios", // opcional, solo para identificar la app
      });

      // 2) Abrir pantalla de login de Facebook
      const result = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile", "email"],
      });

      if (result.type === "success" && result.token) {
        // 3) Crear credencial de Facebook para Firebase
        const credential = FacebookAuthProvider.credential(result.token);

        // 4) Iniciar sesión en Firebase con esa credencial
        await signInWithCredential(auth, credential);

        // 5) Tu AuthContext (onAuthStateChanged) detecta la sesión y guarda el token
        // Aquí solo navegamos al home
        router.replace("/(tabs)");
      } else {
        console.log("Login de Facebook cancelado o fallido:", result.type);
      }
    } catch (e) {
      console.log("Error en login con Facebook:", e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Iniciar sesión</Text>
          <Text style={styles.subtitle}>
            Ingresa tus credenciales para continuar.
          </Text>
        </View>

        {/* Botón de Facebook REAL */}
        <TouchableOpacity style={styles.fbButton} onPress={handleFacebookLogin}>
          <Ionicons name="logo-facebook" size={20} color="#fff" />
          <Text style={styles.fbText}>Continuar con Facebook</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, isDisabled && styles.buttonDisabled]}
            disabled={isDisabled}
            onPress={handleLogin}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes cuenta?</Text>
          <TouchableOpacity onPress={goToRegister}>
            <Text style={styles.footerLink}>Regístrate aquí</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
  },

  // Facebook button
  fbButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1877F2",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  fbText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  // Divider
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: "#6B7280",
  },

  form: {
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    fontSize: 14,
    color: "#111827",
  },
  errorText: {
    marginTop: -8,
    fontSize: 12,
    color: "#B91C1C",
  },
  button: {
    marginTop: 4,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#A5C1FF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  footer: {
    marginTop: 32,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    color: "#6B7280",
  },
  footerLink: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
  },
});
