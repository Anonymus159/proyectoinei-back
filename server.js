// server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

// Ruta raíz para probar
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Backend INEI local funcionando 😎" });
});

// Ruta /api/censistas leyendo fullDB.json local
app.get("/api/censistas", (req, res) => {
  try {
    const filePath = path.join(__dirname, "data", "fullDB.json");

    const raw = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(raw);

    // La API original tiene: data.usuarios
    const usuarios = json?.data?.usuarios ?? [];

    res.json({
      ok: true,
      msg: "Listado de censistas desde archivo local",
      data: {
        usuarios,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al leer el archivo local",
      error: String(error),
    });
  }
});

// Puerto para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor escuchando en el puerto", PORT);
});
