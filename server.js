app.get("/api/censistas", async (req, res) => {
  try {
    console.log("Llamando a INEI_URL:", INEI_URL);

    const resp = await fetch(INEI_URL);

    // Si la API del INEI responde con error (404, 500, etc.)
    if (!resp.ok) {
      const text = await resp.text(); // leemos como texto para ver qué responde
      console.error("Error al llamar a INEI:", resp.status, text.slice(0, 300));
      return res.status(500).json({
        ok: false,
        msg: "Error al llamar a la API INEI",
        status: resp.status,
        bodyPreview: text.slice(0, 300) // primeros 300 chars para debug
      });
    }

    // Si responde OK, intentamos parsear como JSON
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
      error: String(error),        // <--- MANDAMOS EL ERROR
    });
  }
});
