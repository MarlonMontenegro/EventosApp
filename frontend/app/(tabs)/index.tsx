import React, { useContext, useEffect, useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { AuthContext } from "../../src/context/authContext";
import { fetchEvents } from "../../src/api/eventApi";
import { auth as firebaseAuth } from "../../src/firebase/firebaseConfig";

interface EventItem {
  id: string;
  title: string;
  description?: string;
  date: any;
  location?: string;
  type?: string;
  subtype?: string;
  createdBy?: string; // aquí va el email que mandas en createdBy
}

export default function HomeScreen() {
  const auth: any = useContext(AuthContext as any);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUserEmail = firebaseAuth.currentUser?.email || "";

  const handleLogout = async () => {
    try {
      await auth?.logout?.();
      router.replace("/login");
    } catch (e) {
      console.log("Error al cerrar sesión:", e);
    }
  };

  const loadEvents = async () => {
    try {
      setError(null);
      setLoading(true);
      console.log("🔵 Cargando eventos desde backend...");
      const res = await fetchEvents();
      console.log("🟢 Respuesta /events:", JSON.stringify(res));
      setEvents(res.events || []);
    } catch (e: any) {
      console.log("Error en fetchEvents:", e);
      setError(e.message || "Error cargando eventos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };

  const toDate = (value: any): Date => {
    if (!value) return new Date(NaN);

    // Firestore Timestamp serializado (_seconds o seconds)
    if (typeof value === "object" && (value._seconds || value.seconds)) {
      const seconds = value._seconds ?? value.seconds;
      return new Date(seconds * 1000);
    }

    return new Date(value);
  };

  const formatDate = (value: any) => {
    const d = toDate(value);
    if (isNaN(d.getTime())) return "Fecha no válida";

    return d.toLocaleString("es-SV", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatus = (value: any) => {
    const d = toDate(value);
    if (isNaN(d.getTime())) return "Desconocido";

    const now = new Date();
    return d >= now ? "Abierto" : "Cerrado";
  };

  // 🔹 Separar eventos futuros y "tus" eventos
  const { futureEvents, myFutureEvents } = useMemo(() => {
    const now = new Date();

    const future = events.filter((ev) => {
      const d = toDate(ev.date);
      return !isNaN(d.getTime()) && d >= now;
    });

    const mine = future.filter(
      (ev) =>
        ev.createdBy &&
        currentUserEmail &&
        ev.createdBy.toLowerCase() === currentUserEmail.toLowerCase()
    );

    return {
      futureEvents: future,
      myFutureEvents: mine,
    };
  }, [events, currentUserEmail]);

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Cargando eventos...</Text>
      </View>
    );
  }

  const renderEventCard = (event: EventItem) => {
    const status = getStatus(event.date);
    const isOpen = status === "Abierto";

    return (
      <View key={event.id} style={styles.eventCard}>
        <Text style={styles.eventDate}>{formatDate(event.date)}</Text>
        <Text style={styles.eventTitle}>{event.title}</Text>

        {event.location ? (
          <Text style={styles.eventLocation}>{event.location}</Text>
        ) : null}

        {event.createdBy && (
          <Text style={styles.eventCreator}>Creado por: {event.createdBy}</Text>
        )}

        {event.type ? (
          <Text style={styles.eventType}>
            {event.type}
            {event.subtype ? ` · ${event.subtype}` : ""}
          </Text>
        ) : null}

        <View style={styles.eventFooter}>
          <View
            style={[
              styles.statusBadge,
              isOpen ? styles.statusOpen : styles.statusClosed,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isOpen ? styles.statusTextOpen : styles.statusTextClosed,
              ]}
            >
              {status}
            </Text>
          </View>

          {/* 👇 Aquí activamos la navegación al detalle */}
          <TouchableOpacity
            onPress={() => router.push(`/event-details?id=${event.id}`)}
          >
            <Text style={styles.eventLink}>Ver detalles</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header + logout */}
        <View style={styles.headerRow}>
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
          onPress={() => router.push("/create-event")}
        >
          <Text style={styles.primaryButtonText}>Crear nuevo evento</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* 🔹 Sección: Tus próximos eventos */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tus próximos eventos</Text>
          <Text style={styles.sectionCount}>{myFutureEvents.length}</Text>
        </View>

        <View style={styles.eventsList}>
          {myFutureEvents.length === 0 ? (
            <Text style={styles.emptyText}>
              No tienes eventos próximos creados por ti.
            </Text>
          ) : (
            myFutureEvents.map(renderEventCard)
          )}
        </View>

        {/* 🔹 Sección: Próximos eventos (todos) */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Próximos eventos</Text>
          <Text style={styles.sectionCount}>{futureEvents.length}</Text>
        </View>

        <View style={styles.eventsList}>
          {futureEvents.length === 0 ? (
            <Text style={styles.emptyText}>
              Aún no hay eventos próximos registrados.
            </Text>
          ) : (
            futureEvents.map(renderEventCard)
          )}
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
  loadingScreen: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#4B5563",
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
  errorText: {
    marginTop: 8,
    fontSize: 13,
    color: "#B91C1C",
  },
  emptyText: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
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
  eventCreator: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  eventType: {
    fontSize: 12,
    color: "#6B7280",
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
