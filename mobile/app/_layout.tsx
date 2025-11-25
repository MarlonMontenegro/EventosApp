// mobile/app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ title: "Resumen" }}
      />
      <Tabs.Screen
        name="explore"
        options={{ title: "Explorar" }}
      />
    </Tabs>
  );
}
