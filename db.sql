-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               12.0.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for arte_em_ponto
CREATE DATABASE IF NOT EXISTS `arte_em_ponto` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `arte_em_ponto`;

-- Dumping structure for table arte_em_ponto.cart_items
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `product_id` int(10) unsigned NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_product` (`user_id`,`product_id`),
  UNIQUE KEY `unique_session_product` (`session_id`,`product_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_product_id` (`product_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_quantity` CHECK (`quantity` > 0),
  CONSTRAINT `chk_user_or_session` CHECK (`user_id` is not null and `session_id` is null or `user_id` is null and `session_id` is not null)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table arte_em_ponto.cart_items: ~4 rows (approximately)
INSERT INTO `cart_items` (`id`, `user_id`, `session_id`, `product_id`, `quantity`, `created_at`, `updated_at`) VALUES
	(35, 15, NULL, 2, 1, '2026-02-28 14:57:49', '2026-02-28 14:57:49'),
	(37, NULL, 'session_1776893248755_kqkzhav93', 2, 1, '2026-04-22 21:27:56', '2026-04-22 21:27:56'),
	(38, 11, NULL, 9, 1, '2026-05-24 17:16:32', '2026-05-24 17:16:32'),
	(39, NULL, 'session_1783118067942_c1za6ntb0', 13, 1, '2026-07-03 22:57:06', '2026-07-03 22:57:06');

-- Dumping structure for table arte_em_ponto.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID da categoria (1-255)',
  `name` varchar(50) NOT NULL COMMENT 'Nome da categoria',
  `slug` varchar(60) NOT NULL COMMENT 'URL-friendly identifier (ex: toalhas-bordadas)',
  `description` varchar(500) DEFAULT NULL COMMENT 'Descrição da categoria',
  `image` varchar(255) DEFAULT NULL COMMENT 'URL da imagem da categoria',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_slug` (`slug`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Categorias de produtos';

-- Dumping data for table arte_em_ponto.categories: ~4 rows (approximately)
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `created_at`) VALUES
	(1, 'Malas', 'malas', 'Malas únicas em crochê', 'https://scontent.cdninstagram.com/v/t51.82787-15/572064921_17864228973493048_7979237642739787165_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc1MTE2Mzk5OTUxMDM0NDEwNA%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4', '2025-10-28 01:00:00'),
	(2, 'Acessórios', 'acessorios', 'Peças únicas em crochê', 'https://scontent.cdninstagram.com/v/t51.82787-15/572064921_17864228973493048_7979237642739787165_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc1MTE2Mzk5OTUxMDM0NDEwNA%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4', '2025-10-28 01:00:00'),
	(3, 'Terços', 'tercos', 'Peças únicas em crochê', 'https://scontent.cdninstagram.com/v/t51.82787-15/572064921_17864228973493048_7979237642739787165_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc1MTE2Mzk5OTUxMDM0NDEwNA%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4', '2025-10-28 01:00:00'),
	(4, 'Roupa', 'roupa', 'Peças únicas em crochê', 'https://scontent.cdninstagram.com/v/t51.82787-15/572064921_17864228973493048_7979237642739787165_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=105&ig_cache_key=Mzc1MTE2Mzk5OTUxMDM0NDEwNA%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4', '2025-10-28 01:00:00');

-- Dumping structure for event arte_em_ponto.cleanup_expired_email_verification_tokens
DELIMITER //
CREATE EVENT `cleanup_expired_email_verification_tokens` ON SCHEDULE EVERY 1 HOUR STARTS '2025-10-28 23:07:29' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM email_verification_tokens 
  WHERE expires_at < NOW() OR is_used = TRUE//
DELIMITER ;

-- Dumping structure for event arte_em_ponto.cleanup_expired_password_tokens
DELIMITER //
CREATE EVENT `cleanup_expired_password_tokens` ON SCHEDULE EVERY 1 HOUR STARTS '2025-10-28 22:51:29' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM password_reset_tokens 
  WHERE expires_at < NOW() OR is_used = TRUE//
DELIMITER ;

-- Dumping structure for event arte_em_ponto.cleanup_expired_verification_tokens
DELIMITER //
CREATE EVENT `cleanup_expired_verification_tokens` ON SCHEDULE EVERY 1 HOUR STARTS '2025-10-28 22:51:29' ON COMPLETION NOT PRESERVE ENABLE DO UPDATE users 
  SET email_verification_token = NULL, 
      email_verification_expires = NULL 
  WHERE email_verification_expires < NOW() 
  AND email_verified = FALSE//
