module.exports = {
  apps: [
    {
      name: 'kswms-backend',
      script: 'npm',
      args: 'run start:prod',
      cwd: './backend',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      }
    },
    {
      name: 'kswms-frontend',
      script: 'server.js',
      cwd: './frontend/.next/standalone',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0'
      }
    }
  ]
};
