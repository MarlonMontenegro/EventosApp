import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { fetchComments } from "../src/api/apiStats"; // AJUSTA ESTA RUTA

// ⚠️ Cambiá este ID por el que venga por navegación cuando unamos las pantallas
const TEST_EVENT_ID = "8sSzIfJm2Mo3TyDBKlux";

interface CommentItem {
  id: string;
  userId?: string;
  text: string;
  rating?: number;
}

export default function CommentsScreen() {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadComments = async () => {
    try {
      const data = await fetchComments(TEST_EVENT_ID);
      setComments(data || []);
    } catch (e) {
      console.error(e);
      setError("No se pudieron cargar los comentarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando comentarios...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (comments.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No hay comentarios para este evento.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comentarios del evento</Text>

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentCard}>
            <Text style={styles.user}>{item.userId ?? "Usuario"}</Text>
            <Text style={styles.text}>{item.text}</Text>

            {item.rating !== undefined && (
              <Text style={styles.rating}>⭐ {item.rating}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  commentCard: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#f3f3f3",
  },
  user: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  text: {
    marginBottom: 4,
  },
  rating: {
    color: "#e0a800",
    fontWeight: "bold",
  },
  error: {
    color: "red",
  },
});
