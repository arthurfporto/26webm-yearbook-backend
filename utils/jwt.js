import jwt from "jsonwebtoken";

const SEGREDO = process.env.JWT_SECRET;
const EXPIRACAO = "7d";

// gera um token assinado com id e role do aluno
export function gerarToken(aluno) {
  const payload = {
    id: aluno.id,
    role: aluno.role,
  };
  return jwt.sign(payload, SEGREDO, { expiresIn: EXPIRACAO });
}

// valida o token e devolve o payload (lança erro se inválido/expirado)
export function verificarToken(token) {
  return jwt.verify(token, SEGREDO);
}
