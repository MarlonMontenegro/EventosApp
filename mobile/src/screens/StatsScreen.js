// mobile/src/screens/StatsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";

import { fetchStatsOverview } from "../services/api";

export default function StatsScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchStatsOverview();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las estadísticas");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando estadísticas...</Text>
      </View>
    );
  }

  if (error || !stats) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || "Sin datos"}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Resumen de la plataforma</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Eventos totales</Text>
        <Text style={styles.value}>{stats.totalEvents}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Comentarios totales</Text>
        <Text style={styles.value}>{stats.totalComments}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Asistencias registradas</Text>
        <Text style={styles.value}>{stats.totalAttendees}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Usuarios únicos</Text>
        <Text style={styles.value}>{stats.uniqueUsers ?? "N/D"}</Text>
      </View>

      {stats.averageRatingGlobal != null && (
        <View style={styles.card}>
          <Text style={styles.label}>Rating global promedio</Text>
          <Text style={styles.value}>
            ⭐ {stats.averageRatingGlobal.toFixed(2)}
          </Text>
        </View>
      )}

      {/* Puedes seguir mostrando topCreators, eventsByMonthLastYear, etc. */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f3f3f3",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: "#555",
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },
  error: {
    color: "red",
  },
});
