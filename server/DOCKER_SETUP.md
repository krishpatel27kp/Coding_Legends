# Docker Setup Guide for DataPulse

This guide explains how to use Docker to run PostgreSQL for local development.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start

### 1. Start PostgreSQL Container

Navigate to the server directory and run:

```bash
cd server
docker-compose up -d
```

This will:
- Download the PostgreSQL 15 Alpine image (if not already downloaded)
- Create and start a PostgreSQL container named `datapulse-postgres`
- Expose PostgreSQL on port `5432`
- Create a persistent volume for database data

### 2. Verify Container is Running

```bash
docker-compose ps
```

You should see the `datapulse-postgres` container with status "Up".

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

The default DATABASE_URL is already configured for Docker:
```
DATABASE_URL="postgresql://datapulse:datapulse_dev_password@localhost:5432/datapulse"
```

### 4. Initialize Database Schema

Run Prisma migrations:

```bash
npx prisma generate
npx prisma db push
```

## Docker Commands Reference

### Start the database
```bash
docker-compose up -d
```

### Stop the database
```bash
docker-compose down
```

### Stop and remove all data (fresh start)
```bash
docker-compose down -v
```

### View logs
```bash
docker-compose logs -f postgres
```

### Access PostgreSQL CLI
```bash
docker-compose exec postgres psql -U datapulse -d datapulse
```

## Configuration Details

### Docker Compose Configuration

The `docker-compose.yml` file defines:

- **Image**: `postgres:15-alpine` (lightweight PostgreSQL 15)
- **Container Name**: `datapulse-postgres`
- **Port**: `5432:5432` (host:container)
- **Credentials**:
  - Username: `datapulse`
  - Password: `datapulse_dev_password`
  - Database: `datapulse`
- **Volume**: `postgres_data` (persists data between container restarts)
- **Health Check**: Ensures PostgreSQL is ready before accepting connections

### Data Persistence

Database data is stored in a Docker volume named `postgres_data`. This means:
- ✅ Data persists when you stop/start the container
- ✅ Data persists when you restart Docker Desktop
- ❌ Data is deleted if you run `docker-compose down -v`

## Troubleshooting

### Port 5432 Already in Use

If you have PostgreSQL already installed locally:

**Option 1**: Stop local PostgreSQL
```bash
# Windows (as Administrator)
net stop postgresql-x64-15
```

**Option 2**: Change Docker port in `docker-compose.yml`
```yaml
ports:
  - "5433:5432"  # Use port 5433 on host
```
Then update DATABASE_URL:
```
DATABASE_URL="postgresql://datapulse:datapulse_dev_password@localhost:5433/datapulse"
```

### Container Won't Start

Check Docker Desktop is running:
```bash
docker --version
docker-compose --version
```

View detailed logs:
```bash
docker-compose logs postgres
```

### Reset Everything

To completely reset the database:
```bash
docker-compose down -v
docker-compose up -d
npx prisma db push
```

## Production Deployment

**Important**: This Docker setup is for **local development only**.

For production:
- Use managed PostgreSQL services (Render, Railway, Supabase, AWS RDS)
- Never use development credentials in production
- Enable SSL/TLS connections
- Set up automated backups

## Why Use Docker?

✅ **No Local Installation**: Don't need to install PostgreSQL on your machine  
✅ **Consistent Environment**: Same database version across all developers  
✅ **Easy Cleanup**: Remove everything with one command  
✅ **Isolated**: Won't conflict with other projects  
✅ **Fast Setup**: Get started in seconds  

---

For more information, see the main [README.md](../README.md)
