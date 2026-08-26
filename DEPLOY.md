# Deploy - Projeto Eleitoral

## Índice
1. [Criar Droplet no DigitalOcean](#1-criar-droplet-no-digitalocean)
2. [Setup Inicial do Servidor](#2-setup-inicial-do-servidor)
3. [Configurar GitHub Secrets](#3-configurar-github-secrets)
4. [Primeiro Deploy](#4-primeiro-deploy)
5. [Migração do Banco de Dados](#5-migração-do-banco-de-dados)
6. [Renovar SSL (futuro)](#6-renovar-ssl-futuro)

---

## 1. Criar Droplet no DigitalOcean

### Especificações Recomendadas
- **Image**: Ubuntu 22.04 LTS
- **Size**: s-2vcpu-2gb (~$16/mês) ou s-1vcpu-2gb (~$8/mês para início)
- **Region**: São Paulo (sp1)
- **Authentication**: Chave SSH (crie uma nova para este projeto)

### Após criar, anote:
- IP do droplet (ex: `167.99.123.456`)
- Username (normalmente `root`)

---

## 2. Setup Inicial do Servidor

### 2.1 Conectar ao droplet
```bash
ssh root@SEU_IP_AQUI
```

### 2.2 Atualizar sistema
```bash
apt update && apt upgrade -y
```

### 2.3 Instalar Docker
```bash
curl -fsSL https://get.docker.com | sh
usermod -aG docker root
systemctl enable docker
```

### 2.4 Criar usuário para deploy (opcional, mas recomendado)
```bash
# Criar usuário
adduser deploy
usermod -aG docker deploy

# Permitir sudo sem senha (para CI/CD)
echo "deploy ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

# Configurar SSH para o usuário deploy
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```

### 2.5 Criar diretório do projeto
```bash
mkdir -p /opt/scampanha
chown deploy:deploy /opt/scampanha
```

### 2.6 Configurar Nginx
```bash
apt install -y nginx

# Copiar config (edite IP antes!)
nano /opt/scampanha/scampanha.conf
# Altere "SEU_IP_AQUI" para o IP real do droplet

# Ativar site
cp /opt/scampanha/scampanha.conf /etc/nginx/sites-available/
ln -sfn /etc/nginx/sites-available/scampanha /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar e recarregar
nginx -t
systemctl reload nginx
```

### 2.7 Configurar Firewall (opcional mas recomendado)
```bash
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS (futuro)
ufw enable
```

---

## 3. Configurar GitHub Secrets

### 3.1 Acessar Secrets
Vá em: `https://github.com/SEU_USUARIO/projeto-eleitoral/settings/secrets/actions`

### 3.2 Criar Secrets

| Secret Name | Valor |
|-------------|-------|
| `DO_HOST` | IP do droplet (ex: `167.99.123.456`) |
| `DO_USER` | `root` ou `deploy` |
| `DO_SSH_KEY` | Chave SSH privada ( conteúdo do arquivo `~/.ssh/id_rsa`) |

### Como obter a chave SSH:
```bash
# No seu computador local, mostre a chave privada
cat ~/.ssh/id_rsa
# Copie TODO o conteúdo incluindo -----BEGIN OPENSSH PRIVATE KEY-----
```

### 3.3 Variáveis do Repositório (Settings > Variables > Actions)

| Variable | Valor |
|----------|-------|
| `NEXTAUTH_URL` | `http://SEU_IP_AQUI` |

---

## 4. Primeiro Deploy

### 4.1 Criar .env.production no servidor
```bash
cd /opt/scampanha
nano .env.production
```

Conteúdo:
```env
DB_NAME=scampanha
DB_USER=postgres
DB_PASSWORD=GERE UMA SENHA FORTE AQUI
NEXTAUTH_SECRET=GERE UMA SENHA FORTE (openssl rand -base64 32)
NEXTAUTH_URL=http://SEU_IP_AQUI
```

Para gerar senhas:
```bash
# Senha do banco
openssl rand -base64 32

# Secret do NextAuth
openssl rand -base64 32
```

### 4.2 Fazer push do código
```bash
# No seu computador local
cd /home/devtucuju/scampanha

# Se ainda não inicializou git
git init
git add .
git commit -m "Initial commit - CI/CD setup"

# Criar repositório no GitHub (via CLI ou web)
gh repo create projeto-eleitoral --public --source=. --remote=origin

# Push
git branch -M main
git push -u origin main
```

### 4.3 Deploy Manual (para garantir que funciona)
```bash
# No servidor
cd /opt/scampanha

# Login no GHCR
echo "$GITHUB_TOKEN" | docker login ghcr.io -u SEU_USUARIO --password-stdin
# Ou use o PAT do GitHub

# Definir IMAGE_TAG (primeiro commit SHA)
export IMAGE_TAG=$(git -C /opt/scampanha log --oneline -1 | awk '{print $1}')
# Ou pegue do primeiro push

# Fazer deploy manual
docker compose --env-file .env.production -f docker-compose.prod.yml pull
docker compose --env-file .env.production -f docker-compose.prod.yml up -d

# Verificar
docker compose ps
curl http://localhost:3000/api/health
```

> **Migrations automáticas**: o container `app` agora roda `npx prisma migrate deploy` antes de iniciar o servidor. Se o banco já estiver baselinado (ex.: deploy anterior), basta subir — migrations pendentes aplicam sozinhas. Para basar manualmente:
> ```bash
> docker compose --env-file .env.production -f docker-compose.prod.yml exec -T app \
>   npx prisma migrate resolve --applied 20260101000000_init
> docker compose --env-file .env.production -f docker-compose.prod.yml exec -T app \
>   npx prisma migrate resolve --applied 20260101000100_add_pessoa
> ```

---

## 5. Migração do Banco de Dados

### 5.1 Exportar dados do banco atual (local)
```bash
# Se o banco local está rodando via docker
docker compose exec db pg_dump -U postgres scampanha > backup_$(date +%Y%m%d).sql

# Ou se for local (não-docker)
pg_dump -h localhost -U postgres -d scampanha > backup_$(date +%Y%m%d).sql
```

### 5.2 Importar no servidor de produção
```bash
# Copiar backup para o servidor
scp backup_20240101.sql root@SEU_IP:/tmp/

# No servidor
docker compose --env-file .env.production -f docker-compose.prod.yml exec -T db \
  psql -U postgres -d scampanha < /tmp/backup_20240101.sql
```

### 5.3 Gerar dados de seed (se necessário)
```bash
docker compose --env-file .env.production -f docker-compose.prod.yml exec -T app \
  npx prisma db seed
```

---

## 6. Renovar SSL (Futuro)

Quando for adicionar domínio com SSL:

### 6.1 Instalar Certbot
```bash
apt install -y certbot python3-certbot-nginx
```

### 6.2 Obter certificado
```bash
certbot --nginx -d scampanha.seudominio.com
```

### 6.3 Atualizar Nginx
Edite `/etc/nginx/sites-available/scampanha` e descomente as linhas de SSL.

---

## Comandos Úteis

```bash
# Ver logs
docker compose logs -f app

# Ver logs do banco
docker compose logs -f db

# Restart
docker compose restart app

# Bash dentro do container
docker compose exec app sh

# Ver uso de recursos
docker stats

# Limpar imagens antigas
docker image prune -af --filter "until=24h"

# Backup do banco
docker compose exec -T db pg_dump -U postgres scampanha > backup.sql
```

---

## Troubleshooting

### Container não sobe
```bash
docker compose logs app
docker compose exec app sh
```

### Erro de conexão com banco
```bash
docker compose exec db pg_isready -U postgres
docker compose exec app sh -c "wget --spider http://localhost:3000/api/health"
```

### Nginx 502 Bad Gateway
```bash
systemctl status nginx
docker compose ps
curl http://127.0.0.1:3000/api/health
```
