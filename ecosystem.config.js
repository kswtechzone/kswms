const fs = require('fs');
const path = require('path');

// Helper to parse env variables from a file without any third-party dependencies
function parseEnvFile(filePath) {
  const absolutePath = path.resolve(__dirname, filePath);
  const env = {};
  if (fs.existsSync(absolutePath)) {
    try {
      const content = fs.readFileSync(absolutePath, 'utf8');
      content.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx > 0) {
            const key = trimmed.substring(0, eqIdx).trim();
            let val = trimmed.substring(eqIdx + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.substring(1, val.length - 1);
            }
            env[key] = val;
          }
        }
      });
    } catch (err) {
      console.error(`Failed to read/parse env file ${filePath}:`, err);
    }
  }
  return env;
}

// Load environment configurations
const backendEnv = parseEnvFile('./backend/.env');
const frontendEnv = parseEnvFile('./frontend/.env.production') || parseEnvFile('./frontend/.env.development');

const BACKEND_PORT = parseInt(backendEnv.PORT || process.env.PORT || '4000', 10);
const FRONTEND_PORT = parseInt(frontendEnv.NEXT_PUBLIC_FRONTEND_PORT || frontendEnv.PORT || '3000', 10);

module.exports = {
  apps: [
    {
      name: 'kswms-backend',
      script: 'npm',
      args: 'run start:prod',
      cwd: './backend',
      env: {
        NODE_ENV: 'production',
        PORT: BACKEND_PORT,
      },
    },
    {
      name: 'kswms-frontend',
      script: 'server.js',
      cwd: './frontend/.next/standalone/frontend',
      env: {
        NODE_ENV: 'production',
        PORT: FRONTEND_PORT,
        HOSTNAME: '0.0.0.0',
      },
    },
  ],
};

