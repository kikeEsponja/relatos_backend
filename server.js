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

const BaseSchema = new mongoose.Schema({
	fecha: String,
	autor: String,
	contenido: String,
	titulo: String,
	portada: String,
	foto_autor: String,
	visitas: { type: Number, default: 0 },
});

const Relato = mongoose.model("relatos", BaseSchema);
const Dibujo = mongoose.model("dibujos", BaseSchema);

function crearRutas(tipo, Modelo){
	app.get(`/${tipo}`, async (req, res) =>{
		try{
			const docs = await Modelo.find().sort({ fecha: -1 });
			res.json(docs);
		}catch (error){
			res.status(500).json({ error: `Error al obtener ${tipo}`});
		}
	});

	app.get(`/${tipo === "relatos" ? "autores" : "dibujantes"}`, async (req, res) => {
		try{
			const autores = await Modelo.distinct("autor");
			res.json(autores);
		}catch(error){
			console.error(`Error en /${tipo}:`, error);
			res.status(500).json({ error: `Error al obtener ${tipo}`});
		}
	});

	app.get(`/${tipo}/:autor`, async (req, res) => {
		try{
			const docs = await Modelo.find({ autor: req.params.autor });
			res.json(docs);
		}catch(error){
			res.status(500).json({ error: `Error al obtener ${tipo} por autor`});
		}
	});

	app.post(`/${tipo}`, async (req, res) => {
		try{
			const nuevo = new Modelo(req.body);
			await nuevo.save();
			res.json({ ok:true });
		}catch(error){
			res.status(500).json({ error: `Error al guardar ${tipo}`});
		}
	});

	app.post("/visita/:id", async (req, res) => {
		try{
			const { id } = req.params;
			await Relato.findByIdAndUpdate(id, { $inc: { visitas: 1 } });
			res.json({ ok: true });
		}catch(error){
			console.error("Error al registrar visita:", error);
			res.status(500).json({ error: "no se pudo registrar la visita" });
		}
	});
}

crearRutas("relatos", Relato);
crearRutas("dibujos", Dibujo);

app.get("/", (req, res) => {
	res.send("Servidor funcionando correctamente");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));