## 🎯 Database Optimization - Resumo Completo

### O que foi otimizado?

#### 1. **Normalização 3NF - Foreign Keys**

**Antes (Não Normalizado):**
```sql
CREATE TABLE products (
  id INT,
  name VARCHAR(255),
  category VARCHAR(255),  -- ❌ String duplicada em cada produto
  ...
);
```

**Depois (Normalizado 3NF):**
```sql
CREATE TABLE products (
  id INT UNSIGNED,
  name VARCHAR(100),
  category_id TINYINT UNSIGNED,  -- ✅ FK para categories (1 byte)
  FOREIGN KEY (category_id) REFERENCES categories(id)
  ...
);
```

**Benefícios:**
- ✅ **Storage**: VARCHAR(255) = até 255 bytes → TINYINT = 1 byte (255x menos!)
- ✅ **Integridade**: FK garante que categoria existe
- ✅ **Performance**: JOINs com INT são mais rápidos que string LIKE
- ✅ **Manutenção**: Mudar nome da categoria não requer UPDATE em produtos

---

#### 2. **Campo n_telemovel adicionado**

```sql
ALTER TABLE users
ADD COLUMN n_telemovel VARCHAR(20) NULL COMMENT 'Número de telemóvel';
```

Agora users pode armazenar número de telemóvel (formato: +351 XXX XXX XXX).

---

#### 3. **Tipos de Dados Otimizados**

| Campo | Antes | Depois | Economia |
|-------|-------|--------|----------|
| **users.id** | INT | INT UNSIGNED | Dobra range positivo |
| **users.email** | VARCHAR(255) | VARCHAR(100) | 155 bytes |
| **users.name** | VARCHAR(255) NULL | VARCHAR(100) NOT NULL | 155 bytes + NULL |
| **categories.id** | INT | TINYINT UNSIGNED | 3 bytes (1-255 categorias) |
| **categories.name** | VARCHAR(255) | VARCHAR(50) | 205 bytes |
| **categories.slug** | VARCHAR(255) | VARCHAR(60) | 195 bytes |
| **products.stock** | INT | SMALLINT UNSIGNED | 2 bytes (0-65535) |
| **products.price** | DECIMAL(10,2) | DECIMAL(8,2) | Até 999.999,99€ |
| **products.imagens** | LONGTEXT | JSON | Tipo nativo MySQL |

**Total economizado por produto: ~256 bytes**
Com 1000 produtos = **~250KB economizados!**

---

#### 4. **O que é SLUG?**

**Slug** é um identificador URL-friendly único usado para criar URLs amigáveis.

**Exemplo SEM slug:**
```
https://arteemponto.pt/produtos?categoria=1
https://arteemponto.pt/produtos?categoria=2
```

**Exemplo COM slug:**
```
https://arteemponto.pt/produtos/toalhas
https://arteemponto.pt/produtos/guardanapos
https://arteemponto.pt/produtos/panos-cozinha
```

**Benefícios:**
- ✅ **SEO**: Google prefere URLs descritivas
- ✅ **UX**: Mais legível para utilizadores
- ✅ **Partilha**: URLs mais bonitas
- ✅ **Independente**: ID pode mudar sem quebrar links

**Regras:**
- Apenas letras minúsculas, números e hífens
- Sem espaços, acentos ou caracteres especiais
- Único na tabela
- Exemplo: "Panos de Cozinha" → "panos-cozinha"

---

#### 5. **Índices Estratégicos**

**Índices Simples:**
```sql
INDEX idx_email (email)           -- Users
INDEX idx_slug (slug)             -- Categories
INDEX idx_category_id (category_id) -- Products
INDEX idx_status (status)         -- Orders
```

**Índices Compostos (queries comuns):**
```sql
-- Produtos em destaque de uma categoria
INDEX idx_category_featured (category_id, featured)

-- Dashboard admin: pedidos por status e data
INDEX idx_status_created (status, created_at)
```

---

#### 6. **Foreign Keys com Constraints**

```sql
-- Products → Categories
FOREIGN KEY (category_id) REFERENCES categories(id)
  ON DELETE RESTRICT    -- Não pode eliminar categoria se tiver produtos
  ON UPDATE CASCADE     -- Mudanças propagam automaticamente

-- Order Items → Orders
FOREIGN KEY (order_id) REFERENCES orders(id)
  ON DELETE CASCADE     -- Elimina items quando order é eliminada

-- Order Items → Products
FOREIGN KEY (product_id) REFERENCES products(id)
  ON DELETE RESTRICT    -- Não pode eliminar produto se tiver orders

-- Orders → Users
FOREIGN KEY (user_id) REFERENCES users(id)
  ON DELETE SET NULL    -- Order mantém-se se user é apagado
```

---

### 📊 Comparação: Antes vs Depois

#### **Storage por Produto**

**Antes (não otimizado):**
```
category VARCHAR(255) = 255 bytes
stock INT             = 4 bytes
id INT                = 4 bytes
Total                 = 263 bytes
```

**Depois (otimizado):**
```
category_id TINYINT   = 1 byte
stock SMALLINT        = 2 bytes
id INT UNSIGNED       = 4 bytes
Total                 = 7 bytes
```

**Economia: 256 bytes por produto!**

#### **Exemplo com 1000 produtos:**
- Antes: 263 KB
- Depois: 7 KB
- **Economizado: 256 KB (~97% redução nestes campos)**

---

### 🗄️ Estrutura Final Otimizada

