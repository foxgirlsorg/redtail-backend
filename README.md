# RedTail site backend
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Strapi CMS backend for the RedTail translation team website.**

This repository contains the Strapi v5 backend that powers all content for the RedTail reader. It exposes a REST API consumed by the frontend.

The frontend is maintained in a separate repository: [foxgirlsorg/redtail-frontend](https://github.com/foxgirlsorg/redtail-frontend).

## 🛠️ Technical Overview

* **CMS:** [Strapi](https://strapi.io/) v5
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Database:** MariaDB (Docker) / SQLite (local dev fallback)
* **Runtime:** Node.js 20 (Alpine)
* **Containerization:** Docker + Docker Compose

## 🔌 Plugins

| Plugin | Package | Purpose |
|---|---|---|
| Comments | `strapi-plugin-comments` | Nested, rated comments on articles, manga, and books |
| Config Sync | `strapi-plugin-config-sync` | Version-controls Strapi config as JSON files under `config/sync/` |
| Users & Permissions | `@strapi/plugin-users-permissions` | User auth, roles, OAuth callbacks, password reset |
| Email (Nodemailer) | `@strapi/provider-email-nodemailer` | Transactional email via SMTP |

### Comments

Comments are enabled on the following collections:

* `api::article.article`
* `api::manga-title.manga-title`
* `api::manga-page.manga-page`
* `api::book-title.book-title`
* `api::book-chapter.book-chapter`

Nesting is enabled. Bad-word filtering is disabled by default.

### Config Sync

All Strapi configuration (roles, permissions, content-type layouts, plugin settings) is exported as JSON under `config/sync/`. This means config changes made in the admin panel can be committed to version control and reliably reproduced across environments by running:

```bash
yarn strapi config-sync import
```

After making config changes in the admin, export them with:

```bash
yarn strapi config-sync export
```

## 🚀 Local Development

### Prerequisites

* Node.js v20+
* yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/foxgirlsorg/redtail-backend.git
   cd redtail-backend
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Configure environment variables**

   Copy the example file and fill in the values:
   ```bash
   cp .env.example .env
   ```

   See the [Environment Variables](#️-environment-variables) section for a full reference.

4. **Start the development server**
   ```bash
   yarn develop
   ```
   The Strapi admin panel will be available at `http://localhost:1337/admin`.

## 🐳 Docker

The repository includes separate Dockerfiles for development and production, and a `docker-compose.yml` that runs the Strapi app alongside a MariaDB database.

### Development container

Mounts local source files into the container so changes are reflected without rebuilding.

```bash
docker compose up --build
```

### Production container

Uses a multi-stage build to produce a lean final image.

```bash
docker build -f Dockerfile.prod -t foxgirlsorg-manga:latest .
docker compose up -d
```

Strapi will be available at `http://localhost:1337`. Media uploads are persisted via the `./public/uploads` volume mount.

## 📦 Building & Deployment

Without Docker:

```bash
yarn build
yarn start
```

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in all values before starting the server. Never commit `.env` to version control.

### Server

| Variable | Default | Description |
|---|---|---|
| `HOST` | `0.0.0.0` | Address the server binds to |
| `PORT` | `1337` | Port the server listens on |
| `NODE_ENV` | `production` | `development` or `production` |
| `PUBLIC_URL` | `https://redtail.foxgirls.org` | Public-facing URL (used for OAuth callbacks and password-reset links) |

### Strapi Secrets

Generate secure random values for all of these. They must be consistent across restarts — changing them will invalidate existing sessions and tokens.

| Variable | Description |
|---|---|
| `APP_KEYS` | Comma-separated list of session keys |
| `API_TOKEN_SALT` | Salt for API token hashing |
| `ADMIN_JWT_SECRET` | JWT secret for admin panel sessions |
| `JWT_SECRET` | JWT secret for users-permissions tokens |
| `TRANSFER_TOKEN_SALT` | Salt for data-transfer tokens |
| `ENCRYPTION_KEY` | Encryption key for sensitive data |

### SMTP (Email)

Used by Nodemailer for transactional email (password resets, etc.).

| Variable | Default | Description |
|---|---|---|
| `SMTP_HOST` | — | SMTP server hostname |
| `SMTP_PORT` | `465` | SMTP port |
| `SMTP_SECURE` | `true` | Use TLS (`true` for port 465, `false` for STARTTLS on 587) |
| `SMTP_USERNAME` | — | SMTP auth username |
| `SMTP_PASSWORD` | — | SMTP auth password |
| `SMTP_FROM` | — | Sender address (e.g. `no-reply@foxgirls.org`) |
| `SMTP_FROM_NAME` | `RedTail` | Display name shown in the From field |

### Database

| Variable | Default | Description |
|---|---|---|
| `DATABASE_CLIENT` | `sqlite` | `mysql`, `postgres`, or `sqlite` |
| `DATABASE_HOST` | `localhost` | DB host (Docker: `foxgirlsorg-mangaDB`) |
| `DATABASE_PORT` | `3306` | DB port |
| `DATABASE_NAME` | `strapi` | Database name |
| `DATABASE_USERNAME` | `strapi` | DB username |
| `DATABASE_PASSWORD` | — | DB password |
| `DATABASE_SSL` | `false` | Enable SSL for the DB connection |
| `DATABASE_FILENAME` | `.tmp/data.db` | SQLite file path (only used when `DATABASE_CLIENT=sqlite`) |

## 📋 Content Types

| Collection | Kind | Key fields |
|---|---|---|
| `manga-titles` | Collection | Name, slug, type (Манга/Манхва/Маньхуа/Комикс), cover, backdrop, release status, authors, chapters, team members, external links (MangaLib, ReManga, ReadManga, Senkuro) |
| `manga-chapters` | Collection | Belongs to a manga title, contains manga pages |
| `manga-pages` | Collection | Individual page image + order number, belongs to a chapter |
| `book-titles` | Collection | Name, slug, type (Книга/Ранобэ/Рассказ), cover, backdrop, release status, authors, chapters, book files, team members |
| `book-chapters` | Collection | Rich-text `content` field, belongs to a book title |
| `book-files` | Collection | Downloadable files (e.g. EPUB/PDF) attached to a book title, with a `file_type` label and a `hidden` flag |
| `authors` | Collection | External authors linked to manga titles, book titles, and articles; includes photo and social URLs (JSON) |
| `articles` | Collection | Rich-text articles with slug, description, card background, source URL, authors, related authors, and team members |
| `team-members` | Collection | Nickname, role, avatar, Telegram URL, email; linked to manga titles, book titles, and articles |
| `footer` | Single Type | Platform links (MangaLib, ReManga, ReadManga, Telegram), contact email, contact Telegram, and a warning/disclaimer string |

## 🗺️ REST API pagination defaults

These are set in `config/api.ts` and apply to all collection endpoints unless overridden per-request with `?pagination[pageSize]=N`.

| Setting | Value |
|---|---|
| Default page size | 25 |
| Maximum page size | 100 |

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

Copyright © 2026 **foxgirls.org**. All rights reserved.
