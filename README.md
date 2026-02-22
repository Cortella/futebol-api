# Futebol API

API RESTful para gerenciamento de dados de futebol.

## Stack

- **Node.js** + **TypeScript**
- **Express** — HTTP framework
- **TypeORM** — ORM com suporte a migrations
- **PostgreSQL** — banco de dados
- **Zod** — validação de schemas

## Pré-requisitos

- Node.js 18+
- PostgreSQL rodando localmente ou via Docker

## Setup

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env

# Rodar migrations
npm run migration:run

# Iniciar em desenvolvimento
npm run dev
```

## Scripts

| Comando                  | Descrição                          |
|--------------------------|------------------------------------|
| `npm run dev`            | Inicia servidor em modo dev        |
| `npm run build`          | Compila TypeScript                 |
| `npm start`              | Inicia servidor compilado          |
| `npm run migration:generate` | Gera migration baseada nas entities |
| `npm run migration:run`  | Executa migrations pendentes       |
| `npm run migration:revert` | Reverte última migration         |

## Estrutura

```
src/
├── config/          # Configurações (data-source, env)
├── entities/        # Entidades TypeORM
├── migrations/      # Migrations do banco
├── repositories/    # Repositórios customizados
├── services/        # Lógica de negócio
├── controllers/     # Controllers HTTP
├── routes/          # Definição de rotas
├── middlewares/      # Middlewares Express
├── errors/          # Classes de erro customizadas
└── server.ts        # Entry point
```
