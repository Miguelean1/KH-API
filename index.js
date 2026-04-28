require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/kingdomhearts")
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    app.listen(port, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
    });
  })
  .catch((err) => console.error("❌ Error de conexión:", err));
