import { verificarToken } from "../utils/jwt.js";

export default function autenticar(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  const token = header.split(" ")[1];

  try {
    const payload = verificarToken(token);
    req.aluno = { id: payload.id, role: payload.role };
    next();
  } catch (erro) {
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }
}
