#!/usr/bin/env bash
# setup-hooks.sh — instala git hooks deste projeto após clone fresco.
# Uso: bash scripts/setup-hooks.sh
set -e
cd "$(dirname "$0")/.."
chmod +x scripts/pre-commit-check.sh
ln -sf ../../scripts/pre-commit-check.sh .git/hooks/pre-commit
echo "✓ Pre-commit hook instalado. Standards: c:\projetos\.claude\CLAUDE.md"
