import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { fetchStatsOverview } from "../src/api/apiStats";

interface StatsOverview {
  totalEvents: number;
  totalComments: number;
  userEvents: number;

  totalAttendees?: number;
  uniqueUsers?: number;
  averageRatingGlobal?: number;
}

export default function StatsScreen() {
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setError(null);
      setLoading(true);

      const res = await fetchStatsOverview();
      console.log("🟢 Respuesta /stats:", res);

      if (!res || res.success === false) {
        setError(res?.error || "Error obteniendo estadísticas");
        setStats(null);
        return;
      }

      setStats(res.stats);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las estadísticas");
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
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
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 🔙 BOTÓN DE REGRESAR */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Regresar</Text>
        </TouchableOpacity>

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
          <Text style={styles.label}>Tus eventos creados</Text>
          <Text style={styles.value}>{stats.userEvents}</Text>
        </View>

        {stats.totalAttendees != null && (
          <View style={styles.card}>
            <Text style={styles.label}>Asistencias registradas</Text>
            <Text style={styles.value}>{stats.totalAttendees}</Text>
          </View>
        )}

        {stats.uniqueUsers != null && (
          <View style={styles.card}>
            <Text style={styles.label}>Usuarios únicos</Text>
            <Text style={styles.value}>{stats.uniqueUsers}</Text>
          </View>
        )}

        {stats.averageRatingGlobal != null && (
          <View style={styles.card}>
            <Text style={styles.label}>Rating global promedio</Text>
            <Text style={styles.value}>
              ⭐ {stats.averageRatingGlobal.toFixed(2)}
            </Text>
          </View>
        )}
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
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  backButton: {
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#2563EB",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
