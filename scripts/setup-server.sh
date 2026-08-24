#!/bin/bash
# ============================================
# Script de Setup Inicial - Scampanha
# Executar como root no droplet
# ============================================

set -e

echo "========================================"
echo "Setup Inicial - Scampanha"
echo "========================================"

# 1. Atualizar sistema
echo "[1/6] Atualizando sistema..."
apt update && apt upgrade -y

# 2. Instalar Docker
echo "[2/6] Instalando Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    usermod -aG docker root
    systemctl enable docker
fi

# 3. Instalar Nginx
echo "[3/6] Instalando Nginx..."
apt install -y nginx

# 4. Criar diretório do projeto
echo "[4/6] Criando diretório..."
mkdir -p /opt/scampanha
chown root:root /opt/scampanha
chmod 755 /opt/scampanha

# 5. Configurar Nginx
echo "[5/6] Configurando Nginx..."
cat > /etc/nginx/sites-available/scampanha << 'EOF'
upstream scampanha {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name YOUR_IP_HERE;

    location / {
        proxy_pass http://scampanha;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    access_log /var/log/nginx/scampanha_access.log;
    error_log /var/log/nginx/scampanha_error.log;
    client_max_body_size 10M;

    location /_next/static {
        proxy_pass http://scampanha;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
EOF

ln -sfn /etc/nginx/sites-available/scampanha /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# 6. Permitir firewall básico
echo "[6/6] Configurando firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw --force enable

echo ""
echo "========================================"
echo "Setup Concluído!"
echo "========================================"
echo ""
echo "Próximos passos:"
echo "1. Edite /etc/nginx/sites-available/scampanha e troque YOUR_IP_HERE pelo IP real"
echo "2. Crie o arquivo /opt/scampanha/.env.production"
echo "3. Clone o repositório em /opt/scampanha"
echo ""
echo "Consulte DEPLOY.md para instruções completas."
