// mobile/src/screens/CommentsScreen.js
import React, { useEffect, useState } from "react";
import {  View,  Text,  FlatList,  ActivityIndicator,  StyleSheet,} from "react-native";

import { fetchComments } from "../services/api";

const EVENT_ID_DE_PRUEBA = "8sSzIfJm2Mo3TyDBKlux"; 
// 👆 usa el ID que probaste en Thunder Client

export default function CommentsScreen() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchComments(EVENT_ID_DE_PRUEBA);
        setComments(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los comentarios");
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

  if (!comments.length) {
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
            <Text style={styles.user}>{item.userId || "Usuario"}</Text>
            <Text style={styles.text}>{item.text}</Text>
            {item.rating != null && (
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
