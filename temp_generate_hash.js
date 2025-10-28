// Temporary script to generate bcrypt hash
import bcrypt from 'bcrypt';

const password = 'Admin@2025!';
const saltRounds = 10;

bcrypt.hash(password, saltRounds).then(hash => {
  console.log('================================================================================');
  console.log('HASH GERADO PARA ADMIN');
  console.log('================================================================================');
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('');
  console.log('SQL para atualizar:');
  console.log('');
  console.log(`UPDATE users SET password = '${hash}' WHERE email = 'admin@arteemponto.pt';`);
  console.log('');
  console.log('================================================================================');
  process.exit(0);
}).catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
