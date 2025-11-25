// GET /api/censistas?dni=...&nombre=...
app.get("/api/censistas", async (req, res) => {
  try {
    await ensureCache();

    const dni = (req.query.dni || "").toString().trim();
    const nombre = (req.query.nombre || "").toString().trim().toLowerCase();

    let resultados = cachedUsuarios;

    if (dni) {
      resultados = resultados.filter((u) =>
        (u.dni || "").toString().includes(dni)
      );
    }

    if (nombre) {
      const tokens = nombre
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

      resultados = resultados.filter((u) => {
        const full = (u.nomb_ape || "").toLowerCase();
        return tokens.every((token) => full.includes(token));
      });
    }

    res.json({
      ok: true,
      count: resultados.length,
      data: resultados,
    });
  } catch (err) {
    console.error("Error en /api/censistas:", err);
    res.status(500).json({
      ok: false,
      message: "Error en el servidor intermedio",
    });
  }
});
