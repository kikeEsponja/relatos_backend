import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
console.log("🔍 URI de Mongo:", process.env.MONGO_URI);
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error de conexión:", err));

const RelatoSchema = new mongoose.Schema({
  fecha: String,
  autor: String,
  contenido: String,
  titulo: String,
});

const Relato = mongoose.model("relatos", RelatoSchema);

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

app.get("/autores", async (req, res) => {
  try {
    const autores = await Relato.distinct("autor");
    res.json(autores);
  } catch (error) {
    console.error("Error en /autores:", error);
    res.status(500).json({ error: "Error al obtener autores" });
  }
});

// Obtener relatos por autor
app.get("/relatos/:autor", async (req, res) => {
  try {
    const relatos = await Relato.find({ autor: req.params.autor });
    res.json(relatos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener relatos" });
  }
});

app.get("/debug", async (req, res) => {
  try {
    const count = await Relato.countDocuments();
    res.json({ conectado: true, cantidad: count });
  } catch (error) {
    res.status(500).json({ conectado: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));