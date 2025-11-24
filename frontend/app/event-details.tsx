import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { auth } from "../src/firebase/firebaseConfig";
import { apiRequest } from "../src/api/apiClient";

type FirestoreDate = {
  _seconds?: number;
  _nanoseconds?: number;
  seconds?: number;
  nanoseconds?: number;
};

function toJsDate(dateField: FirestoreDate | Date): Date {
  if (!dateField) return new Date();
  if (dateField instanceof Date) return dateField;

  const seconds = dateField._seconds ?? dateField.seconds ?? 0;
  return new Date(seconds * 1000);
}

export default function EventDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // id del evento

  const [event, setEvent] = useState<any>(null);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [attending, setAttending] = useState(false);

  const currentUser = auth.currentUser;

  async function fetchData() {
    try {
      setLoading(true);

      // 1) Traer el evento
      const eventRes = await apiRequest(`/events/${id}`);
      // 2) Traer asistentes
      const attRes = await apiRequest(`/attendees/${id}`);

      setEvent(eventRes.event);
      setAttendees(attRes.attendees || []);

      const isUserAttending = (attRes.attendees || []).some(
        (a: any) => a.userId === currentUser?.uid
      );
      setAttending(isUserAttending);
    } catch (error) {
      console.log("Error cargando detalles:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [id]);

  async function handleAttend() {
    try {
      await apiRequest(`/attendees/${id}/attend`, {
        method: "POST",
        body: JSON.stringify({ userId: currentUser?.uid }),
      });
      fetchData();
    } catch (e: any) {
      Alert.alert("Error", e.message || "No se pudo registrar tu asistencia");
    }
  }

  async function handleCancelAttend() {
    try {
      await apiRequest(`/attendees/${id}/cancel`, {
        method: "POST",
        body: JSON.stringify({ userId: currentUser?.uid }),
      });
      fetchData();
    } catch (e: any) {
      Alert.alert("Error", e.message || "No se pudo cancelar tu asistencia");
    }
  }

  async function handleDelete() {
    Alert.alert(
      "Eliminar evento",
      "¿Estás seguro de que deseas eliminar este evento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await apiRequest(`/events/${id}`, { method: "DELETE" });
              router.back();
            } catch (e: any) {
              Alert.alert("Error", e.message || "No se pudo eliminar");
            }
          },
        },
      ]
    );
  }

  if (loading || !event) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  const eventDate = toJsDate(event.date as any);
  const isMyEvent =
    event.createdBy === currentUser?.email ||
    event.createdBy === currentUser?.uid;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Botón atrás */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backBtnText}>← Regresar</Text>
      </TouchableOpacity>

      {/* Info principal */}
      <Text style={styles.title}>{event.title}</Text>

      <Text style={styles.date}>
        {eventDate.toLocaleDateString("es-SV", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Text>

      <Text style={styles.sectionTitle}>Lugar</Text>
      <Text style={styles.location}>{event.location}</Text>

      <Text style={styles.sectionTitle}>Descripción</Text>
      <Text style={styles.description}>{event.description}</Text>

      {/* Asistentes */}
      <View style={{ marginTop: 24 }}>
        <Text style={styles.sectionTitle}>Asistentes ({attendees.length})</Text>

        {attendees.length === 0 ? (
          <Text style={styles.noAttendees}>Aún no hay asistentes.</Text>
        ) : (
          attendees.map((a, index) => (
            <Text key={index} style={styles.attendeeItem}>
              • {a.email || a.userId}
            </Text>
          ))
        )}
      </View>

      {/* Acciones según propietario */}
      <View style={{ marginTop: 32 }}>
        {isMyEvent ? (
          <>
            <Text style={styles.creatorText}>
              Este evento fue creado por ti.
            </Text>
            <TouchableOpacity
              style={[styles.btn, styles.deleteBtn]}
              onPress={handleDelete}
            >
              <Text style={styles.btnText}>Eliminar evento</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {attending ? (
              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn]}
                onPress={handleCancelAttend}
              >
                <Text style={styles.btnText}>Cancelar asistencia</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.btn, styles.attendBtn]}
                onPress={handleAttend}
              >
                <Text style={styles.btnText}>Asistir a este evento</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F3F4F6" },
  container: { padding: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  backBtn: {
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  backBtnText: { fontSize: 14, color: "#374151" },

  title: { fontSize: 22, fontWeight: "700", color: "#111827", marginBottom: 4 },
  date: { fontSize: 14, color: "#6B7280", marginBottom: 16 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 4,
    color: "#111827",
  },
  description: { fontSize: 14, color: "#374151" },
  location: { fontSize: 14, color: "#374151" },

  noAttendees: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  attendeeItem: { fontSize: 14, color: "#111827", marginVertical: 2 },

  creatorText: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 10,
    fontWeight: "500",
  },

  btn: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  attendBtn: { backgroundColor: "#2563EB" },
  cancelBtn: { backgroundColor: "#F59E0B" },
  deleteBtn: { backgroundColor: "#DC2626" },
  btnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
});
