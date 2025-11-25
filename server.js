// server.js
const express = require("express");
const cors = require("cors");

const app = express();

// 👇 Permitir peticiones desde tu front (localhost, Netlify, etc.)
app.use(cors());

// URL oficial del INEI
const INEI_URL = "https://apiasistentevirtual.inei.gob.pe/api/general/fullDB";

// Ruta de prueba opcional
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Backend INEI funcionando 😎" });
});

// Ruta que usa tu front: /api/censistas
app.get("/api/censistas", async (req, res) => {
  try {
    // Llamamos a la API del INEI
    const resp = await fetch(INEI_URL); // Node 18+ ya trae fetch nativo
    const json = await resp.json();

    // La API viene algo así: { ok, msg, data: { usuarios: [...] } }
    const usuarios = json?.data?.usuarios ?? [];

    // Respondemos en el formato que tu front espera
    res.json({
      ok: true,
      msg: "Listado de censistas",
      data: {
        usuarios,
      },
    });
  } catch (error) {
    console.error("Error al obtener censistas:", error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener los datos de censistas",
    });
  }
});

// Puerto para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor escuchando en el puerto", PORT);
});
