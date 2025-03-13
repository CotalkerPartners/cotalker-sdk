# API Cotalker Middleware

This project is a serverless middleware using Node.js and TypeScript to interact with the Cotalker API.

## Installation Requirements

- NodeJS `lts/fermium (v.14.15.0)` or higher
- If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the correct Node version

## Installation/Deployment Instructions

### Using NPM

- Run `npm i` to install project dependencies
- For development:
  - Run `npm run start:dev` to start the server in development mode with hot-reload
- For production:
  - Run `npx sls deploy` to deploy this stack to AWS

## Local Development

### Development Mode with Hot-Reload
The project uses `tsc-watch` to provide automatic recompilation and server restart when file changes are detected. To start the server in development mode:

```bash
npm run start:dev
```

### Environment Variables
1. Based on cotalker.config.json create your environment variables in the files cotalker.dev.json, cotalker.stg.json, cotalker.prd.json. These files are git-ignored.
2. Add your environment variables to serverless.yml by file reference

## Project Structure

The project follows a clean architecture pattern and is organized as follows:

```
.
├── assets                     # Static assets and configuration
│   ├── bot-templates         # Bot message templates
│   ├── data                  # Configuration files
│   │   └── company-config.json
│   └── scripts               # Utility scripts
│       └── index.ts
│
├── core                      # Core business logic
│   ├── libs                  # Shared libraries
│   │   ├── CotalkerAPI.ts
│   │   ...
│   └── types                 # TypeScript type definitions
│       ├── COTTypes
│       ├── custom.d.ts
│       └── index.d.ts
│
├── domain                    # Domain layer
│   ├── controller           # Request handlers
│   │   └── project.controller.ts
│   ├── schema              # Data validation schemas
│   │   └── project.schema.ts
│   └── service             # Business logic services
│       └── project.service.ts
│
├── network                  # Network layer
│   ├── lib                 # Network utilities
│   │   ├── Logger.ts
│   │   └── handler-wrap.ts
│   └── routes.ts          # API route definitions
│
└── index.ts               # Application entry point
```

The project is structured in layers:

- `assets` - Contains static assets, configuration files, and utility scripts
- `core` - Houses the core business logic, shared libraries, and type definitions
- `domain` - Contains the business domain logic, organized in controllers, schemas, and services
- `network` - Handles all network-related functionality, including routing and request handling
