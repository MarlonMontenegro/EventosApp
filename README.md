# 📘 Eventos Comunitarios App – README

## 👥 Integrantes del Equipo

- **Miguel Eduardo Vallejos Linares – VL131638**
- **Alejandro Benjamín Rivera Ochoa – RO243154**
- **Mayron Steve Lopez Girón – LG243153**
- **Marlon Eduardo Montenegro Paz – MP243207**
- **Andrea Paola Montenegro Paz – MP101106**

---

## 📌 Descripción General del Proyecto

**Eventos Comunitarios App** es una aplicación móvil diseñada para facilitar la creación, organización y gestión de actividades comunitarias.  
Permite a cualquier usuario:

- Crear eventos con información detallada
- Consultar eventos futuros
- Confirmar o cancelar asistencia
- Visualizar quiénes asistirán
- Administrar sus propios eventos (incluye eliminación)

El proyecto fue desarrollado con un enfoque profesional, modular y seguro, integrando buenas prácticas en desarrollo mobile y backend moderno.

---

## 🛠️ Tecnologías Utilizadas

### **Frontend – Aplicación Móvil**

- React Native (Expo)
- Expo Router (navegación basada en archivos)
- TypeScript
- React Context API (manejo global de sesión)
- Firebase Authentication
- DateTimePicker & componentes nativos
- Fetch API + token Bearer para comunicación segura con el backend

### **Backend – API REST**

- Node.js + Express
- Firebase Admin SDK (verificación de tokens)
- Firestore (NoSQL)
- Middlewares de autenticación
- CORS
- Arquitectura modular con controladores y rutas separadas

---

## 🧱 Arquitectura del Sistema

### 🔹 **Aplicación móvil (frontend)**

Se conecta al backend mediante solicitudes HTTP protegidas con tokens de Firebase.

Pantallas principales:

- Login / Register
- Home
- Crear Evento
- Detalles del Evento

---

### 🔹 **Backend (API REST)**

- Endpoints protegidos mediante `authMiddleware`
- CRUD de eventos
- Gestión de asistentes como subcolección (`events/{id}/attendees/{userId}`)
- Respuestas formateadas para el frontend (timestamps, creador, etc.)

---

## 📂 Características Principales

### ✔️ Crear evento

Campos:

- Título
- Descripción
- Fecha y hora
- Lugar
- Tipo y subtipo
- Email del creador (automático desde Firebase)

---

### ✔️ Ver eventos próximos

- Vista general
- Vista “Tus eventos próximos”
- Ordenados por fecha

---

### ✔️ Ver detalles del evento

*Incluye:

- Título
- Fecha y lugar
- Descripción
- Creador
- Lista de asistentes

*Acciones:

- Asistir
- Cancelar asistencia
- Eliminar evento _(solo si eres el creador)_

---
