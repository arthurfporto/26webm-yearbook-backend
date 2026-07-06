import prisma from "../prisma/client.js";

const selectSemSenha = {
  id: true,
  nome: true,
  email: true,
  cidade: true,
  frase: true,
  planosFuturos: true,
  fotoUrl: true,
  role: true,
  criadoEm: true,
};

export async function listarAlunos(req, res, next) {
  try {
    const alunos = await prisma.aluno.findMany({
      select: selectSemSenha,
    });
    res.json(alunos);
  } catch (erro) {
    next(erro);
  }
}

export async function buscarAluno(req, res, next) {
  try {
    const { id } = req.params;
    const aluno = await prisma.aluno.findUnique({
      where: { id: Number(id) },
      select: selectSemSenha,
    });

    if (!aluno) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    res.json(aluno);
  } catch (erro) {
    next(erro);
  }
}

export async function criarAluno(req, res, next) {
  try {
    const { nome, email, senhaHash, cidade, frase, planosFuturos } = req.body;
    const novoAluno = await prisma.aluno.create({
      data: { nome, email, senhaHash, cidade, frase, planosFuturos },
      select: selectSemSenha,
    });
    res.status(201).json(novoAluno);
  } catch (erro) {
    next(erro);
  }
}

export async function atualizarAluno(req, res, next) {
  const { id } = req.params;
  const dados = req.body;
  try {
    const alunoAtualizado = await prisma.aluno.update({
      where: { id: Number(id) },
      data: dados,
      select: selectSemSenha,
    });
    res.json(alunoAtualizado);
  } catch (erro) {
    res.status(404).json({ erro: "Aluno não encontrado" });
  }
}

export async function deletarAluno(req, res, next) {
  const { id } = req.params;
  try {
    await prisma.aluno.delete({
      where: { id: Number(id) },
    });
    res.status(204).end();
  } catch (erro) {
    res.status(404).json({ erro: "Aluno não encontrado" });
  }
}
