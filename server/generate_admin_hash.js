// Script para gerar hash de password para o primeiro admin
import { hash as _hash } from 'bcrypt';

const password = 'Admin@2025!';
const saltRounds = 10;

_hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Erro ao gerar hash:', err);
    process.exit(1);
  }

  console.log('='.repeat(80));
  console.log('HASH GERADO PARA PRIMEIRO ADMIN');
  console.log('='.repeat(80));
  console.log('');
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('');
  console.log('='.repeat(80));
  console.log('COPIE O SQL ABAIXO:');
  console.log('='.repeat(80));
  console.log('');
  console.log(`INSERT INTO users (email, password, name, role, status)`);
  console.log(`VALUES (`);
  console.log(`    'admin@arteemponto.pt',`);
  console.log(`    '${hash}',`);
  console.log(`    'Administrador',`);
  console.log(`    'admin',`);
  console.log(`    'active'`);
  console.log(`)`);
  console.log(`ON DUPLICATE KEY UPDATE email = email;`);
  console.log('');
  console.log('='.repeat(80));

  process.exit(0);
});
