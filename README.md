## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on self-hosting

1. Update `NEXT_PUBLIC_API_URL` in .env file.

```bash
NEXT_PUBLIC_API_URL=http://<HOST>:<PORT>/api/v1
```

2. Start up container

```bash
docker compose up -d --build
```

Please refer to `docker-compose.yml` and `Dockerfile` for more information.
