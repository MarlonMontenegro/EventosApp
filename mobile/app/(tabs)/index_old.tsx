// mobile/app/(tabs)/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

const API_BASE = "http://192.168.1.17:3000"; // IP de tu PC + puerto del backend

type OverviewResponse = {
  totalEvents: number;
  totalComments: number;
  totalAttendees: number;
  uniqueUsers: number;
  averageRatingGlobal: number | null;
  topCreators: { userId: string; eventsCreated: number }[];
  topAttendees: { userId: string; eventsAttended: number }[];
  mostCommentedEvent?: { eventId: string; commentsCount: number } | null;
  eventsByMonthLastYear: { month: string; count: number }[];
  upcomingEventsNext7Days: any[];
};

export default function StatsScreen() {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/stats/overview`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las estadísticas");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.helper}>Cargando estadísticas...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error ?? "Error desconocido"}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Resumen general</Text>

      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.label}>Eventos totales</Text>
          <Text style={styles.value}>{data.totalEvents}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Comentarios</Text>
          <Text style={styles.value}>{data.totalComments}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.label}>Asistencias</Text>
          <Text style={styles.value}>{data.totalAttendees}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Usuarios únicos</Text>
          <Text style={styles.value}>{data.uniqueUsers}</Text>
        </View>
      </View>

      <View style={styles.cardFull}>
        <Text style={styles.label}>Rating global</Text>
        <Text style={styles.value}>
          {data.averageRatingGlobal != null
            ? data.averageRatingGlobal.toFixed(1)
            : "Sin datos"}
        </Text>
      </View>

      <View style={styles.cardFull}>
        <Text style={styles.sectionTitle}>Top creadores</Text>
        {data.topCreators && data.topCreators.length > 0 ? (
          data.topCreators.map((c, idx) => (
            <Text key={c.userId} style={styles.itemText}>
              {idx + 1}. {c.userId} — {c.eventsCreated} eventos
            </Text>
          ))
        ) : (
          <Text style={styles.helper}>Aún no hay datos de creadores.</Text>
        )}
      </View>

      <View style={styles.cardFull}>
        <Text style={styles.sectionTitle}>Top asistentes</Text>
        {data.topAttendees && data.topAttendees.length > 0 ? (
          data.topAttendees.map((a, idx) => (
            <Text key={a.userId} style={styles.itemText}>
              {idx + 1}. {a.userId} — {a.eventsAttended} asistencias
            </Text>
          ))
        ) : (
          <Text style={styles.helper}>Aún no hay datos de asistentes.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16,
  },
  center: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 12,
  },
  cardFull: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  label: {
    color: "#9ca3af",
    fontSize: 13,
    marginBottom: 4,
  },
  value: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  itemText: {
    color: "#e5e7eb",
    fontSize: 14,
    marginBottom: 4,
  },
  helper: {
    color: "#9ca3af",
    marginTop: 8,
  },
  error: {
    color: "#fecaca",
    fontSize: 16,
  },
});
