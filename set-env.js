const fs = require('fs');

const targetPath = './src/environments/environment.ts';

const apiUrl = process.env.API_URL || 'http://localhost:8080';

const envConfigFile = `
export const environment = {
  production: true,
  apiUrl: '${apiUrl}'
 };
`;

fs.writeFileSync(targetPath, envConfigFile);
console.log(`¡Variable de entorno inyectada con éxito! API_URL: ${apiUrl}`);