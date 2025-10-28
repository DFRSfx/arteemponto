# Models Documentation

Esta pasta contém os modelos de dados (Data Access Layer) para a aplicação Arte em Ponto.

## Estrutura

- **Category.ts** - Modelo para categorias de produtos
- **Product.ts** - Modelo para produtos (com suporte a múltiplas imagens em JSON)
- **User.ts** - Modelo para usuários e autenticação
- **Order.ts** - Modelo para pedidos
- **OrderItem.ts** - Modelo para itens de pedidos
- **index.ts** - Exporta todos os modelos e tipos

## Uso dos Modelos

### Category Model

```typescript
import { CategoryModel } from './models';

// Buscar todas as categorias
const categories = await CategoryModel.findAll();

// Buscar por ID
const category = await CategoryModel.findById(1);

// Buscar por slug
const category = await CategoryModel.findBySlug('toalhas');

// Criar categoria
const categoryId = await CategoryModel.create({
  name: 'Nova Categoria',
  slug: 'nova-categoria',
  description: 'Descrição da categoria',
  image: 'https://example.com/image.jpg'
});

// Atualizar categoria
await CategoryModel.update(1, {
  name: 'Categoria Atualizada'
});

// Deletar categoria
await CategoryModel.delete(1);
```

### Product Model

O modelo Product inclui suporte especial para o campo `imagens`, que armazena um array JSON de URLs ou base64 de imagens adicionais.

```typescript
import { ProductModel } from './models';

// Criar produto com múltiplas imagens
const productId = await ProductModel.create({
  name: 'Toalha Bordada',
  description: 'Linda toalha com bordado artesanal',
  price: 45.90,
  category: 'Toalhas',
  image: 'https://example.com/main-image.jpg', // Imagem principal
  imagens: [ // Array de imagens adicionais
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'data:image/jpeg;base64,/9j/4AAQSkZJRg...' // Base64 também é suportado
  ],
  stock: 10,
  featured: true
});

// Buscar produto (automaticamente parseia o JSON de imagens)
const product = await ProductModel.findById(1);
console.log(product.imagens); // Array de strings

// Buscar com filtros
const products = await ProductModel.findAll({
  category: 'Toalhas',
  featured: true,
  minPrice: 20,
  maxPrice: 100,
  search: 'bordado',
  inStock: true
});

// Atualizar produto (incluindo imagens)
await ProductModel.update(1, {
  price: 49.90,
  imagens: ['url1.jpg', 'url2.jpg', 'url3.jpg']
});

// Atualizar estoque
await ProductModel.updateStock(1, -1); // Decrementa 1
await ProductModel.updateStock(1, 5);  // Adiciona 5
```

### User Model

```typescript
import { UserModel } from './models';

// Criar usuário (senha é automaticamente hashada)
const userId = await UserModel.create({
  email: 'user@example.com',
  password: 'senha123',
  name: 'João Silva',
  role: 'customer', // ou 'admin'
  status: 'active'
});

// Buscar usuário
const user = await UserModel.findByEmail('user@example.com');

// Verificar senha
const isValid = await UserModel.verifyPassword('senha123', user.password);

// Atualizar senha
await UserModel.updatePassword(1, 'novaSenha123');

// Obter usuário sem campo password
const safeUser = await UserModel.getSafeUser(user);
```

### Order Model

```typescript
import { OrderModel } from './models';

// Criar pedido
const orderId = await OrderModel.create({
  user_id: 1,
  customer_name: 'João Silva',
  customer_email: 'joao@example.com',
  customer_phone: '123456789',
  customer_address: 'Rua Exemplo, 123',
  customer_city: 'Lisboa',
  customer_postal_code: '1000-000',
  total: 99.90,
  status: 'pending',
  payment_method: 'credit_card'
});

// Buscar pedido com itens
const order = await OrderModel.findByIdWithItems(1);
console.log(order.items); // Array de OrderItems

// Atualizar status
await OrderModel.updateStatus(1, 'processing');

// Buscar pedidos por filtros
const orders = await OrderModel.findAll({
  status: 'pending',
  user_id: 1,
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-12-31')
});

// Calcular receita total
const revenue = await OrderModel.getTotalRevenue({
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-12-31')
});
```

### OrderItem Model

```typescript
import { OrderItemModel } from './models';

// Criar item de pedido
const itemId = await OrderItemModel.create({
  order_id: 1,
  product_id: 5,
  quantity: 2,
  price: 45.90
});

// Criar múltiplos itens de uma vez
await OrderItemModel.createBulk([
  { order_id: 1, product_id: 1, quantity: 2, price: 45.90 },
  { order_id: 1, product_id: 2, quantity: 1, price: 29.90 }
]);

// Buscar itens de um pedido (com informações do produto)
const items = await OrderItemModel.findByOrderId(1);

// Calcular total do pedido
const total = await OrderItemModel.getOrderTotal(1);

// Produtos mais vendidos
const bestSellers = await OrderItemModel.getBestSellingProducts(10);
```

## Campo Imagens em JSON

O campo `imagens` na tabela `products` é do tipo `LONGTEXT` e armazena um array JSON de strings.

### Estrutura no Banco de Dados

```sql
imagens LONGTEXT NULL DEFAULT NULL COMMENT 'JSON array of additional product images (base64 or URLs)'
```

### Exemplo de dados armazenados

```json
["https://example.com/image1.jpg", "https://example.com/image2.jpg", "data:image/jpeg;base64,..."]
```

### Funcionamento Automático

Os modelos Product fazem o parsing automático:
- **Ao inserir**: Converte array JavaScript para string JSON
- **Ao buscar**: Converte string JSON para array JavaScript
- **Suporta**: URLs (http/https) e imagens em base64

## Migração do Banco de Dados

Se a tabela `products` já existe sem o campo `imagens`, execute a migração:

```bash
mysql -u root -p arte_em_ponto < server/src/database/migrations/add_imagens_to_products.sql
```

## Tipos TypeScript

Todos os modelos exportam interfaces TypeScript para type safety:

```typescript
import type {
  Category,
  CategoryInput,
  Product,
  ProductInput,
  ProductFilters,
  User,
  UserInput,
  SafeUser,
  Order,
  OrderInput,
  OrderWithItems,
  OrderItem,
  OrderItemInput
} from './models';
```

## Boas Práticas

1. **Sempre use os modelos** para acessar o banco de dados
2. **Nunca exponha senhas** - use SafeUser para dados do usuário
3. **Valide dados** antes de chamar os métodos create/update
4. **Use transações** para operações críticas (ex: criar pedido + itens)
5. **Trate erros** apropriadamente em todas as operações de BD

## Dependências

- `mysql2/promise` - Driver MySQL com suporte a Promises
- `bcrypt` - Hash de senhas (UserModel)
- TypeScript - Type safety
