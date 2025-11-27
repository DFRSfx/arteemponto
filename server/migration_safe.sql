-- Migration: Add missing columns to orders table (safe to run multiple times)
-- Date: 2025-01-23

USE arte_em_ponto;

-- Check and add tracking_token column
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'arte_em_ponto' 
    AND TABLE_NAME = 'orders' 
    AND COLUMN_NAME = 'tracking_token'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE `orders` ADD COLUMN `tracking_token` varchar(64) DEFAULT NULL COMMENT ''Token único para tracking por guests'' AFTER `id`, ADD UNIQUE KEY `idx_tracking_token` (`tracking_token`);',
    'SELECT ''tracking_token already exists'' AS message;'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add payment_reference column
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'arte_em_ponto' 
    AND TABLE_NAME = 'orders' 
    AND COLUMN_NAME = 'payment_reference'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE `orders` ADD COLUMN `payment_reference` varchar(50) DEFAULT NULL COMMENT ''Referência Multibanco ou MB WAY transaction ID'' AFTER `payment_method`;',
    'SELECT ''payment_reference already exists'' AS message;'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add payment_entity column
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'arte_em_ponto' 
    AND TABLE_NAME = 'orders' 
    AND COLUMN_NAME = 'payment_entity'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE `orders` ADD COLUMN `payment_entity` varchar(10) DEFAULT NULL COMMENT ''Entidade Multibanco'' AFTER `payment_reference`;',
    'SELECT ''payment_entity already exists'' AS message;'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add payment_status column
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'arte_em_ponto' 
    AND TABLE_NAME = 'orders' 
    AND COLUMN_NAME = 'payment_status'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE `orders` ADD COLUMN `payment_status` enum(''pending'',''paid'',''failed'',''expired'') NOT NULL DEFAULT ''pending'' AFTER `status`, ADD KEY `idx_payment_status` (`payment_status`);',
    'SELECT ''payment_status already exists'' AS message;'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check and add index for email + tracking
SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'arte_em_ponto' 
    AND TABLE_NAME = 'orders' 
    AND INDEX_NAME = 'idx_customer_email_tracking'
);

SET @sql = IF(@index_exists = 0,
    'CREATE INDEX `idx_customer_email_tracking` ON `orders` (`customer_email`, `tracking_token`);',
    'SELECT ''idx_customer_email_tracking already exists'' AS message;'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Create shipping_addresses table if not exists
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

-- Show final structure
SELECT 'Migration completed successfully!' AS message;
DESCRIBE orders;
