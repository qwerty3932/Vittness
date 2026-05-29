# Vittness Backend — Supabase Edition

API REST do app Vittness. Autenticação e banco de dados 100% via **Supabase**.  
Não requer SQLite, bcrypt ou JWT próprio.

---

## 🚀 Instalação

```bash
cd vittness-backend
npm install
cp .env.example .env
# Preencha SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env
npm run dev
```

---

## ⚙️ Configuração do Supabase

### 1. Crie um projeto em supabase.com

### 2. Copie as credenciais
**Settings → API:**
- `URL` → `SUPABASE_URL`
- `service_role` (secret) → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Crie as tabelas
Vá em **SQL Editor** e cole o SQL dentro do arquivo `database.js`.

### 4. Habilite Row Level Security (RLS)
O SQL do `database.js` já inclui os comandos de RLS e políticas.

---

## 📁 Estrutura

```
vittness-backend/
├── server.js          — Express + middlewares
├── supabase.js        — Client Supabase (service role)
├── database.js        — SQL para criar tabelas no Supabase
├── middleware/
│   └── auth.js        — requireAuth via supabase.auth.getUser()
├── routes/
│   ├── auth.js        — register, login, refresh, logout, delete account
│   ├── user.js        — perfil, senha, e-mail, stats
│   ├── nutrition.js   — refeições e hidratação
│   └── routine.js     — rotinas e treinos
├── .env.example
└── package.json
```

---

## 📡 Endpoints

### Auth — `/auth`

| Método | Rota          | Auth | Descrição                        |
|--------|---------------|------|----------------------------------|
| POST   | `/register`   | ❌   | Cria conta no Supabase Auth      |
| POST   | `/login`      | ❌   | Login → retorna access/refresh   |
| POST   | `/refresh`    | ❌   | Renova access token              |
| POST   | `/logout`     | ✅   | Invalida sessão                  |
| DELETE | `/account`    | ✅   | Exclui conta e todos os dados    |

**POST /auth/register**
```json
{ "name": "João Silva", "email": "joao@email.com", "password": "senha123" }
```

**POST /auth/login** → retorna:
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "...",
  "user": { "id": "uuid", "name": "João", "email": "...", "peso": null, ... }
}
```

> O `accessToken` deve ser enviado em todas as rotas protegidas:  
> `Authorization: Bearer <accessToken>`

### Usuário — `/user` *(Bearer token)*

| Método | Rota          | Descrição                        |
|--------|---------------|----------------------------------|
| GET    | `/profile`    | Dados do perfil                  |
| PATCH  | `/profile`    | Atualiza nome, idade, peso, etc. |
| PATCH  | `/email`      | Altera e-mail                    |
| PATCH  | `/password`   | Altera senha                     |
| GET    | `/stats`      | Estatísticas gerais              |

### Nutrição — `/nutrition` *(Bearer token)*

| Método | Rota                     | Descrição               |
|--------|--------------------------|-------------------------|
| GET    | `/meals?date=YYYY-MM-DD` | Refeições do dia        |
| POST   | `/meals`                 | Registra refeição       |
| DELETE | `/meals/:id`             | Remove refeição         |
| GET    | `/meals/history?days=7`  | Histórico calórico      |
| GET    | `/hydration?date=...`    | Hidratação do dia       |
| POST   | `/hydration`             | Registra água           |
| DELETE | `/hydration/:id`         | Remove registro         |

### Rotinas — `/routine` *(Bearer token)*

| Método | Rota               | Descrição               |
|--------|--------------------|-------------------------|
| GET    | `/`                | Lista rotinas           |
| POST   | `/`                | Cria rotina             |
| PATCH  | `/:id`             | Edita rotina            |
| DELETE | `/:id`             | Exclui rotina           |
| GET    | `/workouts?days=30`| Treinos realizados      |
| POST   | `/workouts`        | Registra treino         |
| DELETE | `/workouts/:id`    | Remove treino           |