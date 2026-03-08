const mongoose = require("mongoose");
const app = require("./app");
const port = 8080;

mongoose
  .connect("mongodb://localhost:27017/kingdomhearts")
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    app.listen(port, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
    });
  })
  .catch((err) => console.error("❌ Error de conexión:", err));
