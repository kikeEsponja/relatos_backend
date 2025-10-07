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
	portada: String,
	foto_autor: String,
});
const DibujoSchema = new mongoose.Schema({
	fecha: String,
	autor: String,
	contenido: String,
	titulo: String,
	portada: String,
	foto_autor: String,
});
const Relato = mongoose.model("relatos", RelatoSchema);
const Dibujo = mongoose.model("dibujos", DibujoSchema);

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
app.get("/dibujos", async (req, res) => {
	try{
		const dibujos = await Dibujo.find().sort({ fecha: -1 });
		res.json(dibujos);
	}catch (error) {
		res.status(500).json({ error: "Error al intentar obtener los dibujos" })
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

app.get("/dibujantes", async (req, res) => {
	try {
		const dibujantes = await Dibujo.distinct("autor");
		res.json(dibujantes);
	} catch (error) {
		console.error("Error en /dibujantes:", error);
		res.status(500).json({ error: "Error al obtener dibujantes" });
	}
});
app.get("/dibujos/:autor", async (req, res) => {
	try {
		const dibujos = await Dibujo.find({ autor: req.params.autor });
		res.json(dibujos);
	} catch (error) {
		res.status(500).json({ error: "Error al obtener relatos" });
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));