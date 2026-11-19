window.ANNOTATIONS_SEED = [
  {
    "id": "ann-recria-original",
    "requestText": "Galpón de recría original (Norte)",
    "labelText": "Galpón Recría (Original)",
    "style": "style-2",
    "nodePosition": { "x": 0.28, "y": 0.10 },
    "scope": { "level": "microzona", "zoneId": "Z1", "subzoneId": "Z1-A1" },
    "action": { "type": "audit", "status": "active" },
    "connectors": [
      { "id": "c-rec-1", "anchorId": "anchor-galpon-recria-1" }
    ]
  },
  {
    "id": "ann-ponedoras-cluster",
    "requestText": "4 galpones de ponedoras + Cintas transportadoras",
    "labelText": "Galpones Ponedoras (×4)",
    "style": "style-2",
    "nodePosition": { "x": 0.05, "y": 0.30 },
    "scope": { "level": "macrozona", "zoneId": "Z2", "subzoneId": "Z2-B1" },
    "action": { "type": "production", "status": "active" },
    "connectors": [
      { "id": "c-g1", "anchorId": "anchor-g1" },
      { "id": "c-g2", "anchorId": "anchor-g2" },
      { "id": "c-g3", "anchorId": "anchor-g3" },
      { "id": "c-g4", "anchorId": "anchor-g4" }
    ]
  },
  {
    "id": "ann-clasificadora-taller",
    "requestText": "Planta clasificadora de huevos y Taller de mantenimiento",
    "labelText": "Clasificadora & Taller",
    "style": "style-2",
    "nodePosition": { "x": 0.30, "y": 0.58 },
    "scope": { "level": "microzona", "zoneId": "Z2", "subzoneId": null },
    "action": { "type": "audit", "status": "ready" },
    "connectors": [
      { "id": "c-clas-1", "anchorId": "anchor-clasificadora" },
      { "id": "c-tall-1", "anchorId": "anchor-taller" }
    ]
  },
  {
    "id": "ann-administracion-logistica",
    "requestText": "Oficinas, Balanza de camiones y Accesos",
    "labelText": "Administración & Logística",
    "style": "style-2",
    "nodePosition": { "x": 0.03, "y": 0.45 },
    "scope": { "level": "microzona", "zoneId": "Z5", "subzoneId": null },
    "action": { "type": "inspect", "status": "active" },
    "connectors": [
      { "id": "c-ofic-1", "anchorId": "anchor-oficinas" },
      { "id": "c-bal-1", "anchorId": "anchor-balanza" },
      { "id": "c-des-1", "anchorId": "anchor-desinfeccion-camiones" }
    ]
  },
  {
    "id": "ann-viviendas-personal",
    "requestText": "Casa gerencia, deptos empleados y mantenimiento",
    "labelText": "Área Residencial Personal",
    "style": "style-2",
    "nodePosition": { "x": 0.03, "y": 0.65 },
    "scope": { "level": "microzona", "zoneId": "Z5", "subzoneId": null },
    "action": { "type": "inspect", "status": "ready" },
    "connectors": [
      { "id": "c-ger-1", "anchorId": "anchor-vivienda-gerencia" },
      { "id": "c-emp-1", "anchorId": "anchor-deptos-empleados" },
      { "id": "c-mant-1", "anchorId": "anchor-casa-mantenimiento" }
    ]
  },
  {
    "id": "ann-planta-alimento-complejo",
    "requestText": "Planta de alimento, Aceitera, Secadora y Silos de procesos",
    "labelText": "Complejo Industrial Silos & Planta",
    "style": "style-2",
    "nodePosition": { "x": 0.45, "y": 0.70 },
    "scope": { "level": "macrozona", "zoneId": "Z6", "subzoneId": null },
    "action": { "type": "audit", "status": "draft" },
    "connectors": [
      { "id": "c-pa", "anchorId": "anchor-planta-alimento" },
      { "id": "c-ace", "anchorId": "anchor-aceitera" },
      { "id": "c-sec", "anchorId": "anchor-secadora" },
      { "id": "c-s-sec1", "anchorId": "anchor-silo-seco-1" },
      { "id": "c-s-hum1", "anchorId": "anchor-silo-humedo-1" },
      { "id": "c-s-alm1", "anchorId": "anchor-silo-almacenamiento" }
    ]
  },
  {
    "id": "ann-sector-guano-obra",
    "requestText": "Depósito de guano y viviendas para personal de obra",
    "labelText": "Guano & Sector Obra",
    "style": "style-2",
    "nodePosition": { "x": 0.60, "y": 0.35 },
    "scope": { "level": "microzona", "zoneId": "Z7", "subzoneId": null },
    "action": { "type": "audit", "status": "draft" },
    "connectors": [
      { "id": "c-gua-1", "anchorId": "anchor-guano-sector" },
      { "id": "c-obr-1", "anchorId": "anchor-obra-vivienda-1" },
      { "id": "c-obr-2", "anchorId": "anchor-obra-vivienda-2" }
    ]
  },
  {
    "id": "ann-recria-expansion",
    "requestText": "2 galpones nuevos de recría (Zona Este)",
    "labelText": "Expansión Recría (×2)",
    "style": "style-2",
    "nodePosition": { "x": 0.85, "y": 0.18 },
    "scope": { "level": "microzona", "zoneId": "Z4", "subzoneId": "Z4-E1" },
    "action": { "type": "planning", "status": "in-progress" },
    "connectors": [
      { "id": "c-r2", "anchorId": "anchor-recria-2" },
      { "id": "c-r3", "anchorId": "anchor-recria-3" }
    ]
  },
  {
    "id": "ann-silos-bolsa-total",
    "requestText": "Zonas de almacenamiento en silos bolsa (Sector A y B)",
    "labelText": "Silos Bolsa — Acopio",
    "style": "style-2",
    "nodePosition": { "x": 0.80, "y": 0.60 },
    "scope": { "level": "macrozona", "zoneId": "Z3", "subzoneId": null },
    "action": { "type": "inventory", "status": "draft" },
    "connectors": [
      { "id": "c-sba-1", "anchorId": "anchor-sb-a1" },
      { "id": "c-sbb-1", "anchorId": "anchor-sb-b1" }
    ]
  }
];
