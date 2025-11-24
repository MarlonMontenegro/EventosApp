import React, { useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { AuthContext } from "../../src/context/authContext";

const mockEvents = [
  {
    id: "1",
    title: "Jornada de limpieza en el parque central",
    date: "Sábado 30 noviembre · 9:00 AM",
    location: "Parque Central",
    status: "Abierto",
  },
  {
    id: "2",
    title: "Campaña de donación de víveres",
    date: "Domingo 8 diciembre · 2:00 PM",
    location: "Casa comunal",
    status: "Abierto",
  },
  {
    id: "3",
    title: "Taller de reciclaje creativo",
    date: "Miércoles 11 diciembre · 4:00 PM",
    location: "Salón multiusos",
    status: "Cerrado",
  },
];

export default function HomeScreen() {
  const auth: any = useContext(AuthContext as any);

  const handleLogout = async () => {
    try {
      // 1) cerrar sesión en Firebase + limpiar contexto
      await auth?.logout?.();

      // 2) forzar navegación al login
      router.replace("/login");
    } catch (e) {
      console.log("Error al cerrar sesión:", e);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header + logout */}
        <View className="header-row" style={styles.headerRow}>
          <View style={{ flex: 1, paddingRight: 16 }}>
            <Text style={styles.appTitle}>Eventos comunitarios</Text>
            <Text style={styles.subtitle}>
              Gestiona y revisa los eventos de tu comunidad.
            </Text>
          </View>

          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Botón Crear evento */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            // aquí luego puedes navegar a /create-event
          }}
        >
          <Text style={styles.primaryButtonText}>Crear nuevo evento</Text>
        </TouchableOpacity>

        {/* Sección Próximos eventos */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximos eventos</Text>
          <Text style={styles.sectionCount}>{mockEvents.length} activos</Text>
        </View>

        <View style={styles.eventsList}>
          {mockEvents.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <Text style={styles.eventDate}>{event.date}</Text>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventLocation}>{event.location}</Text>
              <View style={styles.eventFooter}>
                <View
                  style={[
                    styles.statusBadge,
                    event.status === "Abierto"
                      ? styles.statusOpen
                      : styles.statusClosed,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      event.status === "Abierto"
                        ? styles.statusTextOpen
                        : styles.statusTextClosed,
                    ]}
                  >
                    {event.status}
                  </Text>
                </View>
                <Text style={styles.eventLink}>Ver detalles</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
    gap: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
  },
  logoutText: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "600",
  },
  primaryButton: {
    marginTop: 8,
    height: 48,
    borderRadius: 999,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: Platform.OS === "ios" ? 0.2 : 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  sectionHeader: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  sectionCount: {
    fontSize: 12,
    color: "#6B7280",
  },
  eventsList: {
    marginTop: 12,
    gap: 12,
  },
  eventCard: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 6,
  },
  eventDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  eventLocation: {
    fontSize: 13,
    color: "#4B5563",
  },
  eventFooter: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusOpen: {
    backgroundColor: "#DCFCE7",
  },
  statusClosed: {
    backgroundColor: "#FEE2E2",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  statusTextOpen: {
    color: "#15803D",
  },
  statusTextClosed: {
    color: "#B91C1C",
  },
  eventLink: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
  },
});
