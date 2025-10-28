# 🚨 GUIA RÁPIDO DE REINICIALIZAÇÃO

## Problema
O servidor backend está rodando **SEM** carregar o arquivo `.env` que acabou de ser criado.

## ✅ Solução - REINICIAR O BACKEND

### Passo 1: Parar o servidor backend
No terminal onde o backend está rodando (`server` folder):
```
Pressione: Ctrl + C
```

Deve ver algo como:
```
^C
Stopping server...
```

### Passo 2: Verificar se o .env existe
```bash
# Windows
dir .env

# Deve mostrar:
# .env
```

### Passo 3: Iniciar o servidor novamente
```bash
npm run dev
```

### Passo 4: Verificar se carregou corretamente
Ao iniciar, deve ver no terminal:
```
Server running on port 3001
Database connected successfully
```

**NÃO deve aparecer:**
- ❌ `secretOrPrivateKey must have a value`
- ❌ Erros de conexão ao banco

---

## 📋 Checklist

- [ ] Parei o servidor backend (Ctrl+C)
- [ ] Arquivo `server/.env` existe
- [ ] Reiniciei o servidor (`npm run dev`)
- [ ] Backend iniciou SEM erros
- [ ] Testei o login novamente

---

## ⚠️ Se ainda não funcionar

### Verificar o conteúdo do .env

Abra o arquivo `server/.env` e confirme que tem:

```env
JWT_SECRET=arte_em_ponto_super_secret_key_2025_change_in_production_abc123xyz789
```

### Verificar a password do MySQL

Se o backend mostrar erro de conexão ao banco:

```env
DB_PASSWORD=sua_password_mysql_aqui
```

### Atualizar o hash no banco de dados

Execute no MySQL:

```sql
USE arte_em_ponto;

UPDATE users 
SET password = '$2b$10$sG3aqf3.wdMvQHXLNhYLGO.yf0UYDTwTIijpVmI.C0e7gZ16OUx1S'
WHERE email = 'admin@arteemponto.pt';
```

---

## 🎯 Ordem de Ações

1. **PARAR** o backend (Ctrl+C)
2. **VERIFICAR** que `server/.env` existe e tem `JWT_SECRET`
3. **AJUSTAR** `DB_PASSWORD` no `.env` se necessário
4. **ATUALIZAR** hash no banco de dados (SQL acima)
5. **INICIAR** o backend (`npm run dev`)
6. **TESTAR** o login

---

## ✅ Quando Está Funcionando

### Backend deve mostrar:
```
Server running on port 3001
Database connected successfully
```

### Ao fazer login, deve mostrar:
```
POST /api/auth/login 200
```

### No browser (console):
```
Login successful: {token: "...", user: {...}}
```

---

**IMPORTANTE:** O `.env` só é lido quando o servidor **inicia**. Alterações no `.env` requerem **reiniciar o servidor**.
