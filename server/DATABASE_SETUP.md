# Setup da Base de Dados - Arte em Ponto

Guia completo para configurar a base de dados do projeto.

## 📋 Pré-requisitos

- MySQL 5.7+ ou MariaDB 10.3+
- Node.js 18+ (para gerar hash de password, opcional)

---

## 🚀 Setup Inicial

### 1. Criar Base de Dados e Tabelas

Execute o schema principal:

```bash
mysql -u root -p < server/src/database/schema.sql
```

Isto irá criar:
- ✅ Base de dados `arte_em_ponto`
- ✅ Tabela `users` (com campos role e status)
- ✅ Tabela `categories`
- ✅ Tabela `products` (com campo `imagens` JSON)
- ✅ Tabela `orders`
- ✅ Tabela `order_items`
- ✅ Categorias padrão

### 2. Criar Primeiro Administrador

Execute o script de setup do admin:

```bash
mysql -u root -p < server/src/database/setup_first_admin.sql
```

**Credenciais criadas:**
- **Email:** admin@arteemponto.pt
- **Password:** Admin@2025!

⚠️ **IMPORTANTE:** Altere a password após o primeiro login!

---

## 🔐 Primeiro Login

1. Inicie o servidor:
```bash
cd server
npm run dev
```

2. Faça login via API:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@arteemponto.pt",
    "password": "Admin@2025!"
  }'
```

3. Guarde o token JWT retornado

4. **Altere a password imediatamente:**
```bash
curl -X PUT http://localhost:3001/api/users/1 \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "SuaNovaPasswordSegura123!"
  }'
```

---

## 👥 Criar Mais Administradores

Depois de fazer login como admin, pode criar mais administradores pelo painel:

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "outro-admin@arteemponto.pt",
    "password": "PasswordSegura123!",
    "name": "Outro Administrador",
    "role": "admin",
    "status": "active"
  }'
```

---

## 🔧 Usar Password Personalizada (Opcional)

Se quiser usar uma password diferente para o primeiro admin:

### Opção 1 - Gerar hash com Node.js

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('SuaPasswordAqui', 10).then(h => console.log(h));"
```

### Opção 2 - Gerar hash online

1. Aceda a https://bcrypt-generator.com/
2. Cole a sua password
3. Selecione **10 rounds**
4. Copie o hash gerado

### Opção 3 - Inserir diretamente no MySQL

```sql
USE arte_em_ponto;

INSERT INTO users (email, password, name, role, status)
VALUES (
    'seuemail@exemplo.pt',
    'SEU_HASH_BCRYPT_AQUI',
    'Seu Nome',
    'admin',
    'active'
);
```

---

## 🗄️ Migrações

### Adicionar campo `imagens` em tabela existente

Se a tabela `products` já existe sem o campo `imagens`:

```bash
mysql -u root -p < server/src/database/migrations/add_imagens_to_products.sql
```

---

## 📊 Estrutura de Utilizadores

### Tipos de Utilizador (role)

- **`admin`** - Administrador com acesso total ao painel
- **`customer`** - Cliente normal (pode fazer compras)

### Estados (status)

- **`active`** - Ativo, pode fazer login
- **`inactive`** - Inativo, não pode fazer login
- **`suspended`** - Suspenso, não pode fazer login

---

## 🔄 Reset Completo (Desenvolvimento)

Para apagar tudo e recomeçar:

```sql
-- ⚠️  CUIDADO: Isto apaga TODOS os dados!
DROP DATABASE IF EXISTS arte_em_ponto;
```

Depois execute novamente os passos 1 e 2.

---

## 📝 Variáveis de Ambiente

Crie um ficheiro `.env` no diretório `server/`:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_password_mysql
DB_NAME=arte_em_ponto

# JWT
JWT_SECRET=sua_chave_secreta_muito_longa_e_aleatoria
JWT_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## ✅ Verificar Setup

Para verificar se tudo está OK:

```sql
USE arte_em_ponto;

-- Ver tabelas criadas
SHOW TABLES;

-- Ver administradores
SELECT id, email, name, role, status FROM users WHERE role = 'admin';

-- Ver categorias
SELECT * FROM categories;

-- Ver estrutura da tabela products (campo imagens deve existir)
DESCRIBE products;
```

---

## 🆘 Problemas Comuns

### "Table already exists"
✅ Normal se executar o schema.sql múltiplas vezes. Usa `IF NOT EXISTS`.

### "Duplicate entry for key 'email'"
✅ O admin já foi criado. Use outro email ou faça login com o existente.

### "Access denied for user"
❌ Verifique as credenciais MySQL no `.env`.

### "Unknown database 'arte_em_ponto'"
❌ Execute primeiro o `schema.sql` para criar a base de dados.

---

## 📚 Documentação Adicional

- **API de Utilizadores:** `server/src/routes/USERS_API.md`
- **Modelos:** `server/src/models/README.md`
- **Quick Start:** `QUICK_START.md` (raiz do projeto)

---

## 🔐 Segurança em Produção

1. ✅ Use passwords fortes e únicas
2. ✅ Altere a `JWT_SECRET` para uma chave aleatória longa
3. ✅ Use HTTPS em produção
4. ✅ Configure firewall do MySQL (apenas localhost/IPs autorizados)
5. ✅ Faça backups regulares da base de dados
6. ✅ Nunca comite o ficheiro `.env` no git
7. ✅ Altere passwords de admin regularmente

---

**Pronto!** A base de dados está configurada e pode começar a usar o sistema. 🎉
