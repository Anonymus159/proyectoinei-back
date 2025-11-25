// server.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // 👈 habilita CORS para cualquier origen

const INEI_URL = "https://apiasistentevirtual.inei.gob.pe/api/general/fullDB";

app.get("/api/censistas", async (req, res) => {
  try {
    const resp = await fetch(INEI_URL); // Node 18+ ya tiene fetch
    const json = await resp.json();

    // La API del INEI trae algo así:
    // { ok, msg, data: { usuarios: [...] } }
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
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor escuchando en el puerto", PORT);
});
