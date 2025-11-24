import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: isDark ? "#38bdf8" : "#0284c7",
        tabBarInactiveTintColor: isDark ? "#94a3b8" : "#9ca3af",
        tabBarStyle: {
          backgroundColor: isDark ? "#020617" : "#ffffff",
          borderTopWidth: 0.5,
          borderTopColor: isDark ? "#1e293b" : "#e5e7eb",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "calendar";

          if (route.name === "index") {
            iconName = "calendar";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Eventos",
        }}
      />
    </Tabs>
  );
}