```
┌─────────────┐
│   users     │ (INT UNSIGNED, n_telemovel adicionado)
└─────────────┘
      │
      │ user_id (FK, SET NULL)
      ▼
┌─────────────┐
│   orders    │ (INT UNSIGNED, DECIMAL(10,2))
└─────────────┘
      │
      │ order_id (FK, CASCADE)
      ▼
┌─────────────┐
│ order_items │ (SMALLINT UNSIGNED quantity)
└─────────────┘
      │
      │ product_id (FK, RESTRICT)
      ▼
┌─────────────┐
│  products   │ (category_id FK, SMALLINT stock, JSON imagens)
└─────────────┘
      │
      │ category_id (FK, RESTRICT)
      ▼
┌─────────────┐
│ categories  │ (TINYINT UNSIGNED id, slug)
└─────────────┘
```

---

### 📝 Como Usar o Schema Otimizado

#### **Opção 1: Nova Instalação**
```bash
# Usar schema otimizado diretamente
mysql -u root -p < server/src/database/schema_optimized.sql
```

#### **Opção 2: Migrar BD Existente**
```bash
# ⚠️  Fazer BACKUP primeiro!
mysqldump -u root -p arte_em_ponto > backup.sql

# Executar migração
mysql -u root -p < server/src/database/migrations/migrate_to_optimized_schema.sql
```

---

### 💻 Como Usar nos Modelos

#### **Criar Produto (com category_id)**
```typescript
import { ProductModel } from './models';

await ProductModel.create({
  name: 'Toalha Bordada',
  description: 'Linda toalha artesanal',
  price: 89.90,
  category_id: 1,  // ✅ Usar ID da categoria
  image: '/images/toalha.jpg',
  imagens: ['/img1.jpg', '/img2.jpg'],  // Array JSON
  stock: 10,
  featured: true
});
```

#### **Buscar Produtos com Categoria**
```typescript
// Por category_id
const products = await ProductModel.findAll({ category_id: 1 });

// Por category slug (mais user-friendly)
const products = await ProductModel.findByCategorySlug('toalhas');

// Resultado inclui category_name e category_slug
products.forEach(p => {
  console.log(p.name, p.category_name, p.category_slug);
});
```

#### **Criar User com Telemóvel**
```typescript
import { UserModel } from './models';

await UserModel.create({
  email: 'user@example.com',
  password: 'senha123',
  name: 'João Silva',
  n_telemovel: '+351 912 345 678',  // ✅ Novo campo
  role: 'customer'
});
```

---

### 🚀 Mudanças nas Rotas API

#### **Criar Produto (antes)**
```json
POST /api/products
{
  "name": "Produto",
  "category": "Toalhas",  // ❌ String
  ...
}
```

#### **Criar Produto (depois)**
```json
POST /api/products
{
  "name": "Produto",
  "category_id": 1,  // ✅ ID da categoria
  ...
}
```

#### **Buscar Categorias (para dropdown)**
```bash
GET /api/categories

# Resposta:
[
  { "id": 1, "name": "Toalhas", "slug": "toalhas" },
  { "id": 2, "name": "Guardanapos", "slug": "guardanapos" },
  ...
]
```

---

### ✅ Validações Automáticas

Com Foreign Keys, o MySQL valida automaticamente:

```sql
-- ❌ Erro: Categoria não existe
INSERT INTO products (name, category_id, ...)
VALUES ('Produto', 999, ...);
-- ERROR: Cannot add or update a child row: foreign key constraint fails

-- ❌ Erro: Não pode eliminar categoria com produtos
DELETE FROM categories WHERE id = 1;
-- ERROR: Cannot delete or update a parent row: foreign key constraint fails

-- ✅ OK: Eliminar produto
DELETE FROM products WHERE id = 5;

-- ❌ Erro: Não pode eliminar produto com orders
DELETE FROM products WHERE id = 3;  -- Se tiver orders
-- ERROR: Cannot delete or update a parent row: foreign key constraint fails
```

---

### 🔍 Queries Úteis

#### **Ver todos os produtos com categorias**
```sql
SELECT
  p.id,
  p.name,
  p.price,
  p.stock,
  c.name as category_name,
  c.slug as category_slug
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;
```

#### **Contar produtos por categoria**
```sql
SELECT
  c.name,
  COUNT(p.id) as total_products
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY total_products DESC;
```

#### **Produtos em destaque de uma categoria (usa índice composto)**
```sql
SELECT * FROM products
WHERE category_id = 1 AND featured = TRUE;
-- Usa INDEX idx_category_featured
```

---

### 📌 Pontos Importantes

1. **category_id é obrigatório** ao criar produto
2. **Não pode eliminar categoria** se tiver produtos
3. **Slug deve ser único** e URL-friendly
4. **n_telemovel é opcional** (NULL permitido)
5. **imagens é JSON nativo** (não string)
6. **Foreign Keys garantem integridade** de dados

---

### 🛠️ Troubleshooting

#### **Erro: Unknown column 'category_id'**
→ Você está usando schema antigo. Execute a migração.

#### **Erro: Cannot add foreign key constraint**
→ Certifique-se que todas as categorias existem antes de migrar.

#### **Erro: Incorrect JSON value**
→ Campo imagens deve ser array válido: `["url1", "url2"]`

---

### 📚 Arquivos Relacionados

- `schema_optimized.sql` - Schema completo otimizado
- `migrate_to_optimized_schema.sql` - Migração de BD existente
- `models/Product.ts` - Modelo atualizado com category_id
- `models/User.ts` - Modelo atualizado com n_telemovel
- `routes/products.ts` - Rotas atualizadas

---

**Tudo otimizado e pronto para produção! 🎉**
