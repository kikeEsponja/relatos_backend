import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.error("Error de conexión:", err));

// Modelo de ejemplo
const Mensaje = mongoose.model("Mensaje", { texto: String });

// Ruta GET
app.get("/mensajes", async (req, res) => {
  const mensajes = await Mensaje.find();
  res.json(mensajes);
});

// Ruta POST
app.post("/mensajes", async (req, res) => {
  const nuevo = new Mensaje({ texto: req.body.texto });
  await nuevo.save();
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
