import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

// gera o hash da senha em texto puro
export async function hashSenha(senha) {
  return bcrypt.hash(senha, SALT_ROUNDS);
}

// confere se a senha digitada bate com o hash guardado
export async function verificarSenha(senha, hash) {
  return bcrypt.compare(senha, hash);
}
