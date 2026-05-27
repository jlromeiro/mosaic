#!/usr/bin/env bash
# pre-commit-check.sh — valida arquivos staged contra Docker Hygiene + Web Security Standards
# Standards: c:\projetos\.claude\CLAUDE.md
#
# Como instalar:
#   ln -sf ../../scripts/pre-commit-check.sh .git/hooks/pre-commit
#   chmod +x scripts/pre-commit-check.sh
#
# Como bypassar (caso de exceção legítima):
#   git commit --no-verify
#
# Compatível com Git Bash (Windows) — usa grep -E em vez de grep -P pra evitar locale issues.

set -uo pipefail
FAIL=0

red() { printf "\033[31m%s\033[0m\n" "$*"; }
yellow() { printf "\033[33m%s\033[0m\n" "$*"; }
green() { printf "\033[32m%s\033[0m\n" "$*"; }

fail() {
  red "X $*"
  FAIL=1
}

warn() {
  yellow "! $*"
}

# Arquivos staged
STAGED=$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null)

if [ -z "$STAGED" ]; then
  exit 0
fi

NUM_STAGED=$(echo "$STAGED" | wc -l)
echo "Pre-commit check em $NUM_STAGED arquivos staged..."
echo ""

# ============================================
# CHECK 1: .env NÃO pode ser commitado
# ============================================
ENV_FILES=$(echo "$STAGED" | grep -E "(^|/)\.env(\.|$)" | grep -v "\.env\.example" || true)
if [ -n "$ENV_FILES" ]; then
  fail ".env staged pra commit! Secrets nunca vão pro git."
  echo "$ENV_FILES" | sed 's/^/    /'
  echo "    Solução: git reset HEAD <arquivo>  +  adicionar .env ao .gitignore"
fi

# ============================================
# CHECK 2: docker-compose.yml — defesas obrigatórias
# ============================================
COMPOSE_FILES=$(echo "$STAGED" | grep -E "(docker-compose.*\.ya?ml|^compose\.ya?ml|compose\.[^/]+\.ya?ml)$" || true)

