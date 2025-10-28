-- ============================================================================
-- MIGRAÇÃO PARA SCHEMA OTIMIZADO
-- ============================================================================
-- Este script migra a base de dados existente para a versão otimizada
-- IMPORTANTE: Faça BACKUP antes de executar!
-- ============================================================================

USE arte_em_ponto;

-- ============================================================================
-- PASSO 1: Adicionar campo n_telemovel à tabela users
-- ============================================================================
ALTER TABLE users
ADD COLUMN IF NOT EXISTS n_telemovel VARCHAR(20) NULL COMMENT 'Número de telemóvel (formato: +351 XXX XXX XXX)'
AFTER name;

-- ============================================================================
-- PASSO 2: Otimizar tipos de dados da tabela users
-- ============================================================================
ALTER TABLE users
  MODIFY COLUMN id INT UNSIGNED AUTO_INCREMENT,
  MODIFY COLUMN email VARCHAR(100) NOT NULL,
  MODIFY COLUMN name VARCHAR(100) NOT NULL,
  MODIFY COLUMN role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  MODIFY COLUMN status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
  MODIFY COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  MODIFY COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Adicionar índice no status se não existir
CREATE INDEX IF NOT EXISTS idx_status ON users(status);

-- ============================================================================
-- PASSO 3: Otimizar tipos de dados da tabela categories
-- ============================================================================
ALTER TABLE categories
  MODIFY COLUMN id TINYINT UNSIGNED AUTO_INCREMENT COMMENT 'ID da categoria (1-255)',
  MODIFY COLUMN name VARCHAR(50) NOT NULL UNIQUE,
  MODIFY COLUMN slug VARCHAR(60) NOT NULL UNIQUE,
  MODIFY COLUMN description VARCHAR(500) NULL,
  MODIFY COLUMN image VARCHAR(255) NULL,
  MODIFY COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- ============================================================================
-- PASSO 4: Adicionar campo category_id à tabela products
-- ============================================================================
-- Adicionar nova coluna category_id
ALTER TABLE products
ADD COLUMN IF NOT EXISTS category_id TINYINT UNSIGNED NULL COMMENT 'ID da categoria'
AFTER price;

-- Criar mapeamento de categorias (string) para IDs
-- Atualizar category_id baseado no valor antigo de category (string)
UPDATE products p
SET p.category_id = (
  SELECT c.id
  FROM categories c
  WHERE c.name = p.category OR c.slug = p.category
  LIMIT 1
)
WHERE p.category_id IS NULL;

-- Se ainda houver produtos sem category_id, definir para "Outros"
UPDATE products p
SET p.category_id = (SELECT id FROM categories WHERE slug = 'outros' LIMIT 1)
WHERE p.category_id IS NULL;

-- Tornar category_id NOT NULL agora que todos têm valor
ALTER TABLE products
MODIFY COLUMN category_id TINYINT UNSIGNED NOT NULL;

