# ZIMUSHA Frontend Deployment Guide

This guide explains how to deploy the ZIMUSHA frontend application on Ubuntu server using Docker.

## Prerequisites

### Server Requirements
- Ubuntu 20.04 LTS or later
- Docker 20.10+ 
- Docker Compose 2.0+
- Node.js 18+ (for local development)
- Yarn (for local development)
- At least 2GB RAM
- At least 10GB free disk space

### Backend API
- Backend API is running at: `http://ubiqent.com:8080/api`
- Make sure the backend is accessible from your server

## Installation Steps

### 1. Install Docker and Docker Compose

```bash
# Update package index
sudo apt update

# Install required packages
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add current user to docker group
sudo usermod -aG docker $USER

# Log out and log back in for group changes to take effect
```

### 2. Clone and Setup Project

```bash
# Clone the repository (replace with your actual repository URL)
git clone <your-repository-url> zimusha-frontend
cd zimusha-frontend

# Make deployment script executable
chmod +x deploy.sh
```

### 3. Configure Environment Variables

```bash
# Copy production environment file
cp production.env .env.local

# Edit environment variables if needed
nano .env.local
```

### 4. Deploy the Application

```bash
# Run the deployment script
./deploy.sh
```

Or manually:

```bash
# Build and start the application
docker-compose up --build -d

# Check if it's running
docker-compose ps

# View logs
docker-compose logs -f zimusha-frontend
```

## Configuration

### Environment Variables

The application uses the following environment variables:

- `NEXT_PUBLIC_API_URL`: Backend API URL (http://ubiqent.com:8080/api)
- `NEXT_PUBLIC_BACKEND_URL`: Backend base URL (http://ubiqent.com:8080)
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `NEXT_PUBLIC_GOOGLE_REDIRECT_URI`: Google OAuth redirect URI
- `NEXT_PUBLIC_APP_NAME`: Application name (ZIMUSHA)
- `NEXT_PUBLIC_APP_URL`: Frontend URL
- `NEXT_PUBLIC_FRONTEND_URL`: Frontend URL for OAuth callbacks

### Port Configuration

The application runs on port 80 (HTTP) by default. To change the port:

1. Edit `docker-compose.yml`:
```yaml
ports:
  - "YOUR_PORT:3000"
```

2. Update environment variables:
```bash
NEXT_PUBLIC_APP_URL=http://localhost:YOUR_PORT
NEXT_PUBLIC_FRONTEND_URL=http://localhost:YOUR_PORT
```

## Management Commands

### Start the application
```bash
docker-compose up -d
```

### Stop the application
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f zimusha-frontend
```

### Restart the application
```bash
docker-compose restart zimusha-frontend
```

### Update the application
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose up --build -d
```

### Check application status
```bash
docker-compose ps
```

## Troubleshooting

### Application not starting
```bash
# Check logs for errors
docker-compose logs zimusha-frontend

# Check if port is already in use
sudo netstat -tlnp | grep :80
```

### Permission issues
```bash
# Fix Docker permissions
sudo chown -R $USER:$USER .
sudo chmod +x deploy.sh
```

### Out of disk space
```bash
# Clean up Docker images and containers
docker system prune -a
docker volume prune
```

### Backend connection issues
```bash
# Test backend connectivity
curl -I http://ubiqent.com:8080/api

# Check if backend is accessible from server
telnet 185.209.228.74 8080
```

## Security Considerations

1. **Firewall**: Configure firewall to only allow necessary ports
2. **SSL/HTTPS**: Consider using a reverse proxy (nginx) with SSL certificates
3. **Environment Variables**: Keep sensitive data in environment variables
4. **Updates**: Regularly update Docker images and dependencies

## Local Development

### Prerequisites for Local Development
- Node.js 18+
- Yarn package manager

### Setup Local Development
```bash
# Install dependencies
yarn install

# Create environment file
cp .env.example .env.local

# Start development server
yarn dev
```

### Available Scripts
```bash
# Development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Lint code
yarn lint

# Type check
yarn type-check
```

## Monitoring

### Health Check
```bash
# Check if application is responding
curl -I http://localhost
```

### Resource Usage
```bash
# Check container resource usage
docker stats zimusha-frontend
```

### Log Monitoring
```bash
# Follow logs in real-time
docker-compose logs -f zimusha-frontend
```

## Backup and Recovery

### Backup
```bash
# Backup environment configuration
cp .env.local .env.local.backup

# Backup Docker volumes (if any)
docker run --rm -v zimusha_frontend_data:/data -v $(pwd):/backup alpine tar czf /backup/data-backup.tar.gz -C /data .
```

### Recovery
```bash
# Restore from backup
cp .env.local.backup .env.local
docker-compose up -d
```

## Support

For issues or questions:
1. Check the logs: `docker-compose logs zimusha-frontend`
2. Verify backend connectivity: `curl http://ubiqent.com:8080/api`
3. Check Docker status: `docker-compose ps`
4. Review this documentation

## Production Checklist

- [ ] Docker and Docker Compose installed
- [ ] Environment variables configured
- [ ] Backend API accessible
- [ ] Application builds successfully
- [ ] Application starts without errors
- [ ] Health check passes
- [ ] Logs show no errors
- [ ] Firewall configured
- [ ] SSL/HTTPS configured (if needed)
- [ ] Monitoring setup
- [ ] Backup strategy in place
