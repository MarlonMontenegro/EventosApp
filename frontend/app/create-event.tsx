import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createEventApi } from "../src/api/eventApi";
import { auth } from "../src/firebase/firebaseConfig";
import { EVENT_TYPES } from "../constants/eventCategories";

type EventTypesObject = typeof EVENT_TYPES;
type EventTypeKey = keyof EventTypesObject;

export default function CreateEventScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<EventTypeKey | "">("");
  const [subtype, setSubtype] = useState<string>("");
  const [location, setLocation] = useState("");

  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convertimos el objeto EVENT_TYPES en un array de opciones
  const eventTypeOptions = Object.entries(EVENT_TYPES).map(([key, value]) => ({
    key: key as EventTypeKey,
    label: value.label,
  }));

  // Subtipos según el tipo seleccionado
  const currentSubtypes =
    type && EVENT_TYPES[type] ? EVENT_TYPES[type].subtypes : [];

  const formattedDate = date.toLocaleDateString("es-SV", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (!selectedDate) {
      setShowDatePicker(false);
      return;
    }
    setShowDatePicker(false);
    setDate(selectedDate);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = auth.currentUser;
      if (!user) {
        setError("No hay usuario autenticado.");
        setLoading(false);
        return;
      }

      // Fijamos hora 09:00 a la fecha seleccionada
      const eventDate = new Date(date);
      eventDate.setHours(9, 0, 0, 0);

      await createEventApi({
        title: title.trim(),
        description: description.trim(),
        type: type || "", // clave: 'feria', 'donacion', etc.
        subtype: subtype,
        date: eventDate.toISOString(),
        location: location.trim(),
        createdBy: user.email || user.uid,
      });

      router.back();
    } catch (e: any) {
      console.log("Error creando evento:", e);
      setError(e.message || "Error creando evento");
    } finally {
      setLoading(false);
    }
  };

  const canSave =
    title.trim() !== "" &&
    description.trim() !== "" &&
    type !== "" &&
    subtype.trim() !== "" &&
    location.trim() !== "" &&
    !loading;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* 🔙 Botón para ir atrás */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Regresar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Crear nuevo evento</Text>
      <Text style={styles.subtitle}>
        Completa los datos para registrar un nuevo evento comunitario.
      </Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* TÍTULO */}
      <View style={styles.field}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          placeholder="Feria Gastronómica"
          placeholderTextColor="#9CA3AF"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* DESCRIPCIÓN */}
      <View style={styles.field}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Comida típica, actividades, etc."
          placeholderTextColor="#9CA3AF"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      {/* TIPO (usa EVENT_TYPES del constants) */}
      <View style={styles.field}>
        <Text style={styles.label}>Tipo</Text>
        <View style={styles.dropdown}>
          {eventTypeOptions.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.dropdownItem,
                type === opt.key && styles.dropdownItemActive,
              ]}
              onPress={() => {
                setType(opt.key);
                setSubtype(""); // reset subtipo al cambiar tipo
              }}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  type === opt.key && styles.dropdownItemTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* SUBTIPO dinámico según tipo */}
      <View style={styles.field}>
        <Text style={styles.label}>Subtipo</Text>
        {currentSubtypes.length === 0 ? (
          <Text style={styles.helperText}>
            Selecciona primero un tipo para ver los subtipos.
          </Text>
        ) : (
          <View style={styles.dropdown}>
            {currentSubtypes.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.dropdownItem,
                  subtype === opt.value && styles.dropdownItemActive,
                ]}
                onPress={() => setSubtype(opt.value)}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    subtype === opt.value && styles.dropdownItemTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* FECHA */}
      <View style={styles.field}>
        <Text style={styles.label}>Fecha del evento</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>{formattedDate}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
          />
        )}
      </View>

      {/* LUGAR */}
      <View style={styles.field}>
        <Text style={styles.label}>Lugar</Text>
        <TextInput
          style={styles.input}
          placeholder="Plaza central, casa comunal..."
          placeholderTextColor="#9CA3AF"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      {/* BOTÓN GUARDAR */}
      <TouchableOpacity
        style={[styles.button, !canSave && styles.buttonDisabled]}
        disabled={!canSave}
        onPress={handleSave}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Guardar evento</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 8,
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },
  backButtonText: {
    fontSize: 14,
    color: "#374151",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },
  errorText: {
    color: "#B91C1C",
    marginBottom: 8,
    fontSize: 13,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  helperText: {
    fontSize: 12,
    color: "#6B7280",
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    fontSize: 14,
    color: "#111827",
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  dropdown: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  dropdownItemActive: {
    backgroundColor: "#DBEAFE",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#111827",
  },
  dropdownItemTextActive: {
    fontWeight: "600",
    color: "#1D4ED8",
  },
  dateButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  dateButtonText: {
    fontSize: 14,
    color: "#111827",
  },
  button: {
    marginTop: 10,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#93C5FD",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
