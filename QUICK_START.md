# 🚀 Quick Start - Arte em Ponto Admin Panel

## ✅ Migração Completa: Supabase → MySQL + JWT

Todo o sistema foi migrado de Supabase para MySQL/MariaDB com autenticação JWT custom.
**Custo: 0€/mês** 🎉

---

## 📋 Requisitos

- Node.js 18+
- MySQL ou MariaDB instalado
- npm ou yarn

---

## 🔧 Setup Rápido

### 1️⃣ Instalar dependências do backend

```bash
cd server
npm install
```

### 2️⃣ Configurar base de dados

**Criar ficheiro `.env` na pasta `server/`:**

```env
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=arte_em_ponto

# JWT
JWT_SECRET=minha_chave_super_secreta_jwt_123456
JWT_EXPIRES_IN=7d

# Admin (usado para criar primeiro admin)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### 3️⃣ Criar base de dados

**Opção A - Linha de comando:**
```bash
mysql -u root -p < server/src/database/schema.sql
```

**Opção B - MySQL Workbench ou phpMyAdmin:**
1. Abrir o ficheiro `server/src/database/schema.sql`
2. Copiar todo o conteúdo
3. Executar no MySQL

### 4️⃣ Criar utilizador admin

```bash
cd server
npm run seed
```

Isto cria um admin com:
- **Email**: admin@example.com (ou o que puseste no .env)
- **Password**: admin123 (ou o que puseste no .env)

### 5️⃣ Iniciar servidor backend

```bash
cd server
npm run dev
```

Servidor vai estar em: **http://localhost:3001**

### 6️⃣ Configurar frontend (opcional)

**Criar ficheiro `.env` na pasta `client/`:**

```env
VITE_API_URL=http://localhost:3001/api
```

Se não criares este ficheiro, vai usar `http://localhost:3001/api` por defeito.

### 7️⃣ Aceder ao Admin Panel

1. Abrir **http://localhost:5173/admin**
2. Login:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Entras no dashboard! 🎉

---

## 📁 Estrutura do Projeto

```
webstore_react/
├── client/               # Frontend React
│   ├── src/
│   │   ├── admin/       # Admin Panel (completo!)
│   │   │   ├── pages/   # Dashboard, Products, Orders, etc
│   │   │   └── components/
│   │   ├── utils/
│   │   │   ├── api.ts          # Cliente API JWT
│   │   │   └── apiHelpers.ts  # Helpers para chamadas
│   │   └── ...
│   └── .env.example
│
└── server/              # Backend Express + MySQL
    ├── src/
    │   ├── config/
    │   │   └── database.ts     # MySQL connection
    │   ├── middleware/
    │   │   └── auth.ts         # JWT middleware
    │   ├── routes/
    │   │   ├── auth.ts         # Login/Register
    │   │   ├── products.ts     # CRUD produtos
    │   │   ├── categories.ts   # CRUD categorias
    │   │   ├── orders.ts       # CRUD pedidos
    │   │   └── stats.ts        # Dashboard stats
    │   ├── database/
    │   │   ├── schema.sql      # Criar tabelas
    │   │   └── seed.ts         # Criar admin
    │   └── index.ts
    └── .env.example
```

---

## 🎯 Funcionalidades Admin

### ✅ Dashboard
- Total de receitas, pedidos, produtos
- Pedidos pendentes
- Últimos 5 pedidos
- Produtos com stock baixo
- Vendas por categoria

### ✅ Gestão de Produtos
- Criar, editar, eliminar produtos
- Upload imagens (via URL)
- Gestão de stock
- Produtos featured
- Filtros e pesquisa

### ✅ Gestão de Pedidos
- Ver todos os pedidos
- Filtrar por status
- Pesquisar clientes
- Alterar status do pedido
- Ver detalhes completos (items, cliente, morada)

### ✅ Gestão de Categorias
- Criar, editar, eliminar
- Edição inline

---

## 🔒 Segurança

- ✅ Passwords com **bcrypt** (10 salt rounds)
- ✅ JWT tokens com expiração
- ✅ Middleware de autenticação em todas as rotas admin
- ✅ Verificação de role `admin`
- ✅ SQL injection protection (prepared statements)
- ✅ CORS configurado
- ✅ Helmet.js para headers de segurança

---

## 🛠 Comandos Úteis

### Backend
```bash
npm run dev       # Desenvolvimento (watch mode)
npm run build     # Build para produção
npm start         # Correr produção
npm run seed      # Criar admin
npm run typecheck # Verificar tipos TypeScript
```

### Frontend
```bash
npm run dev       # Desenvolvimento
npm run build     # Build para produção
npm run preview   # Preview da build
```

---

## 🌐 API Endpoints

### Auth
- `POST /api/auth/register` - Registar novo utilizador
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - User atual
- `POST /api/auth/verify` - Verificar token

### Products
- `GET /api/products` - Todos (público)
- `GET /api/products/:id` - Um produto (público)
- `POST /api/products` - Criar (admin)
- `PUT /api/products/:id` - Atualizar (admin)
- `DELETE /api/products/:id` - Eliminar (admin)

### Orders
- `GET /api/orders` - Todos (admin)
- `GET /api/orders/:id` - Um pedido (admin)
- `POST /api/orders` - Criar (público)
- `PATCH /api/orders/:id/status` - Alterar status (admin)

### Categories
- `GET /api/categories` - Todas (público)
- `POST /api/categories` - Criar (admin)
- `PUT /api/categories/:id` - Atualizar (admin)
- `DELETE /api/categories/:id` - Eliminar (admin)

### Stats
- `GET /api/stats/dashboard` - Dashboard stats (admin)

---

## ❌ Troubleshooting

### "Error connecting to database"
- Verificar se MySQL está a correr
- Verificar credenciais no `.env`
- Verificar se base de dados `arte_em_ponto` foi criada

### "Token inválido"
- Fazer logout e login de novo
- Verificar `JWT_SECRET` no `.env`

### "Port 3001 already in use"
- Mudar `PORT` no `.env` para outro (ex: 3002)
- Ou matar processo: `lsof -ti:3001 | xargs kill -9`

### "Cannot find module"
```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

---

## 🎨 Próximos Passos (Opcional)

- [ ] Upload de imagens para servidor (em vez de URLs)
- [ ] Email notifications (nodemailer)
- [ ] Password reset via email
- [ ] Refresh tokens
- [ ] Rate limiting (express-rate-limit)
- [ ] API documentation (Swagger)
- [ ] Logs (winston)
- [ ] Testing (Jest)

---

## 💡 Notas Importantes

1. **Mudar JWT_SECRET** em produção para algo super seguro
2. **Mudar password do admin** após primeiro login
3. **Backup da base de dados** regularmente
4. **HTTPS** em produção
5. **Variáveis de ambiente** nunca commitar no Git

---

## 📞 Suporte

Consultar documentação completa: `MYSQL_MIGRATION_COMPLETE.md`

---

**Feito! Sistema 100% funcional com MySQL + JWT** ✅
