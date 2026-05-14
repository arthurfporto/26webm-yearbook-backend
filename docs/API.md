# API do Yearbook Digital

Base URL: `http://localhost:3000` (desenvolvimento)

## Autenticação

| Método | Rota             | Descrição           | Autenticação |
| ------ | ---------------- | ------------------- | ------------ |
| POST   | `/auth/register` | Criar conta         | Não          |
| POST   | `/auth/login`    | Login (retorna JWT) | Não          |

## Alunos

| Método | Rota          | Descrição                | Autenticação |
| ------ | ------------- | ------------------------ | ------------ |
| GET    | `/alunos`     | Listar todos os alunos   | Não          |
| GET    | `/alunos/:id` | Buscar aluno por ID      | Não          |
| PUT    | `/alunos/:id` | Atualizar próprio perfil | JWT (dono)   |
| DELETE | `/alunos/:id` | Deletar aluno            | JWT (admin)  |

## Mensagens

| Método | Rota             | Descrição                 | Autenticação     |
| ------ | ---------------- | ------------------------- | ---------------- |
| GET    | `/mensagens`     | Listar todas as mensagens | Não              |
| POST   | `/mensagens`     | Criar nova mensagem       | JWT              |
| DELETE | `/mensagens/:id` | Deletar mensagem          | JWT (dono/admin) |

## Modelos de dados

### Aluno

| Campo         | Tipo     | Observação                  |
| ------------- | -------- | --------------------------- |
| id            | Int      | Gerado automaticamente      |
| nome          | String   | Obrigatório                 |
| email         | String   | Único, obrigatório          |
| senhaHash     | String   | ⚠️ NUNCA retornado pela API |
| cidade        | String   | Opcional                    |
| frase         | String   | Opcional                    |
| planosFuturos | String   | Opcional                    |
| fotoUrl       | String   | Opcional (Uploadcare)       |
| role          | Enum     | USER (padrão) ou ADMIN      |
| criadoEm      | DateTime | Gerado automaticamente      |

### Mensagem

| Campo     | Tipo     | Observação              |
| --------- | -------- | ----------------------- |
| id        | Int      | Gerado automaticamente  |
| texto     | String   | Obrigatório             |
| imagemUrl | String   | Opcional (Uploadcare)   |
| autorId   | Int      | FK → Aluno, obrigatório |
| criadoEm  | DateTime | Gerado automaticamente  |

## Regras importantes

-`senhaHash` nunca aparece em nenhuma resposta da API
-Senhas são armazenadas com bcrypt (hash)
-Autenticação via JWT no header `Authorization: Bearer <token>`
-Alunos só podem editar o próprio perfil
-Apenas admins podem deletar alunos
-Mensagens podem ser deletadas pelo dono ou por um admin
