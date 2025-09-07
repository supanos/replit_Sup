#!/bin/bash

# Digital Ocean Deployment Script for Supono's Sports Bar
# This script sets up the application on a Digital Ocean droplet

set -e

echo "🚀 Starting deployment of Supono's Sports Bar..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

# Create application directory
sudo mkdir -p /var/www/supono-sports-bar
cd /var/www/supono-sports-bar

# Extract application files (assumes tar.gz is in current directory)
echo "Extracting application files..."
sudo tar -xzf supono-sports-bar-deployment.tar.gz --strip-components=1

# Set correct permissions
sudo chown -R $USER:$USER /var/www/supono-sports-bar

# Install dependencies
echo "Installing dependencies..."
npm ci --production

# Build the application
echo "Building application..."
npm run build

# Create logs directory
mkdir -p logs

# Set up environment variables (you'll need to edit these)
echo "Setting up environment variables..."
echo "Please edit the .env file with your database credentials"

# Start the application with PM2
echo "Starting application with PM2..."
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

echo "✅ Deployment complete!"
echo "Your application is running at http://localhost:5000"
echo ""
echo "Next steps:"
echo "1. Configure your database credentials in the environment"
echo "2. Set up Nginx reverse proxy (optional)"
echo "3. Configure domain and SSL certificate"
echo ""
echo "To manage the application:"
echo "  pm2 status          - Check app status"
echo "  pm2 logs            - View logs"
echo "  pm2 restart all     - Restart app"
echo "  pm2 stop all        - Stop app"