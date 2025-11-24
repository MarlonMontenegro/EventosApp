import React, { useContext } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider, AuthContext } from "../src/context/authContext";

export const unstable_settings = {
  anchor: "(tabs)",
};

function AuthStack() {
  // 👇 forzamos a any porque el contexto viene de un archivo JS
  const auth: any = useContext(AuthContext as any);

  const userToken = auth?.userToken;
  const loading = auth?.loading;

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {userToken ? (
        // Usuario logueado: muestra las tabs
        <Stack.Screen name="(tabs)" />
      ) : (
        // Sin sesión: muestra login y registro
        <>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthStack />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
