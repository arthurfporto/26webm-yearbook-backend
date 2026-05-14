# Yearbook Backend

Este repositório contém o back-end do Yearbook Digital, mais branches de checkpoint que correspondem aos marcos intermediários do bloco.

## Stack

- Node.js + Express (ES Modules)
- Prisma ORM + Neon (PostgreSQL serverless)
- dotenv, cors
- Bruno (testes de API)
- GitHub Actions (smoke test)
- Vercel (deploy serverless contínuo)

## Estrutura

```
yearbook-backend-ref/
├── controllers/        CRUD de alunos e mensagens
├── routes/             Routers Express
├── middlewares/        logger e middleware de erro global
├── prisma/             schema, client, migrations
├── docs/API.md         Contrato de API
├── .github/workflows/  smoke test
├── bruno/              Coleção Bruno com environments local + production
├── index.js            Entry point do servidor
├── vercel.json         Config serverless da Vercel
└── package.json
```

## Endpoints

| Método | Rota             | Descrição                      |
| ------ | ---------------- | ------------------------------ |
| GET    | `/`              | Boas-vindas                    |
| GET    | `/status`        | Health check                   |
| GET    | `/alunos`        | Lista alunos (sem `senhaHash`) |
| GET    | `/alunos/:id`    | Busca aluno por ID             |
| POST   | `/alunos`        | Cria aluno                     |
| PUT    | `/alunos/:id`    | Atualiza aluno                 |
| DELETE | `/alunos/:id`    | Deleta aluno                   |
| GET    | `/mensagens`     | Lista mensagens (com autor)    |
| POST   | `/mensagens`     | Cria mensagem                  |
| DELETE | `/mensagens/:id` | Deleta mensagem                |

Detalhes completos em [docs/API.md](./docs/API.md).
