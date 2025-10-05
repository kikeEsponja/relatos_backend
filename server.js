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

const RelatoSchema = new mongoose.Schema({
  titulo: String,
  autor: String,
  contenido: String,
  fecha: String
});

const Relato = mongoose.model("Relato", RelatoSchema);

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

app.get("/relatos", async (req, res) => {
  try{
    const relatos = await Relato.find().sort({ fecha: -1 });
    res.json(relatos);
  }catch (error) {
    res.status(500).json({ error: "Error al intentar obtener los relatos" })
  }
});

app.post("/relatos", async (req, res) => {
  try{
    const nuevo = new Relato(req.body);
    await nuevo.save();
    res.json({ ok: true });
  }catch(error){
    res.status(500).json({ error: "Error al guardar el relato" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));