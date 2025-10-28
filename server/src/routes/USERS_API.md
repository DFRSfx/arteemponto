# API de Gestão de Utilizadores

API para gerenciar utilizadores no painel de administração. Todas as rotas requerem autenticação de administrador.

## Autenticação

Todas as rotas requerem:
- Header: `Authorization: Bearer <token>`
- Role: `admin`

## Endpoints

### 1. Listar Todos os Utilizadores

```http
GET /api/users
```

**Query Parameters:**
- `role` (opcional): Filtrar por tipo - `admin` ou `customer`

**Exemplo:**
```bash
# Todos os utilizadores
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/users

# Apenas administradores
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/users?role=admin

# Apenas clientes
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/users?role=customer
```

**Resposta:**
```json
{
  "success": true,
  "count": 10,
  "users": [
    {
      "id": 1,
      "email": "admin@example.com",
      "name": "Administrator",
      "role": "admin",
      "status": "active",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Obter Utilizador por ID

```http
GET /api/users/:id
```

**Parâmetros:**
- `id`: ID do utilizador (número inteiro)

**Exemplo:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/users/1
```

**Resposta:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Administrator",
    "role": "admin",
    "status": "active",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 3. Criar Novo Utilizador (incluindo Admin)

```http
POST /api/users
Content-Type: application/json
```

**Body:**
```json
{
  "email": "newadmin@example.com",
  "password": "securePassword123",
  "name": "João Silva",
  "role": "admin",           // "admin" ou "customer" (opcional, default: "customer")
  "status": "active"         // "active", "inactive", "suspended" (opcional, default: "active")
}
```

**Validações:**
- `email`: Obrigatório, deve ser email válido
- `password`: Obrigatório, mínimo 6 caracteres
- `name`: Obrigatório, não pode estar vazio
- `role`: Opcional, deve ser "admin" ou "customer"
- `status`: Opcional, deve ser "active", "inactive" ou "suspended"

**Exemplo - Criar Administrador:**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newadmin@example.com",
    "password": "admin123456",
    "name": "Novo Administrador",
    "role": "admin"
  }' \
  http://localhost:3001/api/users
```

**Exemplo - Criar Cliente:**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "customer123",
    "name": "Maria Santos",
    "role": "customer"
  }' \
  http://localhost:3001/api/users
```

**Resposta:**
```json
{
  "success": true,
  "message": "Utilizador administrador criado com sucesso",
  "user": {
    "id": 5,
    "email": "newadmin@example.com",
    "name": "Novo Administrador",
    "role": "admin",
    "status": "active",
    "created_at": "2025-10-27T12:00:00.000Z",
    "updated_at": "2025-10-27T12:00:00.000Z"
  }
}
```

**Erros:**
- `400`: Email já registado
- `400`: Dados de validação inválidos

---

### 4. Atualizar Utilizador

```http
PUT /api/users/:id
Content-Type: application/json
```

**Body (todos os campos são opcionais):**
```json
{
  "email": "newemail@example.com",
  "password": "newPassword123",
  "name": "Nome Atualizado",
  "role": "admin",
  "status": "inactive"
}
```

**Validações:**
- `email`: Opcional, deve ser email válido
- `password`: Opcional, mínimo 6 caracteres
- `name`: Opcional, não pode estar vazio
- `role`: Opcional, deve ser "admin" ou "customer"
- `status`: Opcional, deve ser "active", "inactive" ou "suspended"

**Exemplo:**
```bash
curl -X PUT \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nome Atualizado",
    "role": "admin",
    "status": "active"
  }' \
  http://localhost:3001/api/users/5
```

**Resposta:**
```json
{
  "success": true,
  "message": "Utilizador atualizado com sucesso",
  "user": {
    "id": 5,
    "email": "newadmin@example.com",
    "name": "Nome Atualizado",
    "role": "admin",
    "status": "active",
    "created_at": "2025-10-27T12:00:00.000Z",
    "updated_at": "2025-10-27T12:30:00.000Z"
  }
}
```

**Restrições:**
- Não pode remover a própria permissão de admin
- Email deve ser único

**Erros:**
- `400`: Não pode remover a própria permissão de administrador
- `400`: Email já está em uso
- `404`: Utilizador não encontrado

---

### 5. Eliminar Utilizador

```http
DELETE /api/users/:id
```

**Parâmetros:**
- `id`: ID do utilizador a eliminar

**Exemplo:**
```bash
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/users/5
```

**Resposta:**
```json
{
  "success": true,
  "message": "Utilizador eliminado com sucesso"
}
```

**Restrições:**
- Não pode eliminar a própria conta

**Erros:**
- `400`: Não pode eliminar a própria conta
- `404`: Utilizador não encontrado

---

### 6. Estatísticas de Utilizadores

```http
GET /api/users/stats/overview
```

**Exemplo:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/users/stats/overview
```

**Resposta:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 50,
    "totalCustomers": 45,
    "totalAdmins": 5
  }
}
```

---

## Códigos de Status HTTP

- `200`: Sucesso
- `201`: Criado com sucesso
- `400`: Dados inválidos ou erro de validação
- `401`: Não autenticado
- `403`: Sem permissão (não é admin)
- `404`: Recurso não encontrado
- `500`: Erro interno do servidor

---

## Tipos de Utilizador (Role)

- `customer`: Cliente normal (pode fazer compras)
- `admin`: Administrador (acesso total ao painel)

---

## Estados do Utilizador (Status)

- `active`: Ativo, pode fazer login
- `inactive`: Inativo, não pode fazer login
- `suspended`: Suspenso, não pode fazer login

---

## Segurança

1. **Passwords são automaticamente hashadas** usando bcrypt
2. **Passwords nunca são retornadas** nas respostas da API
3. **Admins não podem:**
   - Remover a própria permissão de admin
   - Eliminar a própria conta
4. **Todos os endpoints requerem autenticação e role admin**

---

## Exemplos de Uso no Frontend

### Criar Administrador

```typescript
const createAdmin = async (data) => {
  const response = await fetch('http://localhost:3001/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      name: data.name,
      role: 'admin',
      status: 'active'
    })
  });

  const result = await response.json();
  return result;
};
```

### Listar Administradores

```typescript
const getAdmins = async () => {
  const response = await fetch('http://localhost:3001/api/users?role=admin', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const result = await response.json();
  return result.users;
};
```

### Atualizar Utilizador

```typescript
const updateUser = async (userId, data) => {
  const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  return result;
};
```

---

## Notas Importantes

1. A password do utilizador é sempre hashada antes de ser guardada na base de dados
2. Ao criar um admin, certifique-se de guardar a password num local seguro
3. Recomenda-se sempre usar HTTPS em produção
4. Os tokens JWT expiram após 7 dias (configurável em JWT_EXPIRES_IN)
5. A base de dados já suporta os campos `role` e `status` necessários
