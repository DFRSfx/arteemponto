-- ============================================================================
-- Setup First Administrator
-- ============================================================================
-- Este script cria o primeiro administrador do sistema.
-- Execute este script APENAS UMA VEZ após criar a base de dados.
--
-- Credenciais padrão:
--   Email: admin@arteemponto.pt
--   Password: Admin@2025!
--
-- ⚠️  IMPORTANTE: Altere a password após o primeiro login!
-- ============================================================================

USE arte_em_ponto;

-- Verificar se já existe algum administrador
SELECT COUNT(*) as admin_count FROM users WHERE role = 'admin';

-- ============================================================================
-- INSERIR PRIMEIRO ADMINISTRADOR
-- ============================================================================
-- Password: Admin@2025!
-- Hash gerado com bcrypt (10 rounds): $2b$10$N8YvF5qGZH8FzQ8h8yKGJOxN9xYzJ5vH8mH5xQ8h8yKGJOxN9xYzJ
--
-- Se quiser gerar uma password diferente, use:
-- Node.js: bcrypt.hash('sua_password', 10)
-- Online: https://bcrypt-generator.com/ (use 10 rounds)
-- ============================================================================

INSERT INTO users (email, password, name, role, status)
VALUES (
    'admin@arteemponto.pt',
    '$2b$10$sG3aqf3.wdMvQHXLNhYLGO.yf0UYDTwTIijpVmI.C0e7gZ16OUx1S', -- Password: Admin@2025!
    'Administrador',
    'admin',
    'active'
)
ON DUPLICATE KEY UPDATE email = email; -- Não duplicar se já existir

-- Confirmar criação
SELECT
    id,
    email,
    name,
    role,
    status,
    created_at
FROM users
WHERE role = 'admin'
LIMIT 1;

-- ============================================================================
-- INSTRUÇÕES DE USO
-- ============================================================================
--
-- 1. Execute este script no MySQL:
--    mysql -u root -p < server/src/database/setup_first_admin.sql
--
-- 2. Ou copie e cole no MySQL Workbench ou outro cliente
--
-- 3. Faça login com:
--    Email: admin@arteemponto.pt
--    Password: Admin@2025!
--
-- 4. ALTERE A PASSWORD imediatamente após o primeiro login!
--
-- 5. Depois pode criar mais administradores pelo painel admin
--
-- ============================================================================

-- ============================================================================
-- GERAR NOVA PASSWORD HASH (OPCIONAL)
-- ============================================================================
--
-- Se quiser usar uma password diferente, gere o hash assim:
--
-- Opção 1 - Node.js:
-- node -e "const bcrypt = require('bcrypt'); bcrypt.hash('SuaPasswordAqui', 10).then(h => console.log(h));"
--
-- Opção 2 - Online:
-- https://bcrypt-generator.com/
-- Cole a password e selecione "10 rounds"
-- Copie o hash gerado e substitua no INSERT acima
--
-- ============================================================================
