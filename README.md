# Vittness Backend

API REST para o app Vittness. Construída com **Node.js + Express + SQLite (better-sqlite3)**.

---

## 🚀 Instalação e execução

```bash
# 1. Entre na pasta
cd vittness-backend

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env e troque JWT_SECRET por uma string segura

# 4. Inicie o servidor
npm run dev       # desenvolvimento (auto-reload)
npm start         # produção
```

O servidor sobe em `http://localhost:3001` por padrão.

---

## 🗂 Estrutura de arquivos

```
vittness-backend/
├── server.js               # Ponto de entrada
├── database.js             # Setup e init do SQLite
├── middleware/
│   └── auth.js             # JWT: geração, verificação e requireAuth
├── routes/
│   ├── auth.js             # Registro, login, refresh, logout, excluir conta
│   ├── user.js             # Perfil, atualização, senha, e-mail, estatísticas
│   ├── nutrition.js        # Refeições e hidratação
│   └── routine.js          # Rotinas de treino e treinos realizados
├── .env.example
└── package.json
```

---

## 🔑 Autenticação

A API usa **JWT (Bearer token)** com **refresh token** de rotação.

- `accessToken` — válido por **2 horas**, enviado no header `Authorization: Bearer <token>`
- `refreshToken` — válido por **30 dias**, armazenado no banco, usado para renovar o access token

---

## 📡 Endpoints

### Auth — `/auth`

| Método | Rota             | Auth | Descrição                          |
|--------|------------------|------|------------------------------------|
| POST   | `/register`      | ❌   | Cria nova conta                    |
| POST   | `/login`         | ❌   | Autentica e retorna tokens         |
| POST   | `/refresh`       | ❌   | Renova access token via refresh    |
| POST   | `/logout`        | ✅   | Invalida o refresh token           |
| DELETE | `/account`       | ✅   | Exclui conta (exige senha)         |

**POST /auth/register**
```json
// Request
{ "name": "João Silva", "email": "joao@email.com", "password": "senha123" }

// Response 201
{
  "message": "Conta criada com sucesso.",
  "accessToken": "eyJ...",
  "refreshToken": "abc123...",
  "user": { "id": 1, "name": "João Silva", "email": "joao@email.com" }
}
```

**POST /auth/login**
```json
// Request
{ "email": "joao@email.com", "password": "senha123" }

// Response 200
{
  "accessToken": "eyJ...",
  "refreshToken": "abc123...",
  "user": { "id": 1, "name": "João Silva", "email": "joao@email.com", "peso": 80, "altura": 175, ... }
}
```

---

### Usuário — `/user`  *(requer Bearer token)*

| Método | Rota              | Descrição                          |
|--------|-------------------|------------------------------------|
| GET    | `/profile`        | Retorna dados do perfil            |
| PATCH  | `/profile`        | Atualiza nome, idade, peso, altura, objetivo |
| PATCH  | `/email`          | Altera e-mail (exige senha)        |
| PATCH  | `/password`       | Altera senha (exige senha atual)   |
| GET    | `/stats`          | Estatísticas gerais do usuário     |

**PATCH /user/profile**
```json
// Request (todos opcionais)
{ "name": "João", "idade": 25, "peso": 80.5, "altura": 175, "objetivo": "Ganho de massa magra" }
```

---

### Nutrição — `/nutrition`  *(requer Bearer token)*

| Método | Rota                   | Descrição                          |
|--------|------------------------|------------------------------------|
| GET    | `/meals?date=YYYY-MM-DD` | Refeições do dia + total kcal    |
| POST   | `/meals`               | Registra refeição                  |
| DELETE | `/meals/:id`           | Remove refeição                    |
| GET    | `/meals/history?days=7` | Histórico calórico por dia        |
| GET    | `/hydration?date=...`  | Hidratação do dia                  |
| POST   | `/hydration`           | Registra consumo de água           |
| DELETE | `/hydration/:id`       | Remove registro de água            |

**POST /nutrition/meals**
```json
{ "name": "Frango gralhado com arroz", "kcal": 450 }
```

**POST /nutrition/hydration**
```json
{ "amount_ml": 500 }
```

---

### Rotinas — `/routine`  *(requer Bearer token)*

| Método | Rota                  | Descrição                          |
|--------|-----------------------|------------------------------------|
| GET    | `/`                   | Lista rotinas do usuário           |
| POST   | `/`                   | Cria rotina com exercícios         |
| PATCH  | `/:id`                | Edita rotina                       |
| DELETE | `/:id`                | Exclui rotina                      |
| GET    | `/workouts?days=30`   | Treinos realizados + estatísticas  |
| POST   | `/workouts`           | Registra treino realizado          |
| DELETE | `/workouts/:id`       | Remove treino                      |

**POST /routine**
```json
{
  "name": "Treino A - Peitoral",
  "goal": "Ganho de massa magra",
  "frequency": "3X",
  "exercises": [
    { "name": "Supino Reto", "sets": 4, "reps": 10 },
    { "name": "Crucifixo", "sets": 3, "reps": 12 }
  ]
}
```

---

## 🛡 Segurança

- Senhas hasheadas com **bcrypt** (12 rounds)
- JWT com segredo via variável de ambiente
- Rotação de refresh tokens (cada uso gera um novo par)
- Helmet para headers HTTP seguros
- Rate limiting: 100 req/min por IP
- LGPD: usuário pode excluir sua conta e todos os dados via `DELETE /auth/account`
