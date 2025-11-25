// server.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000; // Render te da un puerto en process.env.PORT

app.use(cors());
app.use(express.json());

// tu ruta:
app.get("/api/censistas", async (req, res) => {
  try {
    // acá haces el fetch al JSON del INEI, etc
    res.json({ ok: true, msg: "Funciona 😎" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error en el servidor" });
  }
});

// importante: arrancar el server
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
