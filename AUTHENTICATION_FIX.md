# Fix de Autenticação - Arte em Ponto

## Problema Identificado

O erro "Email ou password incorretos" ocorria por **3 motivos**:

### 1. **Variável de ambiente JWT_SECRET não configurada** ⚠️
O erro real era: `secretOrPrivateKey must have a value`
- O arquivo `.env` não existia na pasta `server/`
- O JWT não conseguia gerar tokens sem a chave secreta
- Isto causava falha no login mesmo com credenciais corretas

### 2. **Proxy do Frontend não configurado**
O frontend (porta 5173) não conseguia comunicar com o backend (porta 3001) porque:
- O código fazia requisições para `/api/auth/login` (caminho relativo)
- Isso resultava em `http://localhost:5173/api/auth/login` em vez de `http://localhost:3001/api/auth/login`
- O Vite não tinha proxy configurado para redirecionar `/api` para o backend

### 3. **Hash bcrypt inválido no banco de dados**
O hash que estava no arquivo `setup_first_admin.sql` estava **truncado/incompleto**:
- Hash antigo (inválido): `$2b$10$N8YvF5qGZH8FzQ8h8yKGJOxN9xYzJ5vH8mH5xQ8h8yKGJOxN9xYzJ`
- Hash correto (60 caracteres): `$2b$10$sG3aqf3.wdMvQHXLNhYLGO.yf0UYDTwTIijpVmI.C0e7gZ16OUx1S`

---

## ✅ Correções Aplicadas

### 1. Arquivo .env criado no servidor
**Arquivo:** `server/.env`

```env
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=arte_em_ponto

# JWT Configuration
JWT_SECRET=arte_em_ponto_super_secret_key_2025_change_in_production_abc123xyz789
JWT_EXPIRES_IN=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### 2. Proxy do Vite Configurado
**Arquivo:** `client/vite.config.ts`

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    },
  },
}
```

### 3. Hash bcrypt atualizado
**Arquivo:** `server/src/database/setup_first_admin.sql`

O hash foi atualizado para o valor correto gerado pelo `generate_admin_hash.js`.

---

## 📋 Passos para Resolver

### Passo 1: Configurar variáveis de ambiente do servidor

O arquivo `.env` já foi criado em `server/.env`. **Ajuste a password do MySQL** se necessário:

```env
DB_PASSWORD=sua_password_mysql_aqui
```

### Passo 2: Atualizar o hash no banco de dados

Execute este SQL no MySQL:

```sql
USE arte_em_ponto;

UPDATE users 
SET password = '$2b$10$sG3aqf3.wdMvQHXLNhYLGO.yf0UYDTwTIijpVmI.C0e7gZ16OUx1S'
WHERE email = 'admin@arteemponto.pt';
```

**OU** delete o utilizador e insira novamente:

```sql
USE arte_em_ponto;

DELETE FROM users WHERE email = 'admin@arteemponto.pt';

INSERT INTO users (email, password, name, role, status)
VALUES (
    'admin@arteemponto.pt',
    '$2b$10$sG3aqf3.wdMvQHXLNhYLGO.yf0UYDTwTIijpVmI.C0e7gZ16OUx1S',
    'Administrador',
    'admin',
    'active'
);
```

### Passo 3: Reiniciar o backend

O servidor backend precisa ser reiniciado para carregar as variáveis de ambiente:

```bash
# No terminal do backend (server)
# Pressione Ctrl+C para parar
# Depois execute novamente:
npm run dev
```

### Passo 4: Reiniciar o frontend

O Vite precisa ser reiniciado para aplicar a configuração do proxy:

```bash
# No terminal do frontend (client)
# Pressione Ctrl+C para parar
# Depois execute novamente:
npm run dev
```

### Passo 5: Testar o login

Agora pode fazer login com:
- **Email:** admin@arteemponto.pt
- **Password:** Admin@2025!

---

## 🔍 Como Verificar se Está Funcionando

### 1. Verificar se o .env está carregado

No terminal do backend, ao iniciar deve ver:

```
Server running on port 3001
Database connected successfully
```

Se aparecer erro de conexão ao banco, verifique `DB_PASSWORD` no `.env`.

### 2. Verificar hash no banco de dados

```sql
SELECT email, password, role FROM users WHERE email = 'admin@arteemponto.pt';
```

O hash deve ter **exatamente 60 caracteres** e começar com `$2b$10$`.

### 3. Verificar logs do backend

No terminal do servidor (backend), ao fazer login deve ver:

```
POST /api/auth/login 200
```

Se aparecer `404` ou erro de CORS, o proxy não está funcionando.

### 4. Verificar no navegador (DevTools)

1. Abra o DevTools (F12)
2. Vá para a aba **Network**
3. Tente fazer login
4. Procure por `login` nas requisições
5. Deve ver:
   - **Request URL:** `http://localhost:5173/api/auth/login` (com proxy)
   - **Status:** 200 OK
   - **Response:** Token JWT

---

## 🆘 Problemas Comuns

### "secretOrPrivateKey must have a value"
✅ **Solução:** 
1. Verifique se o arquivo `server/.env` existe
2. Confirme que tem a linha `JWT_SECRET=...`
3. Reinicie o servidor backend

### "CORS error"
✅ **Solução:** O proxy do Vite resolve isso. Certifique-se de reiniciar o frontend.

### "Cannot POST /api/auth/login"
✅ **Solução:** O backend não está rodando. Execute `npm run dev` na pasta `server`.

### "Email ou password incorretos" (ainda)
✅ **Soluções:**
1. Verifique se o hash foi atualizado no banco (Passo 2)
2. Confirme que está usando a password correta: `Admin@2025!`
3. Gere um novo hash com: `node server/generate_admin_hash.js`

### "Network error"
✅ **Solução:** 
1. Backend não está rodando na porta 3001
2. Verifique se as portas estão corretas no `vite.config.ts`

### "Database connection error"
✅ **Solução:**
1. Verifique se o MySQL está rodando
2. Confirme a password no `server/.env` em `DB_PASSWORD`
3. Confirme que a database `arte_em_ponto` existe

---

## 🔐 Gerar Novo Hash (Opcional)

Se quiser usar uma password diferente:

```bash
cd server
node generate_admin_hash.js
```

Copie o hash gerado e atualize no banco de dados.

---

## 📚 Arquivos Modificados/Criados

- ✅ `server/.env` - **CRIADO** com variáveis de ambiente
- ✅ `client/vite.config.ts` - Adicionado proxy
- ✅ `server/src/database/setup_first_admin.sql` - Hash corrigido

---

**Pronto!** A autenticação deve funcionar agora. 🎉
