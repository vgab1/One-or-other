import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { db, FieldValue } from "./firebase.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Backend funcionando!");
});

app.post("/escolha", async (req, res) => {
  try {
    const { nome, escolha } = req.body;

    if (!nome || !escolha) {
      console.log("Dados inválidos recebidos:", req.body);
      return res.status(400).json({ error: "Nome e escolha são obrigatórios" });
    }

    console.log("Recebido:", { nome, escolha });

    const userRef = db.collection("usuarios").doc(nome);
    const doc = await userRef.get();

    if (doc.exists) {
      console.log(`Atualizando votos para ${nome}`);
      await userRef.update({
        votos: FieldValue.arrayUnion(escolha),
      });
    } else {
      console.log(`Criando novo usuário: ${nome}`);
      await userRef.set({
        nome,
        votos: [escolha],
      });
    }

    res.status(201).json({ message: "Escolha salva com sucesso" });
  } catch (error) {
    console.error("Erro ao salvar escolha:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.get("/escolhas", async (req, res) => {
  try {
    const snapshot = await db.collection("usuarios").get();
    const usuarios = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Erro ao recuperar escolhas:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
