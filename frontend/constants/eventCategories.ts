export const EVENT_TYPES = {
  feria: {
    label: "Feria",
    subtypes: [
      { value: "feria_gastronomica", label: "Feria Gastronómica" },
      { value: "feria_artesanal", label: "Feria Artesanal" },
      { value: "feria_agricola", label: "Feria Agrícola" },
    ],
  },

  donacion: {
    label: "Donación",
    subtypes: [
      { value: "donacion_viveres", label: "Donación de Víveres" },
      { value: "donacion_ropa", label: "Donación de Ropa" },
      { value: "donacion_juguetes", label: "Donación de Juguetes" },
    ],
  },

  limpieza: {
    label: "Limpieza",
    subtypes: [
      { value: "limpieza_parque", label: "Limpieza de Parque" },
      { value: "limpieza_playa", label: "Limpieza de Playa" },
      { value: "limpieza_calle", label: "Limpieza de Calles" },
    ],
  },

  taller: {
    label: "Taller / Capacitación",
    subtypes: [
      { value: "taller_reciclaje", label: "Taller de Reciclaje" },
      { value: "taller_costura", label: "Taller de Costura" },
      { value: "taller_primera_auxilio", label: "Primeros Auxilios" },
    ],
  },
};
