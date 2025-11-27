-- Migration: Add shipping addresses table and order tracking token
-- Date: 2025-01-23

-- Create shipping_addresses table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Moradas de entrega guardadas';

-- Add tracking_token to orders table for guest order tracking
ALTER TABLE `orders` 
ADD COLUMN `tracking_token` varchar(64) DEFAULT NULL COMMENT 'Token único para tracking por guests' AFTER `id`,
ADD COLUMN `payment_reference` varchar(50) DEFAULT NULL COMMENT 'Referência Multibanco ou MB WAY transaction ID' AFTER `payment_method`,
ADD COLUMN `payment_entity` varchar(10) DEFAULT NULL COMMENT 'Entidade Multibanco' AFTER `payment_reference`,
ADD COLUMN `payment_status` enum('pending','paid','failed','expired') NOT NULL DEFAULT 'pending' AFTER `status`,
ADD UNIQUE KEY `idx_tracking_token` (`tracking_token`),
ADD KEY `idx_payment_status` (`payment_status`);

-- Create index for faster guest order lookup
CREATE INDEX `idx_customer_email_tracking` ON `orders` (`customer_email`, `tracking_token`);
