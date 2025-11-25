// server.js

// 1. Imports
const express = require("express");
const cors = require("cors");

// 2. Crear app
const app = express();

// 3. Middlewares
app.use(cors());

// 4. Constante con la URL del INEI
const INEI_URL = "https://apiasistentevirtual.inei.gob.pe/api/general/fullDB";

// 5. Ruta raíz (solo para probar que el back vive)
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Backend INEI funcionando 😎" });
});

// 6. Ruta principal que usa tu front
app.get("/api/censistas", async (req, res) => {
  try {
    console.log("Llamando a INEI_URL:", INEI_URL);

    const resp = await fetch(INEI_URL); // Node 18+ ya trae fetch global

    if (!resp.ok) {
      const text = await resp.text();
      console.error("Error al llamar a INEI:", resp.status, text.slice(0, 300));
      return res.status(500).json({
        ok: false,
        msg: "Error al llamar a la API INEI",
        status: resp.status,
        bodyPreview: text.slice(0, 300),
      });
    }

    const json = await resp.json();

    const usuarios = json?.data?.usuarios ?? [];

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
      error: String(error),
    });
  }
});

// 7. Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor escuchando en el puerto", PORT);
});