if [ -n "$COMPOSE_FILES" ]; then
  echo "Checking compose files..."
  for f in $COMPOSE_FILES; do
    [ ! -f "$f" ] && continue

    # 2a. App services SEM init: true (heurística por container_name)
    # awk pra evitar dependency de grep -P
    NEEDS_INIT=$(awk '
      /container_name:.*-(backend|api|worker|app|web|server|sidekiq)$/ {
        cname=$NF
        in_service=1
        has_init=0
        next
      }
      in_service && /^  [a-z]/ {
        if (!has_init) print cname
        in_service=0
      }
      in_service && /init:[[:space:]]*true/ {
        has_init=1
      }
      END {
        if (in_service && !has_init) print cname
      }
    ' "$f" | head -1)
    if [ -n "$NEEDS_INIT" ]; then
      warn "$f: '$NEEDS_INIT' sem 'init: true' — adicione para reapear zombies (PID 1 reaper)"
    fi

    # 2b. tsx / ts-node / nodemon / uvicorn --reload / vite dev em compose
    # Cobre: "npx tsx", "npx", "tsx" (array form), command com tsx
    if grep -nE '("npx",[[:space:]]*"tsx"|npx tsx|npx ts-node|ts-node-dev|nodemon|uvicorn[^"]*--reload|vite dev)' "$f" >/dev/null 2>&1; then
      fail "$f: comando de DEV em compose de produção"
      grep -nE '("npx",[[:space:]]*"tsx"|npx tsx|npx ts-node|ts-node-dev|nodemon|uvicorn[^"]*--reload|vite dev)' "$f" | head -3 | sed 's/^/    /'
      echo "    Solução: compilar em build (tsc -> node dist/) ou uvicorn sem --reload"
    fi

    # 2c. DB ports em 0.0.0.0 (sem prefixo 127.0.0.1)
    # Skip arquivos .dev e .override.smoke (intencionalmente expostos)
    if ! echo "$f" | grep -qE "\.dev\.|\.override\.smoke\."; then
      if grep -nE '^[[:space:]]*-?[[:space:]]*"[0-9]+:(5432|6379|3306|27017|9200)"' "$f" >/dev/null 2>&1; then
        fail "$f: porta de DB/cache publicada em 0.0.0.0 (acessível da internet)"
        grep -nE '^[[:space:]]*-?[[:space:]]*"[0-9]+:(5432|6379|3306|27017|9200)"' "$f" | head -3 | sed 's/^/    /'
        echo "    Solução: prefixar com 127.0.0.1, ex: \"127.0.0.1:5434:5432\""
      fi
    fi

    # 2d. Traefik routers com .entrypoints SEM .rule correspondente
    # Usa awk em vez de grep -oP
    ROUTERS_NO_RULE=$(awk -F'.' '
      /traefik\.http\.routers\.[a-zA-Z0-9_-]+\.entrypoints=/ {
        # Extrair router name
        match($0, /traefik\.http\.routers\.([a-zA-Z0-9_-]+)\.entrypoints/, arr)
        if (arr[1]) entry_routers[arr[1]] = 1
      }
      /traefik\.http\.routers\.[a-zA-Z0-9_-]+\.rule=/ {
        match($0, /traefik\.http\.routers\.([a-zA-Z0-9_-]+)\.rule/, arr)
        if (arr[1]) rule_routers[arr[1]] = 1
      }
      END {
        for (r in entry_routers) {
          if (!(r in rule_routers)) print r
        }
      }
    ' "$f" 2>/dev/null)
    if [ -n "$ROUTERS_NO_RULE" ]; then
      for r in $ROUTERS_NO_RULE; do
        fail "$f: router '$r' tem .entrypoints mas SEM .rule (causa ACME bug)"
        echo "    Solução: 'traefik.http.routers.${r}.rule=Host(\`<dominio>\`)'"
      done
    fi

    # 2e. environment: com secrets literais (heurística)
    SECRET_LEAK=$(grep -nE "^[[:space:]]+-?[[:space:]]*(JWT_SECRET|POSTGRES_PASSWORD|API_KEY|TOKEN)=[a-zA-Z0-9_/+=]{8,}" "$f" 2>/dev/null | grep -vE "(CHANGE_ME|change.?me|\\\$\{)" || true)
    if [ -n "$SECRET_LEAK" ]; then
      fail "$f: secret literal em environment — use env_file: [.env]"
      echo "$SECRET_LEAK" | head -3 | sed 's/^/    /'
    fi
  done
fi

# ============================================
# CHECK 3: Dockerfile — sem dev runtime
# ============================================
DOCKERFILES=$(echo "$STAGED" | grep -E "Dockerfile" || true)
if [ -n "$DOCKERFILES" ]; then
  echo "Checking Dockerfiles..."
  for f in $DOCKERFILES; do
    [ ! -f "$f" ] && continue

    # CMD/ENTRYPOINT com tsx/ts-node/nodemon
    if grep -nE "^(CMD|ENTRYPOINT).*(\"tsx\"|npx tsx|ts-node|nodemon)" "$f" >/dev/null 2>&1; then
      fail "$f: CMD/ENTRYPOINT usa runtime de dev (tsx/ts-node/nodemon)"
      grep -nE "^(CMD|ENTRYPOINT).*(\"tsx\"|npx tsx|ts-node|nodemon)" "$f" | sed 's/^/    /'
      echo "    Solução: compilar com tsc em build, runtime usa 'node dist/index.js'"
    fi

    # uvicorn --reload em CMD
    if grep -nE "^(CMD|ENTRYPOINT).*uvicorn.*--reload" "$f" >/dev/null 2>&1; then
      fail "$f: uvicorn --reload em produção"
      echo "    Solução: 'uvicorn app:app --host 0.0.0.0 --port 8000 --workers 2'"
    fi

    # npx -y em CMD/ENTRYPOINT
    if grep -nE "^(CMD|ENTRYPOINT).*npx -y" "$f" >/dev/null 2>&1; then
      warn "$f: 'npx -y' em CMD — resolve a cada start, risco supply chain"
    fi
  done
fi

# ============================================
# CHECK 4: Frontend XSS (innerHTML com user data)
# ============================================
FRONTEND_FILES=$(echo "$STAGED" | grep -E "\.(js|jsx|ts|tsx|html|vue)$" | grep -vE "(node_modules|/dist/|\.next/|/build/|test|spec|\.example|\.md)" || true)
if [ -n "$FRONTEND_FILES" ]; then
  for f in $FRONTEND_FILES; do
    [ ! -f "$f" ] && continue

    # Skip ARQUIVO próprio de helpers de escape (utils.js comum)
    if echo "$f" | grep -qE "(js/utils\.js|utils/escape\.js|lib/sanitize\.)"; then
      continue
    fi

    # innerHTML/outerHTML com template literal contendo ${var}
    # Excluir linhas em comentários ou que tenham escapeHtml/sanitize/DOMPurify
    BAD_INNER=$(grep -nE "(innerHTML|outerHTML)[[:space:]]*=" "$f" 2>/dev/null | \
                grep -vE "(escapeHtml|escapeAttr|textContent|innerText|DOMPurify|sanitize|^[[:space:]]*\*|^[[:space:]]*//)" | \
                grep -E '\$\{' | head -3)
    if [ -n "$BAD_INNER" ]; then
      warn "$f: innerHTML/outerHTML com template literal sem escape"
      echo "$BAD_INNER" | sed 's/^/    /'
      echo "    Recomendação: usar escapeHtml() ou textContent/createElement"
    fi

    # dangerouslySetInnerHTML em React (não-shadcn chart)
    if grep -nE "dangerouslySetInnerHTML" "$f" >/dev/null 2>&1; then
      if [ "$(basename "$f")" != "chart.tsx" ]; then
        warn "$f: dangerouslySetInnerHTML — confirme sanitização (DOMPurify)"
      fi
    fi

    # v-html (Vue) com variável
    if grep -nE 'v-html=' "$f" >/dev/null 2>&1; then
      warn "$f: v-html — Vue não escapa, garantir sanitização"
    fi
  done
fi

# ============================================
# Resultado final
# ============================================
echo ""
if [ "$FAIL" -eq 1 ]; then
  red "Pre-commit: BLOQUEADO. Corrija acima ou use 'git commit --no-verify' (justificar)."
  exit 1
else
  green "Pre-commit: OK"
  exit 0
fi
