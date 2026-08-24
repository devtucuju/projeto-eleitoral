#!/bin/bash
# ============================================
# Script de Setup Inicial - Scampanha
# Executar como root no droplet
# ============================================

set -e

# Variáveis - EDITE ESTES VALORES
GITHUB_USER="SEU_USUARIO_GITHUB"  # Troque pelo seu usuário GitHub
SERVER_IP=$(curl -s ifconfig.me)   # Pega IP automaticamente

echo "========================================"
echo "Setup Inicial - Scampanha"
echo "IP detectado: $SERVER_IP"
echo "========================================"

# 1. Atualizar sistema
echo "[1/7] Atualizando sistema..."
apt update && apt upgrade -y

# 2. Instalar Docker
echo "[2/7] Instalando Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    usermod -aG docker root
fi
echo "✅ Docker instalado"

# 3. Instalar Nginx
echo "[3/7] Instalando Nginx..."
apt install -y nginx curl
echo "✅ Nginx instalado"

# 4. Criar diretório
echo "[4/7] Criando diretório..."
mkdir -p /opt/scampanha
chown root:root /opt/scampanha
chmod 755 /opt/scampanha
cd /opt/scampanha
echo "✅ Diretório criado"

# 5. Baixar arquivos do GitHub
echo "[5/7] Baixando arquivos do GitHub..."
curl -fsSL "https://raw.githubusercontent.com/${GITHUB_USER}/projeto-eleitoral/main/docker-compose.prod.yml" -o docker-compose.prod.yml
curl -fsSL "https://raw.githubusercontent.com/${GITHUB_USER}/projeto-eleitoral/main/nginx/scampanha.conf" -o scampanha.conf
echo "✅ Arquivos baixados"

# 6. Configurar Nginx
echo "[6/7] Configurando Nginx..."
sed -i "s/YOUR_IP_HERE/$SERVER_IP/g" /opt/scampanha/scampanha.conf
cp /opt/scampanha/scampanha.conf /etc/nginx/sites-available/
ln -sfn /etc/nginx/sites-available/scampanha /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
echo "✅ Nginx configurado (IP: $SERVER_IP)"

# 7. Firewall
echo "[7/7] Configurando firewall..."
ufw --force enable
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
echo "✅ Firewall configurado"

echo ""
echo "========================================"
echo "✅ Setup Concluído!"
echo "========================================"
echo ""
echo "IP do servidor: $SERVER_IP"
echo ""
echo "Próximos passos:"
echo "1. Crie .env.production: nano /opt/scampanha/.env.production"
echo "2. Configure secrets no GitHub (veja DEPLOY.md)"
echo "3. Após push na main, o deploy será automático"
echo ""
echo "Para criar .env.production, use:"
echo "  openssl rand -base64 32  # para gerar senhas"
echo ""
