-- ============================================================================
-- ARTE EM PONTO - Optimized Database Schema
-- ============================================================================
-- Versão otimizada com:
-- - Normalização 3NF (category_id em vez de category string)
-- - Tipos de dados otimizados para performance e storage
-- - Foreign Keys com constraints apropriadas
-- - Índices estratégicos
-- - Campo n_telemovel adicionado a users
-- ============================================================================

CREATE DATABASE IF NOT EXISTS arte_em_ponto CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE arte_em_ponto;

-- ============================================================================
-- USERS TABLE
-- ============================================================================
-- Armazena utilizadores (customers e admins)
-- Otimizações:
-- - VARCHAR tamanhos otimizados
-- - n_telemovel adicionado
-- - Índices em campos frequentemente consultados
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE COMMENT 'Email do utilizador',
  password VARCHAR(255) NOT NULL COMMENT 'Password hash (bcrypt)',
  name VARCHAR(100) NOT NULL COMMENT 'Nome completo',
  n_telemovel VARCHAR(20) NULL COMMENT 'Número de telemóvel (formato: +351 XXX XXX XXX)',
  role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer' COMMENT 'Tipo de utilizador',
  status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active' COMMENT 'Estado da conta',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Utilizadores do sistema (clientes e administradores)';

-- ============================================================================
-- CATEGORIES TABLE
-- ============================================================================
-- Categorias de produtos
-- Otimizações:
-- - TINYINT UNSIGNED para id (suporta até 255 categorias)
-- - slug: identificador URL-friendly único (ex: "toalhas-bordadas")
-- - Usado para URLs amigáveis: /shop/toalhas-bordadas
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
  id TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID da categoria (1-255)',
  name VARCHAR(50) NOT NULL UNIQUE COMMENT 'Nome da categoria',
  slug VARCHAR(60) NOT NULL UNIQUE COMMENT 'URL-friendly identifier (ex: toalhas-bordadas)',
  description VARCHAR(500) NULL COMMENT 'Descrição da categoria',
  image VARCHAR(255) NULL COMMENT 'URL da imagem da categoria',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_slug (slug),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Categorias de produtos';

-- ============================================================================
-- PRODUCTS TABLE
-- ============================================================================
-- Produtos da loja
-- Otimizações:
-- - INT UNSIGNED para id (suporta 4 bilhões de produtos)
-- - SMALLINT UNSIGNED para stock (0-65535)
-- - DECIMAL(8,2) para price (até 999999.99€)
-- - category_id: Foreign Key para categories (3NF)
-- - imagens: JSON array de imagens adicionais
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL COMMENT 'Nome do produto',
  description TEXT NOT NULL COMMENT 'Descrição detalhada',
  price DECIMAL(8,2) NOT NULL COMMENT 'Preço em euros (máx: 999999.99)',
  category_id TINYINT UNSIGNED NOT NULL COMMENT 'ID da categoria',
  image VARCHAR(255) NOT NULL COMMENT 'URL da imagem principal',
  imagens JSON NULL COMMENT 'Array JSON de imagens adicionais ["url1","url2",...]',
  stock SMALLINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Quantidade em stock (0-65535)',
  featured BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Produto em destaque?',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_product_category FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  INDEX idx_category_id (category_id),
  INDEX idx_featured (featured),
  INDEX idx_stock (stock),
  INDEX idx_price (price),
  INDEX idx_created_at (created_at),
  INDEX idx_category_featured (category_id, featured) COMMENT 'Composite index para queries comuns'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Produtos da loja';

