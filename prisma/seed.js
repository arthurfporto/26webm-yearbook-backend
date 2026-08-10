import prisma from "./client.js";
import { hashSenha } from "../utils/senha.js";

// upsert: o seed pode rodar várias vezes sem quebrar no email @unique
async function main() {
  const maria = await prisma.aluno.upsert({
    where: { email: "maria@email.com" },
    update: {},
    create: {
      nome: "Maria Silva",
      email: "maria@email.com",
      senhaHash: await hashSenha("senha123"), // USER — senha de teste: senha123
      cidade: "Salinas",
      frase: "Bora que bora!",
      planosFuturos: "Cursar Ciência da Computação",
    },
  });
  console.log("Aluno criado:", maria.nome);

  const admin = await prisma.aluno.upsert({
    where: { email: "admin@email.com" },
    update: {},
    create: {
      nome: "Prof. Ana Admin",
      email: "admin@email.com",
      senhaHash: await hashSenha("admin123"), // ADMIN — senha de teste: admin123
      cidade: "Salinas",
      role: "ADMIN",
    },
  });
  console.log("Admin criado:", admin.nome);

  const jaTemMensagem = await prisma.mensagem.findFirst({
    where: { autorId: maria.id },
  });
  if (!jaTemMensagem) {
    const mensagem = await prisma.mensagem.create({
      data: {
        texto: "Salve, turma! Vamos com tudo nesse último ano!",
        autorId: maria.id,
      },
    });
    console.log("Mensagem criada:", mensagem.texto);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (erro) => {
    console.error(erro);
    await prisma.$disconnect();
    process.exit(1);
  });
