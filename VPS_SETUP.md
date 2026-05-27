# Hostinger VPS Setup Guide (Ubuntu 22.04 / 24.04)

This guide walks through configuring your new Hostinger VPS to run the KSWMS full-stack application using Node.js, PM2, and Nginx.

## 1. Initial Server Setup & Dependencies

Connect to your VPS via SSH and run the following commands to install dependencies:

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (v20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 and Yarn/pnpm (optional) globally
sudo npm install -g pm2 yarn pnpm

# Install Nginx
sudo apt install -y nginx

# Install Certbot for Let's Encrypt SSL
sudo apt install -y certbot python3-certbot-nginx
```

## 2. Deploying the Application

1. **Clone your repository** onto the server (e.g. into `/apps/kswms`). 
2. Create your `.env` files in `backend/.env` and `frontend/.env.production`.
3. **Build the Backend**:
   ```bash
   cd /apps/kswms/backend
   npm install
   npx prisma generate
   npm run build
   ```
4. **Build the Frontend**:
   ```bash
   cd /apps/kswms/frontend
   npm install
   npm run build
   
   # Important: For the standalone build to work, you must copy the static folders:
   cp -r public .next/standalone/
   cp -r .next/static .next/standalone/.next/
   ```

## 3. Starting the Applications with PM2

From the root of your project `/apps/kswms`, run:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
# (Run the command that `pm2 startup` gives you to ensure PM2 restarts on server reboot)
```

## 4. Configuring Nginx (Reverse Proxy)

Create an Nginx configuration file to route traffic to your frontend (port 3000) and backend API (port 4000).

```bash
sudo nano /etc/nginx/sites-available/kswms
```

Paste the following (replace `kswms.cloud` with your actual domain):

```nginx
server {
    listen 80;
    server_name kswms.cloud www.kswms.cloud;

    # Frontend Routing
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name api.kswms.cloud;

    # Backend Routing
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration:
```bash
sudo ln -s /etc/nginx/sites-available/kswms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 5. Setting up SSL

Run Certbot to automatically configure Let's Encrypt SSL certificates for your domains:

```bash
sudo certbot --nginx -d kswms.cloud -d www.kswms.cloud -d api.kswms.cloud
```

That's it! Your application is now running securely on your Hostinger VPS.
