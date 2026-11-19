window.ZONES_SEED = [
  {
    "id": "Z1",
    "label": "Zona Norte (Recría)",
    "type": "macrozona",
    "children": ["Z1-A1"]
  },
  {
    "id": "Z1-A1",
    "label": "Sector Recría",
    "type": "microzona",
    "parent": "Z1"
  },
  {
    "id": "Z2",
    "label": "Zona Central (Producción)",
    "type": "macrozona",
    "children": ["Z2-B1"]
  },
  {
    "id": "Z2-B1",
    "label": "Galpones de Ponedoras",
    "type": "microzona",
    "parent": "Z2"
  },
  {
    "id": "Z3",
    "label": "Zona Sur (Almacenamiento)",
    "type": "macrozona",
    "children": ["Z3-A1"]
  },
  {
    "id": "Z3-A1",
    "label": "Silos Bolsa",
    "type": "microzona",
    "parent": "Z3"
  },
  {
    "id": "Z4",
    "label": "Zona Este (Expansión)",
    "type": "macrozona",
    "children": ["Z4-E1"]
  },
  {
    "id": "Z4-E1",
    "label": "Área Proyectada",
    "type": "microzona",
    "parent": "Z4"
  },
  {
    "id": "Z5",
    "label": "Zona Oeste (Servicios)",
    "type": "macrozona",
    "children": ["Z5-A1"]
  },
  {
    "id": "Z5-A1",
    "label": "Administración y Viviendas",
    "type": "microzona",
    "parent": "Z5"
  },
  {
    "id": "Z6",
    "label": "Z6 - Planta Industrial",
    "type": "macrozona",
    "children": ["Z6-C1", "Z6-C2", "Z6-C3"]
  },
  {
    "id": "Z6-C1",
    "label": "Z6-C1: Silos de Granos",
    "type": "microzona",
    "parent": "Z6"
  },
  {
    "id": "Z6-C2",
    "label": "Z6-C2: Nave de Procesamiento",
    "type": "microzona",
    "parent": "Z6"
  },
  {
    "id": "Z6-C3",
    "label": "Z6-C3: Área de Carga/Descarga",
    "type": "microzona",
    "parent": "Z6"
  }
];
