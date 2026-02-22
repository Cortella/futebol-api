# Copilot Instructions — futebol-api

## Visão Geral do Projeto

API RESTful para gerenciamento de dados de futebol, construída com Node.js.

### Stack Tecnológica

- **Runtime:** Node.js + TypeScript (strict mode)
- **Framework HTTP:** Express
- **ORM:** TypeORM (PostgreSQL)
- **Validação:** Zod (schemas em `src/schemas/`)
- **Documentação:** Swagger UI em `/api/docs`
- **Testes:** Jest com ts-jest (meta: 100% coverage)
- **Lint/Format:** ESLint (flat config) + Prettier

---

## Arquitetura & Convenções

### Estrutura de Pastas

```
src/
├── config/          # Data source, env, swagger
├── entities/        # Entidades TypeORM (decorators)
├── schemas/         # Schemas Zod (validação de input)
├── services/        # Lógica de negócio (1 service por entity)
├── controllers/     # Controllers HTTP (1 controller por entity)
├── routes/          # Definição de rotas Express (1 arquivo por entity + index)
├── middlewares/     # Middlewares Express (errorHandler global)
├── errors/          # Classes de erro customizadas (AppError)
├── migrations/      # Migrations TypeORM
└── __tests__/       # Testes unitários espelhando a estrutura de src/
```

### Padrões de Código

- **Linguagem:** Sempre TypeScript. Nunca `any` sem justificativa (lint: warn).
- **Naming:** Classes em PascalCase, variáveis/funções em camelCase, arquivos de entity em PascalCase, demais em camelCase ou kebab-case.
- **Formatação:** Prettier (tab: 2 espaços, max: 100 colunas, trailing comma, aspas duplas).
- **Espaçamento:** Linha em branco obrigatória após blocos, funções e classes (ESLint: `padding-line-between-statements`).
- **Imports:** Sem alias com `@/` nos testes; usar caminhos relativos.

### Fluxo de Request

```
Request → Express Middleware (helmet, cors, json)
        → Router (/api)
        → Controller (valida input com Zod schema)
        → Service (lógica de negócio)
        → TypeORM Repository (acesso ao banco)
        → Response (JSON)
        → Error Handler (AppError → status code, ZodError → 422, genérico → 500)
```

### Entidades Atuais

| Entity   | Tabela    | Relação                     |
| -------- | --------- | --------------------------- |
| `Team`   | `teams`   | OneToMany → Player          |
| `Player` | `players` | ManyToOne → Team (SET NULL) |

### Endpoints Base

- **Base:** `/api`
- **Swagger UI:** `/api/docs`
- **Health:** `GET /api/health`
- **Teams CRUD:** `/api/teams`
- **Players CRUD:** `/api/players`
- **Players by Team:** `GET /api/players/team/:teamId`

---

## Regras para Geração de Código

### Ao criar uma nova Entity

1. Criar entity em `src/entities/NomeEntity.ts` com decorators TypeORM.
2. Criar schema Zod em `src/schemas/nomeEntity.schema.ts` com `create` e `update` (partial).
3. Criar service em `src/services/NomeEntityService.ts` com CRUD completo.
4. Criar controller em `src/controllers/NomeEntityController.ts` usando Zod para validar input.
5. Criar rotas em `src/routes/nomeEntity.routes.ts` e registrar no `src/routes/index.ts`.
6. Documentar no `src/config/swagger.ts` (schemas + paths).
7. Criar testes em `src/__tests__/` espelhando cada arquivo, com mocks do TypeORM.
8. Rodar `npm run test:coverage` — deve manter 100%.
9. Rodar `npm run lint:fix` antes de commitar.

### Ao criar um novo Endpoint

1. Adicionar rota no arquivo `.routes.ts` correspondente.
2. Adicionar método no controller.
3. Adicionar método no service se necessário.
4. Documentar no swagger.ts.
5. Cobrir com testes.

### Ao criar uma Migration

- Usar `npm run migration:generate` para gerar automaticamente.
- Sempre nomear descritivamente.
- Nunca usar `synchronize: true` em produção.

---

## Regras de Negócio

> Seção reservada para regras de domínio do futebol.
> Adicione aqui as regras conforme o projeto evolui.

### Regras Gerais

<!-- Exemplo:
- Um jogador só pode pertencer a um time por vez.
- O número da camisa (1-99) deve ser único dentro do mesmo time.
- Times não podem ser removidos se tiverem jogadores vinculados (ou: jogadores ficam sem time).
-->

### Regras de Time (Team)

<!-- Exemplo:
- Nome do time deve ser único.
- Ano de fundação não pode ser no futuro.
- Cada time deve ter no mínimo 11 jogadores para ser considerado "ativo".
-->

### Regras de Jogador (Player)

<!-- Exemplo:
- Jogador deve ter no mínimo 16 anos.
- Posições válidas: Goalkeeper, Defender, Midfielder, Forward.
- Transferência entre times deve registrar histórico.
-->

### Regras de Competição (futuro)

<!-- Reservado para regras de campeonatos, partidas, classificação, etc. -->

### Regras de Transferência (futuro)

<!-- Reservado para janelas de transferência, valores, contratos, etc. -->

---

## Testes

- Framework: Jest + ts-jest
- Meta de cobertura: **100%** (statements, branches, functions, lines)
- Mocks: TypeORM repository é mockado via `jest.mock("../../config/data-source")`
- Padrão: `src/__tests__/<pasta>/<Arquivo>.test.ts`
- Rodar: `npm run test:coverage`

---

## Scripts Disponíveis

| Script                       | Descrição                         |
| ---------------------------- | --------------------------------- |
| `npm run dev`                | Servidor dev com hot reload       |
| `npm run build`              | Compilar TypeScript               |
| `npm start`                  | Servidor compilado                |
| `npm run test`               | Rodar testes                      |
| `npm run test:coverage`      | Testes com relatório de cobertura |
| `npm run lint`               | Verificar lint                    |
| `npm run lint:fix`           | Corrigir lint automaticamente     |
| `npm run format`             | Formatar com Prettier             |
| `npm run migration:generate` | Gerar migration                   |
| `npm run migration:run`      | Aplicar migrations                |
| `npm run migration:revert`   | Reverter última migration         |
