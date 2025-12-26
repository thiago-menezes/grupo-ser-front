# Grupo SER - Frontend (Next.js)

Aplicação frontend construída com **Next.js 16** e **React 19**.

## 🏗️ Arquitetura de Infraestrutura AWS

```mermaid
flowchart TB
    subgraph Internet
        USER[("🌐 Usuários")]
    end

    subgraph AWS["☁️ AWS Cloud"]
        WAF["🛡️ AWS WAF"]
        CF["📦 CloudFront CDN"]
        ALB["⚖️ Application Load Balancer"]

        subgraph VPC["🔒 VPC - Private Subnets"]
            subgraph ECS["ECS Fargate Cluster"]
                NEXT["🖥️ Next.js Container<br/>Node.js 22+<br/><b>BFF Layer</b>"]
            end
        end

        STRAPI[("🚀 Strapi CMS<br/>Conteúdo/Marketing")]
    end

    subgraph External["🌍 APIs Externas"]
        SEAPI["📡 API SE Educacional<br/>lps-nvps.sereducacional.com"]
        COURSESAPI["📚 API de Cursos"]
    end

    USER --> WAF --> CF
    CF -->|"*.dominio.com.br"| ALB
    ALB --> NEXT

    NEXT -->|"Conteúdo CMS"| STRAPI
    NEXT -->|"Dados do Cliente"| SEAPI
    NEXT -->|"Cursos/Preços"| COURSESAPI
```

## 📊 Fluxo de Dados (BFF Pattern)

O Next.js atua como **BFF (Backend for Frontend)**, agregando dados de múltiplas fontes:

| Fonte                  | Dados                      | Uso                    |
| ---------------------- | -------------------------- | ---------------------- |
| **Strapi CMS**         | Banners, FAQs, Textos, SEO | Páginas institucionais |
| **API SE Educacional** | Leads, Formulários         | Captação de alunos     |
| **API de Cursos**      | Cursos, Preços, Campus     | Listagem e busca       |

```mermaid
flowchart LR
    subgraph NextJS["Next.js API Routes (BFF)"]
        direction TB
        BFF["Agregação<br/>de Dados"]
    end

    STRAPI["Strapi"] -->|"GET /api/*"| BFF
    SEAPI["API SE"] -->|"POST leads"| BFF
    COURSES["API Cursos"] -->|"GET cursos"| BFF

    BFF --> CLIENT["React Client"]
```

## 🌐 Arquitetura de Domínio (V1)

Na V1, o site será acessado via **cursos.unama.com.br** (em vez de `www.dominio.com/unama`):

```mermaid
flowchart LR
    subgraph DNS["🌍 Route 53"]
        CNAME["cursos.unama.com.br<br/>CNAME → CloudFront"]
    end

    subgraph CDN["📦 CloudFront"]
        CF["Distribution<br/>Alternate Domain:<br/>cursos.unama.com.br"]
        CERT["🔒 ACM Certificate<br/>*.unama.com.br"]
    end

    subgraph Origin["🎯 Origin"]
        ALB["ALB<br/>grupo-ser-alb"]
        NEXT["Next.js<br/>ECS Fargate"]
    end

    CNAME --> CF
    CF -.->|"SSL/TLS"| CERT
    CF -->|"Host: cursos.unama.com.br"| ALB
    ALB --> NEXT
```

### Configuração de Domínio

| Componente     | Configuração                       | Descrição                                |
| -------------- | ---------------------------------- | ---------------------------------------- |
| **Route 53**   | `cursos.unama.com.br` → CloudFront | CNAME ou Alias Record                    |
| **ACM**        | `*.unama.com.br`                   | Certificado wildcard na região us-east-1 |
| **CloudFront** | Alternate Domain Name              | `cursos.unama.com.br`                    |
| **ALB**        | Host Header                        | Recebe requisições do CloudFront         |
| **Next.js**    | `APP_BASE_URL`                     | `https://cursos.unama.com.br`            |

> [!NOTE]
> O certificado ACM **deve** estar na região `us-east-1` para uso com CloudFront.

## 📋 Requisitos de Infraestrutura

| Recurso               | Configuração            | Descrição                           |
| --------------------- | ----------------------- | ----------------------------------- |
| **Container Runtime** | Docker                  | Imagem baseada em Node.js 22 Alpine |
| **Porta**             | `3000`                  | Porta exposta pelo Next.js          |
| **Memória**           | 512MB - 1GB             | Recomendado para produção           |
| **CPU**               | 0.25 - 0.5 vCPU         | Escalável conforme demanda          |
| **Health Check**      | `GET /api/health-check` | Endpoint para verificação de saúde  |

## 🔧 Variáveis de Ambiente

### Obrigatórias

| Variável               | Descrição                                                 |
| ---------------------- | --------------------------------------------------------- |
| `NODE_ENV`             | `production`                                              |
| `STRAPI_URL`           | URL interna do Strapi (ex: `http://strapi.internal:1337`) |
| `STRAPI_TOKEN`         | Token de API do Strapi                                    |
| `API_BASE_URL`         | URL da API SE Educacional                                 |
| `COURSES_API_BASE_URL` | URL da API de Cursos                                      |
| `APP_BASE_URL`         | URL pública do site                                       |

### Opcionais / Públicas

| Variável                         | Descrição                           |
| -------------------------------- | ----------------------------------- |
| `NEXT_PUBLIC_STRAPI_URL`         | URL pública do Strapi (para assets) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Chave do Google reCAPTCHA v3        |
| `REVALIDATION_SECRET`            | Token para ISR on-demand            |
| `CDN_URL`                        | URL do CloudFront para assets       |

## 🐳 Build Docker

```bash
# Build da imagem
docker build -t grupo-ser-next .

# Executar localmente
docker run -p 3000:3000 \
  -e STRAPI_URL=http://localhost:1337 \
  -e API_BASE_URL=https://lps-nvps.sereducacional.com \
  -e APP_BASE_URL=http://localhost:3000 \
  grupo-ser-next
```

## 📦 Serviços AWS Necessários

1. **ECR** - Repositório Docker para a imagem
2. **ECS Fargate** - Execução do container
3. **ALB** - Load Balancer com Target Group na porta 3000
4. **CloudFront** - CDN para cache de assets estáticos
5. **WAF** - Proteção contra ataques web
6. **Route 53** - DNS (opcional)
7. **ACM** - Certificado SSL

## 🚀 Deploy

O deploy é automatizado via GitHub Actions. Veja `.github/workflows/deploy-next.yml`.
