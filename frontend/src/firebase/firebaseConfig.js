// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDrNW_tFsL0uYTvx1qyiLp1LOcdzJFgKs0",
  authDomain: "eventos-comunitarios-c94d9.firebaseapp.com",
  projectId: "eventos-comunitarios-c94d9",
  storageBucket: "eventos-comunitarios-c94d9.firebasestorage.app",
  messagingSenderId: "238782845718",
  appId: "1:238782845718:web:128b3a95b7bb1149cbb637",
};

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);

// Auth universal (funciona en web y en móvil)
export const auth = getAuth(app);
