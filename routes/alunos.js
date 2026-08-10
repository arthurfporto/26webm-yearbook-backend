import { Router } from "express";
import {
  listarAlunos,
  buscarAluno,
  atualizarAluno,
  deletarAluno,
} from "../controllers/alunosController.js";
import autenticar from "../middlewares/autenticar.js";
import autorizar from "../middlewares/autorizar.js";

const router = Router();

router.get("/", listarAlunos);
router.get("/:id", buscarAluno);
router.put("/:id", autenticar, atualizarAluno);
router.delete("/:id", autenticar, autorizar("ADMIN"), deletarAluno);

export default router;
