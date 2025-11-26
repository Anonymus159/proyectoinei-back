// server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

// 1) Cargar el JSON una sola vez al iniciar el servidor
const filePath = path.join(__dirname, "data", "fullDB.json");
let allUsuarios = [];

try {
  const raw = fs.readFileSync(filePath, "utf8");
  const json = JSON.parse(raw);
  allUsuarios = json?.data?.usuarios ?? [];
  console.log("Usuarios cargados desde fullDB.json:", allUsuarios.length);
} catch (err) {
  console.error("Error cargando fullDB.json al iniciar:", err);
}

// Ruta raíz para probar
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Backend INEI local funcionando 😎" });
});

// 2) Ruta /api/censistas con filtros por query ?dni=&nombre=
app.get("/api/censistas", (req, res) => {
  try {
    const { dni, nombre } = req.query;

    let filtrados = allUsuarios;

    // Filtro por DNI (coincidencia parcial)
    if (dni && typeof dni === "string" && dni.trim() !== "") {
      const dniTerm = dni.trim();
      filtrados = filtrados.filter(
        (u) => u.dni && u.dni.includes(dniTerm)
      );
    }

    // Filtro por nombre/apellidos (todas las palabras deben aparecer)
    if (nombre && typeof nombre === "string" && nombre.trim() !== "") {
      const terms = nombre
        .trim()
        .toUpperCase()
        .split(/\s+/)
        .filter((t) => t.length > 0);

      filtrados = filtrados.filter((u) => {
        const haystack = (u.nomb_ape || "").toUpperCase();
        return terms.every((t) => haystack.includes(t));
      });
    }

    // (Opcional) limitar máximo resultados para no matar al front
    const maxResultados = 300;
    const resultados = filtrados.slice(0, maxResultados);

    res.json({
      ok: true,
      count: resultados.length,
      data: resultados,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al procesar la búsqueda",
      error: String(error),
    });
  }
});

// Puerto para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor escuchando en el puerto", PORT);
});
