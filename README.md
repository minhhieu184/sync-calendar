## NESTJS-STARTER

## .env

```bash
#DB
POSTGRES_DB=starter_db
POSTGRES_USER=starter
POSTGRES_PASSWORD=starter_pass
POSTGRES_PORT=5432
DB_FORWARD_PORT=15432
POSTGRES_HOST=db
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public

PORT=3300

# REDIS
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
```

## Generate cert

```bash
# Install mkcert
brew install mkcert nss
mkcert -install

# Generate local development certificate
$ mkdir nginx/cert
$ cd nginx/cert
$ mkcert -cert-file starter.pem -key-file starter-key.pem '*.starter-local.jp' localhost 127.0.0.2 ::1
$ cd -

$ echo '127.0.0.2 xxxx.starter-local.jp' | sudo tee -a /etc/hosts
```

## Running the app

```bash
$ docker compose up -d
```

## Generate Prisma type

```bash
$ docker exec starter-server yarn prisma generate
```
