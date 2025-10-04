import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error de conexión:", err));

const Relato = mongoose.model("Relato", {
  titulo: String,
  contenido: String,
  autor: String
});

app.get("/relatos", async (req, res) => {
  const relatos = await Relato.find();
  res.json(relatos);
});

app.post("/relatos", async (req, res) => {
  const nuevo = new Relato(req.body);
  await nuevo.save();
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));