#!/usr/bin/env bash
# ============================================================
# StarKids 一键部署脚本 (本地执行)
# 用法: ./deploy.sh <服务器IP> [SSH密钥路径] [域名]
# 示例: ./deploy.sh 8.134.198.42 ~/.ssh/ssh.pem lyldalek.top
# 功能: 打包代码 -> 上传服务器 -> 构建镜像 -> 启动容器 -> 健康检查
# ============================================================
set -euo pipefail

SERVER="${1:?用法: ./deploy.sh <服务器IP> [SSH密钥路径] [域名]}"
KEY="${2:-$HOME/.ssh/ssh.pem}"
DOMAIN="${3:-lyldalek.top}"
REMOTE_DIR="/opt/starkids"
TARBALL="/tmp/starkids-deploy-$(date +%s).tar.gz"
SSH="ssh -i $KEY -o StrictHostKeyChecking=accept-new"
SCP="scp -i $KEY"

echo "==> [1/5] 打包代码 (排除 .git/node_modules/.next/.env)"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
tar czf "$TARBALL" \
  --exclude=.git --exclude=node_modules --exclude=.next \
  --exclude='*.db' --exclude=.env --exclude=tsconfig.tsbuildinfo \
  -C "$(dirname "$PROJECT_DIR")" "$(basename "$PROJECT_DIR")"
echo "    打包完成: $TARBALL"

echo "==> [2/5] 上传到服务器 $SERVER"
$SCP "$TARBALL" "root@$SERVER:/tmp/starkids-deploy.tar.gz"
$SSH "root@$SERVER" "mkdir -p $REMOTE_DIR && tar xzf /tmp/starkids-deploy.tar.gz -C /tmp && cp -rf /tmp/$(basename "$PROJECT_DIR")/. $REMOTE_DIR/ && rm -rf /tmp/$(basename "$PROJECT_DIR") /tmp/starkids-deploy.tar.gz"

echo "==> [3/5] 服务器环境检查 (swap / .env)"
$SSH "root@$SERVER" "DOMAIN='$DOMAIN' bash -s" <<'REMOTE'
set -euo pipefail
cd /opt/starkids

# --- swap 检查: 内存 < 2.5G 且无 swap 时创建 2G swap ---
MEM_GB=$(free -g | awk '/^Mem:/{print $2}')
SWAP_GB=$(free -g | awk '/^Swap:/{print $2}')
if [ "$MEM_GB" -lt 3 ] && [ "$SWAP_GB" -eq 0 ]; then
  echo "    创建 2G swap (构建需要)..."
  fallocate -l 2G /swapfile && chmod 600 /swapfile
  mkswap /swapfile >/dev/null && swapon /swapfile
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# --- .env: 不存在则生成 (AUTH_SECRET 保持稳定, 重复部署不覆盖) ---
if [ ! -f .env ]; then
  SECRET=$(openssl rand -base64 32)
  cat > .env <<EOF
AUTH_SECRET="$SECRET"
AUTH_URL=http://${DOMAIN:-lyldalek.top}
NEXT_PUBLIC_APP_URL=http://${DOMAIN:-lyldalek.top}
IMAGE_TAG=local
EOF
  echo "    已生成 .env (AUTH_SECRET 已随机生成)"
else
  echo "    .env 已存在, 保留"
fi
REMOTE

echo "==> [4/5] 构建镜像并启动 (首次约 10-15 分钟, 之后有缓存会快)"
$SSH "root@$SERVER" "cd $REMOTE_DIR && docker build --build-arg DATABASE_URL='postgresql://starkids:starkids@db:5432/starkids' -t ghcr.io/panda-995/starkids:local . 2>&1 | tail -3 && docker compose up -d --build 2>&1 | tail -4"

echo "==> [5/5] 健康检查"
sleep 10
$SSH "root@$SERVER" "docker compose -f $REMOTE_DIR/docker-compose.yml ps --format 'table {{.Name}}\t{{.Status}}'"
echo ""
echo "✅ 部署完成!"
echo "   访问地址: http://${DOMAIN:-lyldalek.top}/kidstar"
echo "   (根路径会自动跳转到 /kidstar)"
