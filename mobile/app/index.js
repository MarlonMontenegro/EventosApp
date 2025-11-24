// mobile/app/index.js
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";


export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 22 }}>Bienvenido Miguel 👋</Text>
    </View>
  );
}