-- ============================================================================
-- ORDERS TABLE
-- ============================================================================
-- Pedidos de clientes
-- Otimizações:
-- - INT UNSIGNED para ids
-- - DECIMAL(10,2) para total (até 99.999.999,99€)
-- - VARCHAR otimizados para dados do cliente
-- - user_id pode ser NULL (compras de visitantes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL COMMENT 'ID do utilizador (NULL se guest)',
  customer_name VARCHAR(100) NOT NULL COMMENT 'Nome do cliente',
  customer_email VARCHAR(100) NOT NULL COMMENT 'Email do cliente',
  customer_phone VARCHAR(20) NOT NULL COMMENT 'Telemóvel do cliente',
  customer_address VARCHAR(200) NOT NULL COMMENT 'Morada completa',
  customer_city VARCHAR(60) NOT NULL COMMENT 'Cidade',
  customer_postal_code VARCHAR(10) NOT NULL COMMENT 'Código postal (XXXX-XXX)',
  total DECIMAL(10,2) NOT NULL COMMENT 'Valor total do pedido',
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  payment_method VARCHAR(30) NOT NULL COMMENT 'Método de pagamento',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_order_user FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_customer_email (customer_email),
  INDEX idx_status_created (status, created_at) COMMENT 'Para dashboard admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Pedidos de clientes';

-- ============================================================================
-- ORDER_ITEMS TABLE
-- ============================================================================
-- Itens de cada pedido
-- Otimizações:
-- - INT UNSIGNED para ids
-- - SMALLINT UNSIGNED para quantity (0-65535)
-- - DECIMAL(8,2) para price (snapshot do preço no momento da compra)
-- - ON DELETE CASCADE: eliminar items quando order é eliminada
-- - ON DELETE RESTRICT: não permitir eliminar produto se tiver orders
-- ============================================================================
CREATE TABLE IF NOT EXISTS order_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id INT UNSIGNED NOT NULL COMMENT 'ID do pedido',
  product_id INT UNSIGNED NOT NULL COMMENT 'ID do produto',
  quantity SMALLINT UNSIGNED NOT NULL COMMENT 'Quantidade comprada',
  price DECIMAL(8,2) NOT NULL COMMENT 'Preço unitário (snapshot)',

  CONSTRAINT fk_orderitem_order FOREIGN KEY (order_id)
    REFERENCES orders(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_orderitem_product FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  INDEX idx_order_id (order_id),
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Itens de cada pedido';

-- ============================================================================
-- SEED DATA - Categorias Reais
-- ============================================================================
INSERT INTO categories (name, slug, description, image) VALUES
('Carteiras', 'carteiras', 'Carteiras únicas em crochê', 'https://scontent.cdninstagram.com/v/t51.82787-15/572064921_17864228973493048_7979237642739787165_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc1MTE2Mzk5OTUxMDM0NDEwNA%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5oZHIuQzMifQ%3D%3D&_nc_ohc=WRfwoE9rmd0Q7kNvwGcauXI&_nc_oc=AdnawOWgX2D1TUOAGNtwIIXmTWMKD4QtXwPMqEc1ExB5hh0fhnnw-A4aomB8jtAzATw&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=scontent.cdninstagram.com&_nc_gid=LMg7ijws85AR90FvUyOd-w&oh=00_AffSirwGyApyy-OisKE8S2ByJeEMtWZ_6kOmWPcfRvM9Tw&oe=6903495E'),
('Acessórios', 'acessorios', 'Peças únicas em crochê', 'https://scontent.cdninstagram.com/v/t51.82787-15/572064921_17864228973493048_7979237642739787165_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc1MTE2Mzk5OTUxMDM0NDEwNA%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5oZHIuQzMifQ%3D%3D&_nc_ohc=WRfwoE9rmd0Q7kNvwGcauXI&_nc_oc=AdnawOWgX2D1TUOAGNtwIIXmTWMKD4QtXwPMqEc1ExB5hh0fhnnw-A4aomB8jtAzATw&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=scontent.cdninstagram.com&_nc_gid=LMg7ijws85AR90FvUyOd-w&oh=00_AffSirwGyApyy-OisKE8S2ByJeEMtWZ_6kOmWPcfRvM9Tw&oe=6903495E'),
('Terços', 'tercos', 'Peças únicas em crochê', 'https://scontent.cdninstagram.com/v/t51.82787-15/572064921_17864228973493048_7979237642739787165_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc1MTE2Mzk5OTUxMDM0NDEwNA%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5oZHIuQzMifQ%3D%3D&_nc_ohc=WRfwoE9rmd0Q7kNvwGcauXI&_nc_oc=AdnawOWgX2D1TUOAGNtwIIXmTWMKD4QtXwPMqEc1ExB5hh0fhnnw-A4aomB8jtAzATw&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=scontent.cdninstagram.com&_nc_gid=LMg7ijws85AR90FvUyOd-w&oh=00_AffSirwGyApyy-OisKE8S2ByJeEMtWZ_6kOmWPcfRvM9Tw&oe=6903495E'),
('Roupa', 'roupa', 'Peças únicas em crochê', 'https://scontent.cdninstagram.com/v/t51.82787-15/572064921_17864228973493048_7979237642739787165_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc1MTE2Mzk5OTUxMDM0NDEwNA%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5oZHIuQzMifQ%3D%3D&_nc_ohc=WRfwoE9rmd0Q7kNvwGcauXI&_nc_oc=AdnawOWgX2D1TUOAGNtwIIXmTWMKD4QtXwPMqEc1ExB5hh0fhnnw-A4aomB8jtAzATw&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=scontent.cdninstagram.com&_nc_gid=LMg7ijws85AR90FvUyOd-w&oh=00_AffSirwGyApyy-OisKE8S2ByJeEMtWZ_6kOmWPcfRvM9Tw&oe=6903495E')
ON DUPLICATE KEY UPDATE name=name;

-- ============================================================================
-- SEED DATA - Produtos Reais
-- ============================================================================
-- Produtos reais usando category_id (FK) e imagens JSON
INSERT INTO products (name, description, price, category_id, image, imagens, stock, featured) VALUES
(
  'Red Perla',
  'Exclusiva. Atemporal. Feita para brilhar com contigo!✨',
  0.00,
  1, -- Carteiras
  'https://scontent.cdninstagram.com/v/t51.82787-15/572064921_17864228973493048_7979237642739787165_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc1MTE2Mzk5OTUxMDM0NDEwNA%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5oZHIuQzMifQ%3D%3D&_nc_ohc=WRfwoE9rmd0Q7kNvwGcauXI&_nc_oc=AdnawOWgX2D1TUOAGNtwIIXmTWMKD4QtXwPMqEc1ExB5hh0fhnnw-A4aomB8jtAzATw&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=scontent.cdninstagram.com&_nc_gid=LMg7ijws85AR90FvUyOd-w&oh=00_AffSirwGyApyy-OisKE8S2ByJeEMtWZ_6kOmWPcfRvM9Tw&oe=6903495E',
  JSON_ARRAY(
    'https://scontent.cdninstagram.com/v/t51.82787-15/572064921_17864228973493048_7979237642739787165_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc1MTE2Mzk5OTUxMDM0NDEwNA%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5oZHIuQzMifQ%3D%3D&_nc_ohc=WRfwoE9rmd0Q7kNvwGcauXI&_nc_oc=AdnawOWgX2D1TUOAGNtwIIXmTWMKD4QtXwPMqEc1ExB5hh0fhnnw-A4aomB8jtAzATw&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=scontent.cdninstagram.com&_nc_gid=LMg7ijws85AR90FvUyOd-w&oh=00_AffSirwGyApyy-OisKE8S2ByJeEMtWZ_6kOmWPcfRvM9Tw&oe=6903495E',
    'https://scontent.cdninstagram.com/v/t51.82787-15/570859846_17864229018493048_2816922628920293927_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc1MTE2Mzk5OTQ4NTE5NDMyOQ%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5oZHIuQzMifQ%3D%3D&_nc_ohc=UwGnMTu28-AQ7kNvwGfgJZM&_nc_oc=Adm3WM2Epz9JFTpHY2sTLzhEpgnwgthCTTqdJ6dqVNm2ER_tIzKyOjlmE7C8hgZbibI&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=scontent.cdninstagram.com&_nc_gid=LMg7ijws85AR90FvUyOd-w&oh=00_Afd67iTGKiGW0W5IO68tCuNzuwPgja9mUw-IRxF_a_keGQ&oe=69032BAB',
    'https://scontent.cdninstagram.com/v/t51.82787-15/570200481_17864229051493048_1105992910835487228_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=103&ig_cache_key=Mzc1MTE2NDAwMDcxODMxNTA2NA%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5oZHIuQzMifQ%3D%3D&_nc_ohc=nq3c5Feel6wQ7kNvwH-Ykfr&_nc_oc=AdkGYqunGrNqir2Sxc08G8Ta9iY9KC6pRzsxrVvfCJS4vsJYbgjHOq6V3GxT4zh3C-o&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=scontent.cdninstagram.com&_nc_gid=LMg7ijws85AR90FvUyOd-w&oh=00_AffsOXLen7dBgh7hAnpsmpyYzAJhQnFFZpJAIwsLQXMI7Q&oe=690349FD'
  ),
  10,
  TRUE
),
(
  'Bolsa Chocolate 🍫',
  'Mas quem é que consegue resistir? 😋',
  0.00,
  1, -- Carteiras
  'https://scontent.cdninstagram.com/v/t51.82787-15/567628441_17863835031493048_4828064288014291491_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=101&ig_cache_key=Mzc0ODUwODI1MzMzMzI2MDM2OA%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5oZHIuQzMifQ%3D%3D&_nc_ohc=0l2IsDNnq00Q7kNvwGKi5vf&_nc_oc=AdkQfYtj14fw-xmalhfuKXZOS8H0qJueVt7BgfyectnCnY1LyRgcX2-rtRkF4445RL8&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=scontent.cdninstagram.com&_nc_gid=Tn3r_Qqsie9ws4MLPq_jSA&oh=00_AfcqbqQSoJOl_StgXOZNxVOwY0E6boizgTn-m8fE60zZEg&oe=69056BA7',
  JSON_ARRAY(
    'https://scontent.cdninstagram.com/v/t51.82787-15/567628441_17863835031493048_4828064288014291491_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=101&ig_cache_key=Mzc0ODUwODI1MzMzMzI2MDM2OA%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5oZHIuQzMifQ%3D%3D&_nc_ohc=0l2IsDNnq00Q7kNvwGKi5vf&_nc_oc=AdkQfYtj14fw-xmalhfuKXZOS8H0qJueVt7BgfyectnCnY1LyRgcX2-rtRkF4445RL8&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=scontent.cdninstagram.com&_nc_gid=Tn3r_Qqsie9ws4MLPq_jSA&oh=00_AfcqbqQSoJOl_StgXOZNxVOwY0E6boizgTn-m8fE60zZEg&oe=69056BA7',
    'https://scontent.cdninstagram.com/v/t51.82787-15/567622612_17863835052493048_2593931618051327113_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc0ODUwODI1MzA1NjQzNTAyNg%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTkyMC5oZHIuQzMifQ%3D%3D&_nc_ohc=_0oEwSZtN_cQ7kNvwHqX1Qo&_nc_oc=Adnh1EG01Dt8IaLiIwGXbMjGQ53SFUTNspcs_HRuqbKqpnnVh5FbKX20ZQQxsHEQD6I&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&se=-1&_nc_ht=scontent.cdninstagram.com&_nc_gid=Tn3r_Qqsie9ws4MLPq_jSA&oh=00_AfeDxCPpogvh0yzenRpmTiCzNikrSACIRDuqVE2EBR-dxw&oe=69053F46'
  ),
  15,
  FALSE
)
ON DUPLICATE KEY UPDATE name=name;

-- ============================================================================
-- EXPLICAÇÃO: O que é SLUG?
-- ============================================================================
-- SLUG é um identificador URL-friendly único usado para criar URLs amigáveis.
--
-- Exemplo SEM slug:
--   /produtos?categoria=1
--   /produtos?categoria=2
--
-- Exemplo COM slug:
--   /produtos/toalhas
--   /produtos/guardanapos
--   /produtos/panos-cozinha
--
-- Benefícios:
--   ✅ SEO melhorado (Google prefere URLs descritivas)
--   ✅ URLs mais legíveis para utilizadores
--   ✅ Melhor experiência de partilha
--   ✅ Independente do ID (pode mudar sem quebrar links)
--
-- Regras de criação:
--   - Apenas letras minúsculas, números e hífens
--   - Sem espaços, acentos ou caracteres especiais
--   - Único na tabela
--   - Exemplo: "Panos de Cozinha" → "panos-cozinha"
-- ============================================================================

-- ============================================================================
-- OTIMIZAÇÕES IMPLEMENTADAS
-- ============================================================================
--
-- 1. NORMALIZAÇÃO 3NF
--    ✅ category VARCHAR(255) → category_id TINYINT UNSIGNED
--    ✅ Reduz redundância e garante integridade referencial
--    ✅ Economiza storage: VARCHAR(255) = até 255 bytes vs TINYINT = 1 byte
--
-- 2. TIPOS DE DADOS OTIMIZADOS
--    ✅ INT → INT UNSIGNED (dobra o range positivo)
--    ✅ VARCHAR(255) → VARCHAR(100) onde apropriado
--    ✅ stock: INT → SMALLINT UNSIGNED (0-65535 é suficiente)
--    ✅ price: DECIMAL(10,2) → DECIMAL(8,2) (até 999.999,99€)
--    ✅ category id: INT → TINYINT UNSIGNED (255 categorias)
--
-- 3. ÍNDICES ESTRATÉGICOS
--    ✅ Índices simples em campos frequentemente consultados
--    ✅ Índices compostos para queries comuns (category_id + featured)
--    ✅ Índices em Foreign Keys para JOINs eficientes
--
-- 4. FOREIGN KEYS COM CONSTRAINTS
--    ✅ ON DELETE CASCADE: order_items apagados quando order é apagada
--    ✅ ON DELETE RESTRICT: produto não pode ser apagado se tiver orders
--    ✅ ON DELETE SET NULL: order mantém-se se user é apagado
--    ✅ ON UPDATE CASCADE: mudanças propagam automaticamente
--
-- 5. STORAGE EFFICIENCY
--    ✅ JSON em vez de LONGTEXT para imagens (nativo MySQL 5.7+)
--    ✅ UNSIGNED elimina valores negativos desnecessários
--    ✅ VARCHAR dimensionados adequadamente
--    ✅ ENUM para campos com valores fixos
--
-- 6. MELHORIAS FUNCIONAIS
--    ✅ Campo n_telemovel adicionado a users
--    ✅ Comentários em todas as colunas
--    ✅ Validações via constraints
--    ✅ Timestamps automáticos
--
-- ============================================================================

-- ============================================================================
-- COMPARAÇÃO DE STORAGE (por registro)
-- ============================================================================
--
-- PRODUCTS TABLE - Antes vs Depois:
--
-- Antes (não normalizado):
--   category VARCHAR(255) = até 255 bytes
--   stock INT             = 4 bytes
--   Total                 = 259 bytes (só estes 2 campos)
--
-- Depois (normalizado + otimizado):
--   category_id TINYINT UNSIGNED = 1 byte
--   stock SMALLINT UNSIGNED      = 2 bytes
--   Total                        = 3 bytes (só estes 2 campos)
--
-- Economia: 256 bytes por produto!
-- Com 1000 produtos: ~250KB economizados só nestes campos
--
-- ============================================================================

-- ============================================================================
-- VERIFICAÇÃO DO SCHEMA
-- ============================================================================
-- Execute estes comandos para verificar o schema:

-- Ver todas as tabelas
SHOW TABLES;

-- Ver estrutura de cada tabela
DESCRIBE users;
DESCRIBE categories;
DESCRIBE products;
DESCRIBE orders;
DESCRIBE order_items;

-- Ver Foreign Keys
SELECT
  TABLE_NAME,
  CONSTRAINT_NAME,
  REFERENCED_TABLE_NAME,
  REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'arte_em_ponto'
  AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Ver índices
SHOW INDEX FROM products;

-- ============================================================================
