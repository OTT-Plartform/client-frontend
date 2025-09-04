#!/bin/bash

# ZIMUSHA Frontend Ubuntu Server Setup Script
# This script sets up the Ubuntu server for ZIMUSHA frontend deployment

set -e

echo "🚀 Setting up Ubuntu server for ZIMUSHA Frontend..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Please run as a regular user with sudo privileges."
   exit 1
fi

print_status "Updating package index..."
sudo apt update

print_status "Installing required packages..."
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release software-properties-common

print_status "Adding Docker's official GPG key..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

print_status "Adding Docker repository..."
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

print_status "Installing Docker..."
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

print_status "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

print_status "Adding current user to docker group..."
sudo usermod -aG docker $USER

print_status "Enabling Docker to start on boot..."
sudo systemctl enable docker

print_status "Starting Docker service..."
sudo systemctl start docker

print_status "Checking Docker installation..."
if docker --version && docker-compose --version; then
    print_success "Docker and Docker Compose installed successfully!"
else
    print_error "Docker installation failed!"
    exit 1
fi

print_status "Checking if port 80 is available..."
if sudo netstat -tlnp | grep -q ":80 "; then
    print_warning "Port 80 is already in use. You may need to stop the service using it."
    sudo netstat -tlnp | grep ":80 "
else
    print_success "Port 80 is available!"
fi

print_status "Setting up firewall (if ufw is installed)..."
if command -v ufw &> /dev/null; then
    sudo ufw allow 80/tcp
    sudo ufw allow 22/tcp
    print_success "Firewall rules added for ports 80 and 22"
else
    print_warning "UFW not found. Please configure your firewall manually to allow port 80"
fi

print_success "Ubuntu server setup completed! 🎉"
print_status "Next steps:"
print_status "1. Log out and log back in for Docker group changes to take effect"
print_status "2. Clone your ZIMUSHA frontend repository"
print_status "3. Run ./deploy.sh to deploy the application"
print_status ""
print_warning "IMPORTANT: You need to log out and log back in for Docker group changes to take effect!"
print_warning "After logging back in, you can run: docker run hello-world to test Docker"
