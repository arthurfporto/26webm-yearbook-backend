# API do Yearbook Digital

Contrato atual da API REST do Yearbook Digital.

## Acesso

Em desenvolvimento, a API fica disponível em:

```text
http://localhost:3000
```

Todas as requisições que enviam dados devem usar:

```http
Content-Type: application/json
```

Em produção, substitua a base URL pela URL gerada pelo deploy da Vercel.

## Resumo das rotas

| Método | Rota | Descrição | Autenticação |
| --- | --- | --- | --- |
| `GET` | `/` | Mensagem de boas-vindas | Não |
| `GET` | `/status` | Health check | Não |
| `POST` | `/auth/register` | Cria uma conta de aluno | Não |
| `POST` | `/auth/login` | Autentica e retorna um JWT | Não |
| `GET` | `/alunos` | Lista alunos sem `senhaHash` | Não |
| `GET` | `/alunos/:id` | Busca um aluno por ID | Não |
| `PUT` | `/alunos/:id` | Atualiza o próprio perfil | JWT do dono |
| `DELETE` | `/alunos/:id` | Exclui um aluno | JWT de `ADMIN` |
| `GET` | `/mensagens` | Lista mensagens com dados do autor | Não |
| `POST` | `/mensagens` | Cria uma mensagem | JWT |
| `DELETE` | `/mensagens/:id` | Exclui uma mensagem | JWT do dono ou `ADMIN` |

O cadastro de alunos é feito por `/auth/register`. A API não possui `POST /alunos`.

## Autenticação

### Cadastro — `POST /auth/register`

Cria um aluno com perfil `USER`. Os campos `nome`, `email` e `senha` são obrigatórios.

#### Requisição

```json
{
  "nome": "João Teste",
  "email": "joao@example.com",
  "senha": "joao123",
  "cidade": "Salinas",
  "frase": "Em testes",
  "planosFuturos": "Aprender Node.js"
}
```

Os campos `cidade`, `frase` e `planosFuturos` são opcionais.

#### Respostas

- `201 Created`: aluno criado;
- `400 Bad Request`: um dos campos obrigatórios não foi enviado;
- `409 Conflict`: o email já está cadastrado;
- `500 Internal Server Error`: erro inesperado.

Exemplo de resposta `201`:

```json
{
  "id": 3,
  "nome": "João Teste",
  "email": "joao@example.com",
  "cidade": "Salinas",
  "frase": "Em testes",
  "planosFuturos": "Aprender Node.js",
  "fotoUrl": null,
  "role": "USER",
  "criadoEm": "2026-08-19T12:00:00.000Z"
}
```

### Login — `POST /auth/login`

Autentica um aluno e retorna um token JWT.

#### Requisição

```json
{
  "email": "joao@example.com",
  "senha": "joao123"
}
```

#### Respostas

- `200 OK`: login realizado;
- `401 Unauthorized`: email ou senha inválidos;
- `500 Internal Server Error`: erro inesperado.

Exemplo de resposta `200`:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

O token é assinado com `JWT_SECRET`, contém o `id` e a `role` do aluno e expira em 7 dias.

### Envio do token

Nas rotas protegidas, envie o token no header:

```http
Authorization: Bearer <token>
```

Quando o header não é enviado, a resposta é `401` com:

```json
{
  "erro": "Token não fornecido"
}
```

Para token inválido ou expirado:

```json
{
  "erro": "Token inválido ou expirado"
}
```

## Health check

### Boas-vindas — `GET /`

Retorna `200 OK`:

```json
{
  "mensagem": "Yearbook API está no ar! 🎓"
}
```

### Status — `GET /status`

Retorna `200 OK`:

```json
{
  "status": "ok",
  "timestamp": "2026-08-19T12:00:00.000Z"
}
```

## Alunos

### Listar alunos — `GET /alunos`

Retorna `200 OK` com um array de alunos. O campo `senhaHash` nunca aparece.

### Buscar aluno — `GET /alunos/:id`

Retorna `200 OK` com o aluno solicitado ou `404 Not Found`:

```json
{
  "erro": "Aluno não encontrado"
}
```

### Atualizar perfil — `PUT /alunos/:id`

Requer o token do próprio aluno. O `id` da URL precisa ser igual ao `id` presente no token.

Exemplo de requisição:

```json
{
  "cidade": "Montes Claros",
  "frase": "Frase atualizada",
  "planosFuturos": "Trabalhar com tecnologia",
  "fotoUrl": "https://exemplo.com/foto.jpg"
}
```

Campos de perfil disponíveis: `nome`, `email`, `cidade`, `frase`, `planosFuturos` e `fotoUrl`. Envie somente os campos que devem ser alterados. `senhaHash`, `role`, `id` e `criadoEm` não devem ser enviados pelo cliente.

#### Respostas

- `200 OK`: aluno atualizado, sem `senhaHash`;
- `401 Unauthorized`: token ausente, inválido ou expirado;
- `403 Forbidden`: o token não pertence ao aluno da URL;
- `404 Not Found`: aluno não encontrado.

