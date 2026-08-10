import { Router } from "express";
import {
  listarMensagens,
  criarMensagem,
  deletarMensagem,
} from "../controllers/mensagensController.js";
import autenticar from "../middlewares/autenticar.js";

const router = Router();

router.get("/", listarMensagens);
router.post("/", autenticar, criarMensagem);
router.delete("/:id", autenticar, deletarMensagem);

export default router;
