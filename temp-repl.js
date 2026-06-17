import prisma from "./prisma/client.js";

// findMany — lista todos os alunos (vazio inicialmente)
const alunosAntes = await prisma.aluno.findMany();
console.log("Alunos antes:", alunosAntes);
// Resultado: []

// create — cria um aluno de teste
const novoAluno = await prisma.aluno.create({
  data: {
    nome: "Maria Silva",
    email: "maria@email.com",
    senhaHash: "hash_temporario_123",
    cidade: "Salinas",
    frase: "Bora que bora!",
    planosFuturos: "Cursar Ciência da Computação",
  },
});
console.log("Novo aluno criado:", novoAluno);

// findMany de novo — agora tem um aluno
const alunosDepois = await prisma.aluno.findMany();
console.log("Alunos depois:", alunosDepois);

const alunoInexistente = await prisma.aluno.findUnique({
  where: { id: 999 },
});
console.log("Aluno inexistente:", alunoInexistente);
// Resultado: null

const alunosSemSenha = await prisma.aluno.findMany({
  select: {
    id: true,
    nome: true,
    email: true,
    cidade: true,
    frase: true,
    planosFuturos: true,
    fotoUrl: true,
    role: true,
    criadoEm: true,
    // senhaHash NÃO está aqui — nunca retornado
  },
});
console.log("Alunos sem senhaHash:", alunosSemSenha);

// Criar mensagem
const novaMensagem = await prisma.mensagem.create({
  data: {
    texto: "Salve, turma! Vamos com tudo nesse último ano!",
    autorId: 1, // ID do aluno criado na demonstração
  },
});
console.log("Mensagem criada:", novaMensagem);

// Listar mensagens com dados do autor via include
const mensagens = await prisma.mensagem.findMany({
  include: {
    autor: {
      select: {
        nome: true,
        fotoUrl: true,
      },
    },
  },
});
console.log("Mensagens com autor:", JSON.stringify(mensagens, null, 2));

await prisma.$disconnect();
