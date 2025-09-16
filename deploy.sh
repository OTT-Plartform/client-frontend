#!/bin/bash

# UbiqEnt Frontend Deployment Script
# This script deploys the UbiqEnt frontend application using Docker

set -e

echo "🚀 Starting UbiqEnt Frontend Deployment..."

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

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Determine compose command (Docker Compose v2 uses `docker compose`)
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
else
    print_error "Docker Compose is not installed. Install plugin: https://docs.docker.com/compose/install/linux/"
    echo "\nQuick install on Ubuntu:\n  sudo apt-get update && sudo apt-get install -y docker-compose-plugin\n"
    exit 1
fi

print_status "Docker and Docker Compose are available (${COMPOSE_CMD})"

# Stop and remove existing containers
print_status "Stopping existing containers..."
${COMPOSE_CMD} down --remove-orphans || true

# Remove existing images to force rebuild
print_status "Removing existing images..."
docker rmi ubiqent-frontend || true

# Build and start the application
print_status "Building and starting the application..."
${COMPOSE_CMD} up --build -d

# Wait for the application to start
print_status "Waiting for application to start..."
sleep 10

# Check if the application is running
if ${COMPOSE_CMD} ps | grep -q "ubiqent-frontend.*Up"; then
    print_success "UbiqEnt Frontend is running successfully!"
    print_status "Application is available at: http://localhost (port 80)"
    print_status "Backend API: http://ubiqent.com:8080/api"
    
    # Show container status
    print_status "Container Status:"
    ${COMPOSE_CMD} ps
    
    # Show logs
    print_status "Recent logs:"
    ${COMPOSE_CMD} logs --tail=20 ubiqent-frontend
else
    print_error "Failed to start the application"
    print_status "Checking logs for errors:"
    ${COMPOSE_CMD} logs ubiqent-frontend
    exit 1
fi

print_success "Deployment completed successfully! 🎉"