-- Adicionar Foreign Key
ALTER TABLE products
ADD CONSTRAINT fk_product_category
FOREIGN KEY (category_id) REFERENCES categories(id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- ============================================================================
-- PASSO 5: Remover coluna antiga category (string)
-- ============================================================================
-- ⚠️  CUIDADO: Isto remove permanentemente a coluna category
-- Descomente a linha abaixo APENAS após confirmar que category_id está OK
-- ALTER TABLE products DROP COLUMN category;

-- ============================================================================
-- PASSO 6: Otimizar tipos de dados da tabela products
-- ============================================================================
ALTER TABLE products
  MODIFY COLUMN id INT UNSIGNED AUTO_INCREMENT,
  MODIFY COLUMN name VARCHAR(100) NOT NULL,
  MODIFY COLUMN price DECIMAL(8,2) NOT NULL,
  MODIFY COLUMN image VARCHAR(255) NOT NULL,
  MODIFY COLUMN stock SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  MODIFY COLUMN featured BOOLEAN NOT NULL DEFAULT FALSE,
  MODIFY COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  MODIFY COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Alterar campo imagens para JSON nativo (MySQL 5.7+)
ALTER TABLE products
MODIFY COLUMN imagens JSON NULL COMMENT 'Array JSON de imagens adicionais';

-- Adicionar índice composto para queries comuns
CREATE INDEX IF NOT EXISTS idx_category_featured ON products(category_id, featured);
CREATE INDEX IF NOT EXISTS idx_price ON products(price);

-- ============================================================================
-- PASSO 7: Otimizar tipos de dados da tabela orders
-- ============================================================================
ALTER TABLE orders
  MODIFY COLUMN id INT UNSIGNED AUTO_INCREMENT,
  MODIFY COLUMN user_id INT UNSIGNED NULL,
  MODIFY COLUMN customer_name VARCHAR(100) NOT NULL,
  MODIFY COLUMN customer_email VARCHAR(100) NOT NULL,
  MODIFY COLUMN customer_phone VARCHAR(20) NOT NULL,
  MODIFY COLUMN customer_address VARCHAR(200) NOT NULL,
  MODIFY COLUMN customer_city VARCHAR(60) NOT NULL,
  MODIFY COLUMN customer_postal_code VARCHAR(10) NOT NULL,
  MODIFY COLUMN total DECIMAL(10,2) NOT NULL,
  MODIFY COLUMN status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  MODIFY COLUMN payment_method VARCHAR(30) NOT NULL,
  MODIFY COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  MODIFY COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Adicionar índice composto
CREATE INDEX IF NOT EXISTS idx_status_created ON orders(status, created_at);
CREATE INDEX IF NOT EXISTS idx_customer_email ON orders(customer_email);

-- ============================================================================
-- PASSO 8: Otimizar tipos de dados da tabela order_items
-- ============================================================================
ALTER TABLE order_items
  MODIFY COLUMN id INT UNSIGNED AUTO_INCREMENT,
  MODIFY COLUMN order_id INT UNSIGNED NOT NULL,
  MODIFY COLUMN product_id INT UNSIGNED NOT NULL,
  MODIFY COLUMN quantity SMALLINT UNSIGNED NOT NULL,
  MODIFY COLUMN price DECIMAL(8,2) NOT NULL;

-- ============================================================================
-- PASSO 9: Verificar migração
-- ============================================================================
-- Verificar estrutura das tabelas
SELECT 'Estrutura USERS:' as Info;
DESCRIBE users;

SELECT 'Estrutura CATEGORIES:' as Info;
DESCRIBE categories;

SELECT 'Estrutura PRODUCTS:' as Info;
DESCRIBE products;

SELECT 'Estrutura ORDERS:' as Info;
DESCRIBE orders;

SELECT 'Estrutura ORDER_ITEMS:' as Info;
DESCRIBE order_items;

-- Verificar Foreign Keys
SELECT
  TABLE_NAME,
  CONSTRAINT_NAME,
  REFERENCED_TABLE_NAME,
  REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'arte_em_ponto'
  AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Verificar se todos os produtos têm category_id válido
SELECT
  'Produtos sem category_id válido:' as Info,
  COUNT(*) as total
FROM products
WHERE category_id IS NULL OR category_id NOT IN (SELECT id FROM categories);

-- Listar produtos com categorias
SELECT
  p.id,
  p.name,
  p.category_id,
  c.name as category_name,
  c.slug as category_slug
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LIMIT 10;

-- ============================================================================
-- PASSO 10: Adicionar comentários às tabelas
-- ============================================================================
ALTER TABLE users COMMENT='Utilizadores do sistema (clientes e administradores)';
ALTER TABLE categories COMMENT='Categorias de produtos';
ALTER TABLE products COMMENT='Produtos da loja';
ALTER TABLE orders COMMENT='Pedidos de clientes';
ALTER TABLE order_items COMMENT='Itens de cada pedido';

-- ============================================================================
-- MIGRAÇÃO CONCLUÍDA!
-- ============================================================================
SELECT '✅ Migração concluída com sucesso!' as Status;
SELECT 'IMPORTANTE: Reveja os resultados acima antes de prosseguir' as Aviso;
SELECT 'Se tudo estiver OK, descomente a linha para remover a coluna "category"' as ProximoPasso;

-- ============================================================================
-- ROLLBACK (Em caso de problemas)
-- ============================================================================
-- Se algo correr mal, pode fazer rollback:
--
-- 1. Restaurar backup
-- 2. Ou reverter manualmente:
--
-- ALTER TABLE products DROP FOREIGN KEY fk_product_category;
-- ALTER TABLE products DROP COLUMN category_id;
-- ALTER TABLE users DROP COLUMN n_telemovel;
--
-- ============================================================================
