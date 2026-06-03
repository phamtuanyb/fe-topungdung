#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# deploy-pm2.sh — Auto deploy FE trên prod (chạy qua PM2)
#
# Quy trình:
#   1. git pull → lấy code mới
#   2. npm ci → cài dependencies (chỉ khi lock file đổi)
#   3. npm run build → build .next
#   4. pm2 reload → restart không downtime
#
# Usage (trên server prod):
#   cd /home/vsoftware.vn      # hoặc thư mục chứa repo FE
#   bash deploy-pm2.sh
# ─────────────────────────────────────────────────────────────────────────────

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${CYAN}==> $1${NC}"; }
ok()   { echo -e "${GREEN}✓ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; }
err()  { echo -e "${RED}✗ $1${NC}"; }

echo ""
log "DEPLOY FE bắt đầu lúc $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# ── Bước 1: Pull code ───────────────────────────────────────────────────────
log "[1/4] git pull origin main"
old_lock_hash=$(md5sum package-lock.json 2>/dev/null | awk '{print $1}' || echo "")
git pull --ff-only origin main
new_lock_hash=$(md5sum package-lock.json 2>/dev/null | awk '{print $1}' || echo "")
ok "Pull xong"

# ── Bước 2: Install deps nếu lock đổi ──────────────────────────────────────
if [[ "$old_lock_hash" != "$new_lock_hash" ]]; then
  log "[2/4] package-lock.json đã đổi → npm ci"
  npm ci
else
  ok "[2/4] deps không đổi, bỏ qua npm install"
fi

# ── Bước 3: Build ───────────────────────────────────────────────────────────
log "[3/4] npm run build (có thể mất 2-5 phút)..."
npm run build
ok "Build xong"

# ── Bước 4: PM2 reload ──────────────────────────────────────────────────────
log "[4/4] PM2 reload vsoftware-fe"
if pm2 describe vsoftware-fe >/dev/null 2>&1; then
  pm2 reload vsoftware-fe --update-env
  ok "FE đã reload (không downtime)"
else
  warn "Process vsoftware-fe chưa tồn tại — khởi động lần đầu:"
  pm2 start ecosystem.config.js
  pm2 save
  ok "FE đã khởi động lần đầu"
fi

echo ""
ok "DEPLOY FE hoàn tất! Truy cập: https://vsoftware.vn"
echo ""
log "Xem log realtime: pm2 logs vsoftware-fe"
