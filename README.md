# Portfolio AI API

A Node.js backend for a personal portfolio frontend hosted on GitHub Pages. It
provides health and Gemini-powered portfolio chat endpoints.

## Technology stack

- Node.js (LTS) and TypeScript with strict type checking
- Express.js
- Google GenAI SDK
- dotenv and Zod for environment configuration and request validation
- CORS and Helmet
- ESLint and Prettier

## Project structure

```text
portfolio-ai-api/
├── src/
│   ├── config/env.ts
│   ├── controllers/
│   │   ├── chat.controller.ts
│   │   └── health.controller.ts
│   ├── middleware/error.middleware.ts
│   ├── prompts/portfolio.prompt.ts
│   ├── routes/
│   │   ├── chat.routes.ts
│   │   └── health.routes.ts
│   ├── schemas/chat.schema.ts
│   ├── services/gemini.service.ts
│   ├── app.ts
│   └── server.ts
├── tests/
├── .env.example
├── eslint.config.js
├── package.json
├── prettier.config.js
└── tsconfig.json
```

## Prerequisites

- Node.js 22 or later (an active Node.js LTS release)
- npm

## Installation

```bash
npm install
```

## Environment configuration

Copy `.env.example` to `.env` and configure your values:

```dotenv
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=<your Gemini API key>
GEMINI_MODEL=gemini-3.8-flash
```

`FRONTEND_URL` must be the frontend's exact origin. For production, set it to
`https://karthik-n-acharya.github.io` in the deployment environment, rather
than hardcoding it in the application. `GEMINI_API_KEY` is required and must
remain on the backend; never expose it to the frontend. `GEMINI_MODEL` defaults
to `gemini-3.8-flash`. Invalid environment values stop the application during
startup. `.env` is excluded from Git.

## Development

```bash
npm run dev
```

The development server watches source files and restarts when they change.
Open [http://localhost:3000/api-docs](http://localhost:3000/api-docs) for the
interactive Swagger UI. Use **Try it out** on an endpoint to send a local
request. Swagger UI is disabled when `NODE_ENV=production`.

## Build and production

Compile the TypeScript source into `dist/`:

```bash
npm run build
```

Start the compiled application:

```bash
npm start
```

## Deploy to Render

This repository includes a `render.yaml` Blueprint for a Node.js web service.
In Render, create a new **Blueprint** and connect this GitHub repository. The
Blueprint builds with `npm ci && npm run build`, starts with `npm start`, and
uses `GET /api/health` as its health check. The server listens on Render's
assigned `PORT` and binds to `0.0.0.0`.

During Blueprint setup, provide `GEMINI_API_KEY` in Render's environment
configuration. Keep it as a secret; do not put it in the repository or
frontend. The Blueprint sets `NODE_ENV=production`,
`FRONTEND_URL=https://karthik-n-acharya.github.io`, and the default
`GEMINI_MODEL`. Update `FRONTEND_URL` in Render if the frontend origin changes.
Swagger UI is available only in non-production environments.

After deployment, use the Render service URL as the frontend API base URL:

```text
https://<your-render-service>.onrender.com
```

The endpoints are `GET https://<your-render-service>.onrender.com/api/health`
and `POST https://<your-render-service>.onrender.com/api/chat`.

## Quality commands

```bash
npm run lint
npm run format
npm run format:check
```

## API endpoints

The interactive OpenAPI documentation is available locally at
`http://localhost:3000/api-docs` when running in development mode.

### `GET /api/health`

Returns the service status:

```json
{
  "status": "ok",
  "service": "portfolio-ai-api"
}
```

### `POST /api/chat`

Sends a message to the portfolio assistant. The backend calls Gemini; the API
key is never sent to the frontend. Missing, empty, or non-string messages
return HTTP 400. Provider failures return a safe error without raw API details.

Example request:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Hello, tell me about Karthik.\"}"
```

Example response:

```json
{
  "answer": "..."
}
```

For portfolio information unavailable in the application context, the
assistant is instructed not to invent facts.

Run the development server with `npm run dev`, then request
`http://localhost:3000/api/health`:

```bash
curl http://localhost:3000/api/health
```
