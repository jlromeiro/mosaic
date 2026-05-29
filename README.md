# Mosaico Solana Hackathon

Landing interativa que permite participantes do hackathon Solana encontrarem suas logos dentro do mosaico oficial do evento. Sobe um recorte da logo, o backend roda template matching multi-escala (OpenCV), o frontend anima seta + glow + zoom apontando a posição encontrada.

**Powered by RPC Priority Protocol Project**

## Stack

| Camada | Tech |
|---|---|
| Frontend | React (CRA) + Tailwind + Framer Motion + tsparticles + lucide-react |
| Backend | FastAPI + OpenCV + Pillow + NumPy |
| Infra | Docker Compose + Traefik (network `portainer_default`) |
| Deploy | `mosaic.rpcpriority.com` em kvm4 (168.231.97.238); `mosaic.assistent.top` redireciona 301 |

## Estrutura

```
mosaic/
├── frontend/         React + Tailwind + Framer Motion
├── backend/          FastAPI + OpenCV
├── docs/             PRD, mosaico original, exemplos de saída
├── docker-compose.yml
└── README.md
```

## Endpoints

- `POST /api/find-logo` — multipart upload, retorna `{x, y, width, height, confidence}`
- `POST /api/generate-share-image` — gera imagem shareable com destaque

### Proteção do `/api/find-logo`

Endpoint público e CPU-bound (~60s por match). Defesas:
- **Rate limit** por IP (`FIND_LOGO_RATE`, default `10/minute`) — via slowapi, respeitando `X-Forwarded-For` atrás do Traefik.
- **Fila de concorrência** (`MATCH_CONCURRENCY`, default 2) — bounda matchings simultâneos; responde `429 busy` ao saturar.
- **Upload** validado por MIME e lido com cap de 5 MB em streaming (`413` ao exceder).

## Desenvolvimento local

```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate  # ou .venv\Scripts\activate no Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm start  # http://localhost:3000
```

## Deploy

```bash
ssh kvm4
cd /root/mosaic
git pull
docker compose up -d --build
docker compose logs -f
```

DNS: `mosaic.rpcpriority.com` → `168.231.97.238` (A record). `mosaic.assistent.top` mantém A record + redirect 301 pra preservar links compartilhados.