### Excluir aluno — `DELETE /alunos/:id`

Requer token com `role: "ADMIN"`. A exclusão também remove as mensagens associadas ao aluno.

#### Respostas

- `204 No Content`: aluno excluído;
- `401 Unauthorized`: token ausente, inválido ou expirado;
- `403 Forbidden`: usuário não é administrador;
- `404 Not Found`: aluno não encontrado.

Resposta de acesso negado:

```json
{
  "erro": "Acesso negado"
}
```

## Mensagens

### Listar mensagens — `GET /mensagens`

Retorna `200 OK` com as mensagens ordenadas da mais nova para a mais antiga. Cada mensagem inclui os dados públicos do autor:

```json
[
  {
    "id": 1,
    "texto": "Salve, turma!",
    "imagemUrl": null,
    "autorId": 1,
    "criadoEm": "2026-08-19T12:00:00.000Z",
    "autor": {
      "nome": "Maria Silva",
      "fotoUrl": null
    }
  }
]
```

### Criar mensagem — `POST /mensagens`

Requer um JWT válido. O autor é definido automaticamente pelo usuário autenticado; não é necessário enviar `autorId`.

#### Requisição

```json
{
  "texto": "Mensagem da turma",
  "imagemUrl": "https://exemplo.com/imagem.jpg"
}
```

O campo `texto` é obrigatório e `imagemUrl` é opcional. Os campos de imagem são URLs; a API não realiza upload de arquivos.

#### Respostas

- `201 Created`: mensagem criada;
- `400 Bad Request`: o campo `texto` não foi enviado;
- `401 Unauthorized`: token ausente, inválido ou expirado;
- `500 Internal Server Error`: erro inesperado.

Exemplo de resposta `201`:

```json
{
  "id": 2,
  "texto": "Mensagem da turma",
  "imagemUrl": "https://exemplo.com/imagem.jpg",
  "autorId": 1,
  "criadoEm": "2026-08-19T12:00:00.000Z"
}
```

### Excluir mensagem — `DELETE /mensagens/:id`

Requer token do autor da mensagem ou de um administrador.

#### Respostas

- `204 No Content`: mensagem excluída;
- `401 Unauthorized`: token ausente, inválido ou expirado;
- `403 Forbidden`: usuário não é o autor nem administrador;
- `404 Not Found`: mensagem não encontrada.

Resposta quando não há permissão:

```json
{
  "erro": "Você não tem permissão para excluir esta mensagem"
}
```

## Modelos de dados

### Aluno

| Campo | Tipo | Obrigatório | Observação |
| --- | --- | --- | --- |
| `id` | `Int` | Sim | Gerado automaticamente. |
| `nome` | `String` | Sim | Nome do aluno. |
| `email` | `String` | Sim | Único no banco. |
| `senhaHash` | `String` | Sim | Armazenado com bcrypt; nunca retornado pela API. |
| `cidade` | `String` | Não | Cidade do aluno. |
| `frase` | `String` | Não | Frase pessoal. |
| `planosFuturos` | `String` | Não | Planos para o futuro. |
| `fotoUrl` | `String` | Não | URL da foto; não há upload implementado. |
| `role` | `Role` | Sim | `USER` por padrão ou `ADMIN`. |
| `criadoEm` | `DateTime` | Sim | Preenchido automaticamente. |

### Mensagem

| Campo | Tipo | Obrigatório | Observação |
| --- | --- | --- | --- |
| `id` | `Int` | Sim | Gerado automaticamente. |
| `texto` | `String` | Sim | Conteúdo da mensagem. |
| `imagemUrl` | `String` | Não | URL opcional de uma imagem. |
| `autorId` | `Int` | Sim | Chave estrangeira para `Aluno`. |
| `autor` | `Object` | Em listagem | Contém `nome` e `fotoUrl` do autor. |
| `criadoEm` | `DateTime` | Sim | Preenchido automaticamente. |

Datas são serializadas em formato ISO 8601 nas respostas JSON. A relação `Mensagem.autor` usa exclusão em cascata: ao excluir um aluno, suas mensagens também são removidas.

## Erros e comportamento geral

As respostas de erro usam o formato:

```json
{
  "erro": "Descrição do erro"
}
```

O middleware global retorna `500 Internal Server Error` para erros não tratados:

```json
{
  "erro": "Erro interno do servidor"
}
```

A API registra método, rota, status HTTP e duração de cada requisição no terminal.

## CORS

CORS está habilitado para qualquer origem. A API pode ser consumida por aplicações em `localhost`, Vercel ou outros domínios sem configuração adicional no cliente.

## Dados de desenvolvimento

Depois de executar `node prisma/seed.js`, o banco contém os seguintes usuários de teste:

| Perfil | Email | Senha |
| --- | --- | --- |
| `USER` | `maria@email.com` | `senha123` |
| `ADMIN` | `admin@email.com` | `admin123` |

Essas credenciais são exclusivas para desenvolvimento local e não devem ser usadas em produção.
