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

   Create a `.env` file at the project root:
   ```env
   HOST=0.0.0.0
   PORT=1337
   APP_KEYS=your,app,keys,here
   API_TOKEN_SALT=your_api_token_salt
   ADMIN_JWT_SECRET=your_admin_jwt_secret
   JWT_SECRET=your_jwt_secret
   TRANSFER_TOKEN_SALT=your_transfer_token_salt
   ENCRYPTION_KEY=your_encryption_key
   NODE_ENV=development

   # Database
   DATABASE_CLIENT=sqlite
   DATABASE_FILENAME=.tmp/data.db
   ```

4. **Start the development server**
   ```bash
   yarn develop
   ```
   The Strapi admin panel will be available at `http://localhost:1337/admin`.

## 🐳 Docker

The repository includes separate Dockerfiles for development and production, and a `docker-compose.yml` that runs the Strapi app alongside a MariaDB database.

### Environment variables for Docker

Add the following to your `.env` alongside the Strapi secrets above:

```env
DATABASE_CLIENT=mysql
DATABASE_HOST=foxgirlsorg-mangaDB
DATABASE_PORT=3306
DATABASE_NAME=redtail
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your_db_password
```

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

## 📋 Content Types

| Collection | Kind | Description |
|---|---|---|
| `manga-titles` | Collection | Manga with cover, backdrop, authors, chapters, external links |
| `book-titles` | Collection | Books / light novels / short stories |
| `manga-chapters` | Collection | Chapters belonging to a manga title, with pages |
| `manga-pages` | Collection | Individual pages (image + order number) |
| `book-chapters` | Collection | Chapters with Markdown `content` field |
| `authors` | Collection | External authors linked to titles and articles |
| `articles` | Collection | Markdown articles with authors, related authors, and source URL |
| `team-members` | Collection | RedTail team members with role, avatar, and social links |
| `footer` | Single Type | Site-wide footer links and disclaimer text |

## ⚙️ API Limits

| Setting | Value |
|---|---|
| Default page size | 25 |
| Maximum page size | 100 |

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

Copyright © 2026 **foxgirls.org**. All rights reserved.