DELIMITER ;

-- Dumping structure for event arte_em_ponto.cleanup_old_password_attempts
DELIMITER //
CREATE EVENT `cleanup_old_password_attempts` ON SCHEDULE EVERY 6 HOUR STARTS '2025-10-28 22:51:29' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM password_reset_attempts 
  WHERE created_at < DATE_SUB(NOW(), INTERVAL 24 HOUR)//
DELIMITER ;

-- Dumping structure for event arte_em_ponto.cleanup_unverified_accounts
DELIMITER //
CREATE EVENT `cleanup_unverified_accounts` ON SCHEDULE EVERY 15 MINUTE STARTS '2025-10-29 00:53:25' ON COMPLETION PRESERVE ENABLE DO DELETE FROM users 
WHERE email_verified = FALSE 
AND created_at < DATE_SUB(NOW(), INTERVAL 1 HOUR)//
DELIMITER ;

-- Dumping structure for table arte_em_ponto.email_verification_tokens
CREATE TABLE IF NOT EXISTS `email_verification_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_used` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `idx_token` (`token`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_expires_at` (`expires_at`),
  CONSTRAINT `email_verification_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table arte_em_ponto.email_verification_tokens: ~0 rows (approximately)

-- Dumping structure for table arte_em_ponto.favorites
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `product_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_product` (`user_id`,`product_id`),
  UNIQUE KEY `unique_session_product` (`session_id`,`product_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_product_id` (`product_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_fav_user_or_session` CHECK (`user_id` is not null and `session_id` is null or `user_id` is null and `session_id` is not null)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table arte_em_ponto.favorites: ~0 rows (approximately)

-- Dumping structure for table arte_em_ponto.hero_slides
CREATE TABLE IF NOT EXISTS `hero_slides` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `button_text` varchar(100) NOT NULL,
  `button_link` varchar(255) NOT NULL,
  `text_color` enum('white','dark') DEFAULT 'white',
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_display_order` (`display_order`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table arte_em_ponto.hero_slides: ~3 rows (approximately)
INSERT INTO `hero_slides` (`id`, `title`, `description`, `button_text`, `button_link`, `text_color`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
	(1, 'Crochê Feito com Amor', 'Peças únicas e exclusivas, criadas à mão com técnicas tradicionais e materiais de qualidade premium.', 'Explorar      \r\n  Coleção', '/loja', 'white', 1, 1, '2025-10-29 16:20:59', '2025-11-22 15:24:11'),
	(2, 'Novidades da Temporada', 'Descubra as últimas criações do nosso ateliê. Designs exclusivos que combinam tradição e modernidade.', 'Ver Novidades', '/loja?filter=new', 'white', 2, 1, '2025-10-29 16:20:59', '2025-11-22 15:24:28'),
	(3, 'Qualidade Garantida', 'Cada peça é única e cuidadosamente trabalhada. Cores vibrantes, acabamentos perfeitos e durabilidade.', 'Produtos em    \r\n   Destaque', '/loja?filter=featured', 'white', 3, 1, '2025-10-29 16:20:59', '2025-11-22 15:18:21');

-- Dumping structure for table arte_em_ponto.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tracking_token` varchar(64) DEFAULT NULL COMMENT 'Token único para tracking por guests',
  `user_id` int(10) unsigned DEFAULT NULL COMMENT 'ID do utilizador (NULL se guest)',
  `customer_name` varchar(100) NOT NULL COMMENT 'Nome do cliente',
  `customer_email` varchar(100) NOT NULL COMMENT 'Email do cliente',
  `customer_phone` varchar(20) NOT NULL COMMENT 'Telemóvel do cliente',
  `customer_address` varchar(200) NOT NULL COMMENT 'Morada completa',
  `customer_city` varchar(60) NOT NULL COMMENT 'Cidade',
  `customer_postal_code` varchar(10) NOT NULL COMMENT 'Código postal (XXXX-XXX)',
  `total` decimal(10,2) NOT NULL COMMENT 'Valor total do pedido',
  `status` enum('pending','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `payment_status` enum('pending','paid','failed','expired') NOT NULL DEFAULT 'pending',
  `payment_method` varchar(30) NOT NULL COMMENT 'Método de pagamento',
  `payment_reference` varchar(50) DEFAULT NULL COMMENT 'Referência Multibanco ou MB WAY transaction ID',
  `payment_entity` varchar(10) DEFAULT NULL COMMENT 'Entidade Multibanco',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `payment_intent_id` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_tracking_token` (`tracking_token`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_customer_email` (`customer_email`),
  KEY `idx_status_created` (`status`,`created_at`) COMMENT 'Para dashboard admin',
  KEY `idx_payment_status` (`payment_status`),
  KEY `idx_customer_email_tracking` (`customer_email`,`tracking_token`),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Pedidos de clientes';

-- Dumping data for table arte_em_ponto.orders: ~6 rows (approximately)
INSERT INTO `orders` (`id`, `tracking_token`, `user_id`, `customer_name`, `customer_email`, `customer_phone`, `customer_address`, `customer_city`, `customer_postal_code`, `total`, `status`, `payment_status`, `payment_method`, `payment_reference`, `payment_entity`, `created_at`, `updated_at`, `payment_intent_id`) VALUES
	(44, 'ba7cd551968df6a742a9737eedb76b7b7b2e548cd2e9460aa7807e27bccd9ef4', 11, 'Conta Testes', 'dariosoares2005@gmail.com', '919792186', 'Rua de Sermonde nº445', 'Vila Nova de Gaia', '4415-115', 12.30, 'processing', 'paid', 'mbway', NULL, NULL, '2026-02-26 22:29:53', '2026-02-26 22:29:53', 'pi_3T5D3vAekY23uh7L1G7Hc5vC'),
	(45, 'af8b7c862a39e2dfc36db33684c2d0153d194f0a1a6f4975ce85adc6a2574d65', 11, 'Conta Testes', 'dariosoares2005@gmail.com', '919792186', 'Rua de Sermonde nº445', 'Vila Nova de Gaia', '4415-115', 12.30, 'processing', 'paid', 'mbway', NULL, NULL, '2026-02-26 22:43:53', '2026-02-26 22:43:53', 'pi_3T5DHMAekY23uh7L0QEwYgCa'),
	(46, '3f7b0035a5e426aee735531608edec0a43c1760283cc23cc4a397ff3e7d6614f', 11, 'Conta Testes', 'dariosoares2005@gmail.com', '919792186', 'Rua de Sermonde nº445', 'Vila Nova de Gaia', '4415-115', 12.30, 'processing', 'paid', 'mbway', NULL, NULL, '2026-02-26 22:46:02', '2026-02-26 22:46:02', 'pi_3T5DJYAekY23uh7L16Ii7owF'),
	(47, 'bf959843fd70dbd61ebb75fea75ee9e84d591afa98259ac24ad903226d777b8c', 15, 'Dário Soares', 'flexrpbase@gmail.com', '919792186', 'Rua de Sermonde', 'Vila Nova de Gaia', '4444-444', 12.30, 'processing', 'paid', 'mbway', NULL, NULL, '2026-02-27 18:04:18', '2026-02-27 18:04:18', 'pi_3T5VONAekY23uh7L0ydkL7jp'),
	(48, 'cab9786ace59ca43a5cb881d7f6219073e51fca88e7a8275882268c8ad25d1e4', 11, 'Conta Testes', 'dariosoares2005@gmail.com', '919792186', 'Rua de Sermonde nº445', 'Vila Nova de Gaia', '4415-115', 10.00, 'processing', 'paid', 'mbway', NULL, NULL, '2026-02-27 22:35:14', '2026-02-27 22:35:14', 'pi_3T5ZccAekY23uh7L0evMwQX0'),
	(49, 'f69261f446dfa93f04ce6d970bb8203f92057869ba09c44484f54a82094e6387', 11, 'Conta Testes', 'dariosoares2005@gmail.com', '919792186', 'Rua de Sermonde nº445', 'Vila Nova de Gaia', '4415-115', 40.00, 'processing', 'paid', 'mbway', NULL, NULL, '2026-02-28 11:06:51', '2026-02-28 11:06:52', 'pi_3T5lLwAekY23uh7L0GGIFZCS');

-- Dumping structure for table arte_em_ponto.order_items
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int(10) unsigned NOT NULL COMMENT 'ID do pedido',
  `product_id` int(10) unsigned NOT NULL COMMENT 'ID do produto',
  `quantity` smallint(5) unsigned NOT NULL COMMENT 'Quantidade comprada',
  `price` decimal(8,2) NOT NULL COMMENT 'Preço unitário (snapshot)',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_product_id` (`product_id`),
  CONSTRAINT `fk_orderitem_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_orderitem_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Itens de cada pedido';

-- Dumping data for table arte_em_ponto.order_items: ~7 rows (approximately)
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
	(43, 44, 11, 1, 10.00),
	(44, 45, 2, 1, 10.00),
	(45, 46, 11, 1, 10.00),
	(46, 47, 2, 1, 10.00),
	(47, 48, 11, 1, 10.00),
	(48, 49, 11, 2, 10.00),
	(49, 49, 6, 2, 10.00);

-- Dumping structure for table arte_em_ponto.password_reset_attempts
CREATE TABLE IF NOT EXISTS `password_reset_attempts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(45) NOT NULL,
  `email` varchar(255) NOT NULL,
  `attempt_count` int(11) DEFAULT 1,
  `blocked_until` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_ip_email` (`ip_address`,`email`),
  KEY `idx_blocked_until` (`blocked_until`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table arte_em_ponto.password_reset_attempts: ~0 rows (approximately)

-- Dumping structure for table arte_em_ponto.password_reset_tokens
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `attempts` int(11) NOT NULL DEFAULT 0,
  `is_used` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_token_hash` (`token_hash`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_expires_at` (`expires_at`),
  CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table arte_em_ponto.password_reset_tokens: ~0 rows (approximately)

-- Dumping structure for table arte_em_ponto.pending_checkouts
CREATE TABLE IF NOT EXISTS `pending_checkouts` (
  `payment_intent_id` varchar(128) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`payment_intent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table arte_em_ponto.pending_checkouts: ~5 rows (approximately)
INSERT INTO `pending_checkouts` (`payment_intent_id`, `data`, `created_at`) VALUES
	('pi_3T5ZbBAekY23uh7L0UamZYui', '{"customer_name":"Conta Testes","customer_email":"dariosoares2005@gmail.com","customer_phone":"919792186","customer_address":"Rua de Sermonde nº445","customer_city":"Vila Nova de Gaia","customer_postal_code":"4415-115","payment_method":"mbway","items":[{"product_id":11,"quantity":1,"price":10}],"total":12.3,"user_id":11,"save_address":false}', '2026-02-27 22:33:29'),
	('pi_3T5ZbIAekY23uh7L0HgnTh4O', '{"customer_name":"Conta Testes","customer_email":"dariosoares2005@gmail.com","customer_phone":"919792186","customer_address":"Rua de Sermonde nº445","customer_city":"Vila Nova de Gaia","customer_postal_code":"4415-115","payment_method":"mbway","items":[{"product_id":11,"quantity":1,"price":10}],"total":12.3,"user_id":11,"save_address":false}', '2026-02-27 22:33:36'),
	('pi_3T5ZcXAekY23uh7L1ZlXaxhT', '{"customer_name":"Conta Testes","customer_email":"dariosoares2005@gmail.com","customer_phone":"919792186","customer_address":"Rua de Sermonde nº445","customer_city":"Vila Nova de Gaia","customer_postal_code":"4415-115","payment_method":"mbway","items":[{"product_id":11,"quantity":1,"price":10}],"total":10,"user_id":11,"save_address":false}', '2026-02-27 22:34:52'),
	('pi_3TafdiGx0MSWZf6v0tItUeXY', '{"items":[{"product_id":"9","quantity":1,"price":90}],"total":90,"user_id":11,"payment_method":"stripe"}', '2026-05-24 17:16:38'),
	('pi_3TP8K6Gx0MSWZf6v1Asoft6G', '{"customer_name":"qddsada qsda","customer_email":"etste@gmail.com","customer_phone":"3213123123","customer_address":"rua dos carvalhos","customer_city":"porto","customer_postal_code":"4000-000","payment_method":"mbway","items":[{"product_id":2,"quantity":1,"price":90}],"total":90,"user_id":null,"save_address":false}', '2026-04-22 21:28:42'),
	('pi_3TpG1JGx0MSWZf6v1IuDLTcJ', '{"items":[{"product_id":"13","quantity":1,"price":80}],"total":80,"user_id":null,"payment_method":"stripe"}', '2026-07-03 22:57:17');

-- Dumping structure for table arte_em_ponto.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT 'Nome do produto',
  `description` text NOT NULL COMMENT 'Descrição detalhada',
  `price` decimal(8,2) NOT NULL COMMENT 'Preço em euros (máx: 999999.99)',
  `category_id` tinyint(3) unsigned NOT NULL COMMENT 'ID da categoria',
  `stock` smallint(5) unsigned NOT NULL DEFAULT 0 COMMENT 'Quantidade em stock (0-65535)',
  `featured` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Produto em destaque?',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `colors` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Array of available colors for this product' CHECK (json_valid(`colors`)),
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_featured` (`featured`),
  KEY `idx_stock` (`stock`),
  KEY `idx_price` (`price`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_category_featured` (`category_id`,`featured`) COMMENT 'Composite index para queries comuns',
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Produtos da loja';

-- Dumping data for table arte_em_ponto.products: ~34 rows (approximately)
INSERT INTO `products` (`id`, `name`, `description`, `price`, `category_id`, `stock`, `featured`, `created_at`, `updated_at`, `colors`, `images`) VALUES
	(1, 'Red Perla', 'Exclusiva. Atemporal. Feita para brilhar com contigo!✨', 90.00, 1, 15, 0, '2025-10-28 01:00:00', '2026-03-30 17:16:37', '["Vermelho"]', '["/produtos/1/image-1-1.webp","/produtos/1/image-2-1.webp","/produtos/1/image-3-1.webp"]'),
	(2, 'Chocolate ', 'Mas quem é que consegue resistir? 😋', 90.00, 1, 10, 0, '2025-10-28 01:00:00', '2026-05-28 20:11:13', '["Castanho"]', '["/produtos/2/image-1-2.webp","/produtos/2/image-2-2.webp","/produtos/2/image-3-2.webp"]'),
	(5, 'Red Perla Medium', 'O mesmo charme, mas em tamanho médio. ', 80.00, 1, 15, 0, '2025-10-29 02:23:54', '2026-03-30 17:17:00', '["Vermelho"]', '["/produtos/5/image-1-5.webp","/produtos/5/image-2-5.webp","/produtos/5/image-3-5.webp"]'),
	(6, 'Autumn whisper', 'A bolsa do teu outono 🍂 ', 90.00, 1, 11, 0, '2025-10-29 02:28:41', '2026-03-30 17:17:18', '["Castanho"]', '["/produtos/6/image-1-6.webp","/produtos/6/image-2-6.webp"]'),
	(7, 'Aurora Bordeaux', 'Ela rouba a cena por onde passa! 💃\r\nA nova Aurora Bordeaux chegou para dar um toque vibrante ao seu dia a dia.\r\nHá detalhes que fazem a diferença.\r\nGaranta a sua antes que acabe! 🔥', 90.00, 1, 15, 0, '2025-10-29 02:31:01', '2026-03-30 17:17:34', '["Bordô"]', '["/produtos/7/image-1-7.webp","/produtos/7/image-2-7.webp"]'),
	(8, 'Winter Sky', 'Azul, como a elegância deve ser.\r\nFeita à mão, com textura, estilo e um toque artesanal que encanta em cada detalhe. 👜💫', 90.00, 1, 15, 0, '2025-10-29 02:33:20', '2026-05-28 20:11:40', '["Azul"]', '["/produtos/8/image-1-8.webp","/produtos/8/image-2-8.webp","/produtos/8/image-3-8.webp"]'),
	(9, 'Vitória ', 'Textura, estilo e autenticidade: o trio perfeito para qualquer ocasião. ✨\r\nAdquire já a tua.', 90.00, 1, 15, 0, '2025-10-29 02:34:29', '2026-05-28 20:11:58', '["Castanho"]', '["/produtos/9/image-1-9.webp","/produtos/9/image-2-9.webp","/produtos/9/image-3-9.webp"]'),
	(10, 'Cabernet', 'Esta elegante mala combina sofisticação e charme em cada detalhe. Feita à mão com fios de tom vinho, apresenta uma textura trançada que confere um toque único e artesanal. Esta mala é um símbolo de arte, estilo e originalidade.', 100.00, 1, 15, 0, '2025-10-29 02:35:32', '2026-05-28 20:12:17', '["Vermelho"]', '["/produtos/10/image-1-10.webp","/produtos/10/image-2-10.webp","/produtos/10/image-3-10.webp"]'),
	(11, 'Ianna', 'Aquela que combina com TUDO, mas que combina especialmente contigo. 😊', 80.00, 1, 5, 0, '2025-10-29 02:37:24', '2026-05-28 20:13:31', '["Rosa"]', '["/produtos/11/image-1-11.webp","/produtos/11/image-2-11.webp","/produtos/11/image-3-11.webp"]'),
	(12, 'Gris', 'Um acessório perfeito tanto para de dia, como para de noite.\r\nDeslumbra com ela ✨', 80.00, 1, 15, 0, '2025-10-29 02:38:22', '2026-05-28 20:13:11', '["Azul"]', '["/produtos/12/image-1-12.webp","/produtos/12/image-2-12.webp"]'),
	(13, 'Amonet', 'O brilho que precisas na tua vida!! ', 80.00, 1, 15, 0, '2025-10-29 02:39:25', '2026-05-28 20:12:57', '["Vermelho"]', '["/produtos/13/image-1-13.webp","/produtos/13/image-2-13.webp"]'),
	(14, 'Juno', 'A mala que é puro poder no look!', 120.00, 1, 11, 0, '2025-10-29 02:40:14', '2026-05-28 20:12:42', '["Preto"]', '["/produtos/14/image-1-14.webp","/produtos/14/image-2-14.webp"]'),
	(15, ' Lili ', 'Handmade bag ', 80.00, 1, 0, 0, '2026-03-30 17:32:32', '2026-05-28 20:12:30', '["Verde"]', '["/produtos/15/image-1-15.webp","/produtos/15/image-2-15.webp"]'),
	(17, 'Carol ', 'Bag ', 90.00, 1, 0, 0, '2026-04-21 15:57:48', '2026-05-24 17:00:47', '["Dourado"]', '["/produtos/17/image-1-17.webp","/produtos/17/image-3-17.webp","/produtos/17/image-4-17.webp"]'),
	(18, 'Lígia ', 'Bag', 70.00, 1, 0, 0, '2026-04-21 16:17:27', '2026-04-21 16:17:28', '["Azul Claro"]', '["/produtos/18/image-1-18.webp"]'),
	(19, 'Rosa ', 'Bag ', 100.00, 1, 0, 0, '2026-04-21 16:18:34', '2026-04-21 16:18:37', '["Vermelho"]', '["/produtos/19/image-1-19.webp","/produtos/19/image-2-19.webp","/produtos/19/image-3-19.webp"]'),
	(20, 'Gabi ', 'Bag ', 100.00, 1, 0, 0, '2026-05-08 10:03:30', '2026-05-08 10:03:33', '["Caramelo"]', '["/produtos/20/image-1-20.webp","/produtos/20/image-2-20.webp"]'),
	(21, 'Terço', 'Rosary ', 15.00, 3, 0, 0, '2026-05-09 11:54:10', '2026-05-09 11:54:12', '["Bege"]', '["/produtos/21/image-1-21.webp","/produtos/21/image-2-21.webp"]'),
	(22, 'Terço ', 'Rosary ', 25.00, 3, 0, 0, '2026-05-09 11:56:40', '2026-05-09 11:56:42', '["Azul Claro"]', '["/produtos/22/image-1-22.webp","/produtos/22/image-2-22.webp"]'),
	(23, 'Summer Breeze ', 'Prática e elegante para as saídas de verão ', 50.00, 1, 0, 0, '2026-05-28 20:16:53', '2026-05-28 20:16:56', '["Bege"]', '["/produtos/23/image-1-23.webp","/produtos/23/image-2-23.webp"]'),
	(24, 'Top ', 'Um top que marca a diferença ', 250.00, 2, 0, 0, '2026-05-28 20:20:18', '2026-05-28 20:20:19', '[]', '["/produtos/24/image-1-24.webp"]'),
	(25, 'Bossa Nova ', 'Tottebag super cómoda e prática para saídas de verão ', 70.00, 1, 0, 0, '2026-05-28 20:22:39', '2026-05-28 20:22:41', '["Bege"]', '["/produtos/25/image-1-25.webp","/produtos/25/image-2-25.webp"]'),
	(26, 'Chapéu ', 'Combina contigo! ', 40.00, 2, 0, 0, '2026-05-28 20:24:39', '2026-05-28 20:24:43', '[]', '["/produtos/26/image-1-26.webp","/produtos/26/image-2-26.webp","/produtos/26/image-3-26.webp"]'),
	(27, 'Brincos', 'Combinam contigo ', 20.00, 2, 0, 0, '2026-05-28 20:26:57', '2026-05-28 20:26:58', '["Roxo Claro"]', '["/produtos/27/image-1-27.webp"]'),
	(28, 'Pocket Jubileu ', 'Prática, para todas as ocasiões. ', 90.00, 1, 0, 0, '2026-05-28 20:29:23', '2026-05-28 20:29:26', '["Roxo Claro"]', '["/produtos/28/image-1-28.webp","/produtos/28/image-2-28.webp"]'),
	(29, 'Pocket Jubileu', 'Prática, perfeita para qualquer altura.', 90.00, 1, 0, 0, '2026-05-28 20:31:10', '2026-05-28 20:31:14', '[]', '["/produtos/29/image-1-29.webp","/produtos/29/image-2-29.webp","/produtos/29/image-3-29.webp"]'),
	(30, 'Brincos ', 'Combinam contigo! ', 20.00, 2, 0, 0, '2026-05-28 20:33:09', '2026-05-28 20:33:10', '["Verde Escuro"]', '["/produtos/30/image-1-30.webp"]'),
	(31, 'Brincos', 'Combinam contigo!', 20.00, 2, 0, 0, '2026-05-28 20:35:18', '2026-05-28 20:35:19', '[]', '["/produtos/31/image-1-31.webp"]'),
	(32, 'Golden Brown Strips', 'Malas', 130.00, 1, 0, 0, '2026-05-28 20:37:42', '2026-05-28 20:37:46', '["Preto","Amarelo"]', '["/produtos/32/image-1-32.webp","/produtos/32/image-2-32.webp","/produtos/32/image-3-32.webp"]'),
	(33, 'Woody Brown', 'Malas', 95.00, 1, 0, 0, '2026-05-28 20:40:49', '2026-05-28 20:40:52', '["Castanho"]', '["/produtos/33/image-1-33.webp","/produtos/33/image-2-33.webp"]'),
	(34, 'Woody Black', 'Malas', 95.00, 1, 0, 0, '2026-05-28 20:42:35', '2026-05-28 20:42:37', '["Preto"]', '["/produtos/34/image-1-34.webp"]'),
	(35, 'Pega para capa de telemóvel ', 'Pega universal, que combina com tudo.', 15.00, 2, 0, 0, '2026-05-28 20:44:24', '2026-05-28 20:44:26', '[]', '["/produtos/35/image-1-35.webp"]'),
	(36, 'Porta moedas ', 'Porta moedas e porta cartões ', 60.00, 2, 0, 0, '2026-05-28 20:45:57', '2026-05-28 20:46:00', '[]', '["/produtos/36/image-1-36.webp","/produtos/36/image-2-36.webp","/produtos/36/image-3-36.webp"]'),
	(37, 'Pulseiras', 'Pulseiras ', 15.00, 2, 0, 0, '2026-05-28 20:49:07', '2026-05-28 20:49:08', '[]', '["/produtos/37/image-1-37.webp"]');

-- Dumping structure for table arte_em_ponto.shipping_addresses
CREATE TABLE IF NOT EXISTS `shipping_addresses` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL COMMENT 'ID do utilizador',
  `name` varchar(100) NOT NULL COMMENT 'Nome para a morada (ex: Casa, Trabalho)',
  `address` varchar(200) NOT NULL COMMENT 'Morada completa',
  `city` varchar(60) NOT NULL COMMENT 'Cidade',
  `postal_code` varchar(10) NOT NULL COMMENT 'Código postal (XXXX-XXX)',
  `phone` varchar(20) NOT NULL COMMENT 'Telemóvel',
  `is_default` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Morada predefinida',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_is_default` (`is_default`),
  CONSTRAINT `fk_shipping_address_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Moradas de entrega guardadas';

-- Dumping data for table arte_em_ponto.shipping_addresses: ~3 rows (approximately)
INSERT INTO `shipping_addresses` (`id`, `user_id`, `name`, `address`, `city`, `postal_code`, `phone`, `is_default`, `created_at`, `updated_at`) VALUES
	(1, 13, 'Morada Principal', 'Rua de Sermonde nº 445', 'Vila Nova de Gaia', '4415-115', '919792186', 1, '2025-11-23 03:21:46', '2025-11-23 03:21:46'),
	(2, 11, 'Morada Principal', 'Rua de Sermonde nº445', 'Vila Nova de Gaia', '4415-115', '919792186', 1, '2025-11-23 03:25:18', '2025-11-23 03:25:18'),
	(3, 15, 'Morada Principal', 'Rua de Sermonde', 'Vila Nova de Gaia', '4444-444', '919792186', 1, '2026-02-27 18:04:18', '2026-02-27 18:04:18');

-- Dumping structure for table arte_em_ponto.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL COMMENT 'Email do utilizador',
  `google_id` varchar(255) DEFAULT NULL,
  `avatar_url` text DEFAULT NULL,
  `password` varchar(255) NOT NULL COMMENT 'Password hash (bcrypt)',
  `name` varchar(100) NOT NULL COMMENT 'Nome completo',
  `n_telemovel` varchar(20) DEFAULT NULL COMMENT 'Número de telemóvel (formato: +351 XXX XXX XXX)',
  `role` enum('customer','admin') NOT NULL DEFAULT 'customer' COMMENT 'Tipo de utilizador',
  `status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active' COMMENT 'Estado da conta',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `email_verified` tinyint(1) DEFAULT 0,
  `email_verification_token` varchar(255) DEFAULT NULL,
  `email_verification_expires` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `google_id` (`google_id`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_email_verification_token` (`email_verification_token`),
  KEY `idx_email_verification_expires` (`email_verification_expires`),
  KEY `idx_users_google_id` (`google_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Utilizadores do sistema (clientes e administradores)';

-- Dumping data for table arte_em_ponto.users: ~5 rows (approximately)
INSERT INTO `users` (`id`, `email`, `google_id`, `avatar_url`, `password`, `name`, `n_telemovel`, `role`, `status`, `created_at`, `updated_at`, `email_verified`, `email_verification_token`, `email_verification_expires`) VALUES
	(11, 'dariosoares2005@gmail.com', '104254433210661164654', 'https://lh3.googleusercontent.com/a/ACg8ocIo1F46G6ZvJQidZ2zoZOu70o6vF5L2WBL3AVZEZrUdhkklTOg=s96-c', '', 'Conta Testes', NULL, 'admin', 'active', '2025-10-28 23:21:16', '2026-02-27 22:13:55', 1, NULL, NULL),
	(13, 'dariofrsoares@gmail.com', '114843328516608538371', 'https://lh3.googleusercontent.com/a/ACg8ocIo1F46G6ZvJQidZ2zoZOu70o6vF5L2WBL3AVZEZrUdhkklTOg=s96-c', '', 'Dário', NULL, 'customer', 'active', '2025-11-22 19:12:27', '2025-11-22 19:12:27', 1, NULL, NULL),
	(15, 'flexrpbase@gmail.com', '106664284189037404671', 'https://lh3.googleusercontent.com/a/ACg8ocK_rTMGk9ol2a2d44FL7yRYJNpnJQC9YNYJ22MGJsh1PMQoZtLW=s96-c', '', 'Dário Soares', NULL, 'customer', 'active', '2026-02-27 18:03:30', '2026-02-27 18:03:30', 1, NULL, NULL),
	(16, '1beatrizpereiralima@gmail.com', '112862276961180743162', 'https://lh3.googleusercontent.com/a/ACg8ocKAsm2ph-bzX3UUgY6Yfc_PJo1Z4RPJ2oSIlgBfV8EIkZA6xpeSBg=s96-c', '', 'Beatriz Lima', NULL, 'admin', 'active', '2026-02-27 18:32:57', '2026-02-27 18:33:27', 1, NULL, NULL),
	(17, 'gabrielasapereira@gmail.com', '106668106585378495692', 'https://lh3.googleusercontent.com/a/ACg8ocIlKHqRyqdxgLTsaR55yPoTro6FddjgycLt2Omdyds_Qg9mMP6Tqw=s96-c', '', 'Gabriela Pereira', NULL, 'customer', 'active', '2026-02-27 18:34:00', '2026-02-27 18:34:00', 1, NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
