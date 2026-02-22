import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FutManager API",
      version: "1.0.0",
      description:
        "API RESTful para o FutManager — simulador de gerenciamento de futebol brasileiro inspirado no Brasfoot",
      contact: {
        name: "Cortella",
        url: "https://github.com/Cortella/futebol-api",
      },
    },
    servers: [
      {
        url: "/api",
        description: "API base path",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Informe o token JWT obtido no login",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            },
            username: { type: "string", example: "cortella" },
            email: { type: "string", format: "email", example: "cortella@email.com" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        RegisterInput: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: {
              type: "string",
              minLength: 3,
              maxLength: 20,
              pattern: "^[a-zA-Z0-9]+$",
              example: "cortella",
            },
            email: { type: "string", format: "email", example: "cortella@email.com" },
            password: { type: "string", minLength: 6, example: "senha123" },
          },
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "cortella@email.com" },
            password: { type: "string", example: "senha123" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            user: { $ref: "#/components/schemas/User" },
            token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            status: { type: "string", example: "error" },
            message: { type: "string", example: "Resource not found" },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            status: { type: "string", example: "validation_error" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string", example: "email" },
                  message: { type: "string", example: "Invalid email format" },
                },
              },
            },
          },
        },
        Team: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid", example: "b1c2d3e4-f5a6-7890-bcde-fa1234567890" },
            name: { type: "string", example: "Palmeiras" },
            shortName: { type: "string", example: "PAL" },
            city: { type: "string", example: "São Paulo" },
            state: { type: "string", example: "SP" },
            stadium: { type: "string", example: "Allianz Parque" },
            stadiumCapacity: { type: "integer", example: 43713 },
            colors: { type: "string", example: "Verde e Branco" },
            logo: { type: "string", nullable: true, example: "https://example.com/palmeiras.png" },
            prestige: { type: "integer", example: 92 },
            baseWage: { type: "string", example: "1500000000" },
          },
        },
        CreateTeam: {
          type: "object",
          required: [
            "name",
            "shortName",
            "city",
            "state",
            "stadium",
            "stadiumCapacity",
            "colors",
            "prestige",
            "baseWage",
          ],
          properties: {
            name: { type: "string", example: "Palmeiras" },
            shortName: {
              type: "string",
              minLength: 3,
              maxLength: 3,
              pattern: "^[A-Z]{3}$",
              example: "PAL",
            },
            city: { type: "string", example: "São Paulo" },
            state: {
              type: "string",
              minLength: 2,
              maxLength: 2,
              pattern: "^[A-Z]{2}$",
              example: "SP",
            },
            stadium: { type: "string", example: "Allianz Parque" },
            stadiumCapacity: { type: "integer", minimum: 1, example: 43713 },
            colors: { type: "string", example: "Verde e Branco" },
            logo: {
              type: "string",
              format: "uri",
              nullable: true,
              example: "https://example.com/palmeiras.png",
            },
            prestige: { type: "integer", minimum: 1, maximum: 100, example: 92 },
            baseWage: { type: "integer", minimum: 0, example: 1500000000 },
          },
        },
        UpdateTeam: {
          type: "object",
          properties: {
            name: { type: "string", example: "Palmeiras" },
            shortName: { type: "string", pattern: "^[A-Z]{3}$", example: "PAL" },
            city: { type: "string", example: "São Paulo" },
            state: { type: "string", pattern: "^[A-Z]{2}$", example: "SP" },
            stadium: { type: "string", example: "Allianz Parque" },
            stadiumCapacity: { type: "integer", minimum: 1, example: 43713 },
            colors: { type: "string", example: "Verde e Branco" },
            logo: { type: "string", format: "uri", nullable: true },
            prestige: { type: "integer", minimum: 1, maximum: 100, example: 92 },
            baseWage: { type: "integer", minimum: 0, example: 1500000000 },
          },
        },
        Season: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            year: { type: "integer", example: 2026 },
          },
        },
        Championship: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Campeonato Brasileiro" },
            country: { type: "string", example: "Brasil" },
            logo: { type: "string", nullable: true, example: "https://example.com/cbf.png" },
          },
        },
        CreateChampionship: {
          type: "object",
          required: ["name", "country"],
          properties: {
            name: { type: "string", example: "Campeonato Brasileiro" },
            country: { type: "string", example: "Brasil" },
            logo: {
              type: "string",
              format: "uri",
              nullable: true,
              example: "https://example.com/cbf.png",
            },
          },
        },
        UpdateChampionship: {
          type: "object",
          properties: {
            name: { type: "string", example: "Campeonato Brasileiro" },
            country: { type: "string", example: "Brasil" },
            logo: { type: "string", format: "uri", nullable: true },
          },
        },
        Division: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            championshipId: { type: "string", format: "uuid" },
            seasonId: { type: "string", format: "uuid" },
            name: { type: "string", example: "Série A" },
            level: { type: "integer", example: 1 },
            totalTeams: { type: "integer", example: 20 },
            promotionSlots: { type: "integer", example: 4 },
            relegationSlots: { type: "integer", example: 4 },
            totalRounds: { type: "integer", example: 38 },
            status: {
              type: "string",
              enum: ["not_started", "in_progress", "finished"],
              example: "not_started",
            },
            championship: { $ref: "#/components/schemas/Championship" },
            season: { $ref: "#/components/schemas/Season" },
          },
        },
        CreateDivision: {
          type: "object",
          required: [
            "championshipId",
            "seasonId",
            "name",
            "level",
            "totalTeams",
            "promotionSlots",
            "relegationSlots",
          ],
          properties: {
            championshipId: { type: "string", format: "uuid" },
            seasonId: { type: "string", format: "uuid" },
            name: { type: "string", example: "Série A" },
            level: { type: "integer", minimum: 1, maximum: 4, example: 1 },
            totalTeams: { type: "integer", minimum: 2, example: 20 },
            promotionSlots: { type: "integer", minimum: 0, example: 4 },
            relegationSlots: { type: "integer", minimum: 0, example: 4 },
          },
        },
        UpdateDivision: {
          type: "object",
          properties: {
            name: { type: "string", example: "Série A" },
            level: { type: "integer", minimum: 1, maximum: 4, example: 1 },
            totalTeams: { type: "integer", minimum: 2, example: 20 },
            promotionSlots: { type: "integer", minimum: 0, example: 4 },
            relegationSlots: { type: "integer", minimum: 0, example: 4 },
          },
        },
        Career: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            teamId: { type: "string", format: "uuid" },
            seasonId: { type: "string", format: "uuid" },
            divisionId: { type: "string", format: "uuid" },
            currentRound: { type: "integer", example: 1 },
            budget: { type: "string", example: "500000000" },
            reputation: { type: "integer", example: 50 },
            status: {
              type: "string",
              enum: ["active", "finished", "relegated", "champion"],
              example: "active",
            },
            createdAt: { type: "string", format: "date-time" },
            team: { $ref: "#/components/schemas/Team" },
            season: { $ref: "#/components/schemas/Season" },
            division: { $ref: "#/components/schemas/Division" },
          },
        },
        CreateCareer: {
          type: "object",
          required: ["championshipId", "teamId"],
          properties: {
            championshipId: {
              type: "string",
              format: "uuid",
              description: "ID do campeonato para iniciar a carreira",
            },
            teamId: {
              type: "string",
              format: "uuid",
              description: "ID do time que o usuário quer gerenciar",
            },
          },
        },
      },
    },
    paths: {
      "/health": {
        get: {
          tags: ["Health"],
          summary: "Health check",
          description: "Verifica se a API está online",
          responses: {
            200: {
              description: "API online",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                      timestamp: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Criar conta",
          description:
            "Registra um novo usuário no sistema. Username deve ser alfanumérico (3-20 chars), senha mínimo 6 chars.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterInput" },
              },
            },
          },
          responses: {
            201: {
              description: "Usuário criado com sucesso",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AuthResponse" },
                },
              },
            },
            409: {
              description: "Email ou username já em uso",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                  example: { status: "error", message: "Email already in use" },
                },
              },
            },
            422: {
              description: "Erro de validação",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ValidationError" },
                },
              },
            },
          },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login",
          description: "Autentica o usuário e retorna um token JWT válido por 7 dias.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginInput" },
              },
            },
          },
          responses: {
            200: {
              description: "Login realizado com sucesso",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AuthResponse" },
                },
              },
            },
            401: {
              description: "Credenciais inválidas",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                  example: { status: "error", message: "Invalid credentials" },
                },
              },
            },
            422: {
              description: "Erro de validação",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ValidationError" },
                },
              },
            },
          },
        },
      },
      "/teams": {
        get: {
          tags: ["Teams"],
          summary: "Listar todos os times",
          description: "Retorna todos os times cadastrados ordenados por nome.",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Lista de times",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Team" },
                  },
                },
              },
            },
            401: {
              description: "Não autenticado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
        post: {
          tags: ["Teams"],
          summary: "Criar um novo time",
          description:
            "Cadastra um novo time no sistema. ShortName deve ser 3 letras maiúsculas, state 2 letras maiúsculas.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateTeam" },
              },
            },
          },
          responses: {
            201: {
              description: "Time criado com sucesso",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Team" },
                },
              },
            },
            409: {
              description: "Nome ou sigla já em uso",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                  example: { status: "error", message: "Team name already in use" },
                },
              },
            },
            422: {
              description: "Erro de validação",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ValidationError" },
                },
              },
            },
          },
        },
      },
      "/teams/{id}": {
        get: {
          tags: ["Teams"],
          summary: "Buscar time por ID",
          description: "Retorna os detalhes de um time específico.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "ID do time",
            },
          ],
          responses: {
            200: {
              description: "Detalhes do time",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Team" },
                },
              },
            },
            404: {
              description: "Time não encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                  example: { status: "error", message: "Team not found" },
                },
              },
            },
          },
        },
        put: {
          tags: ["Teams"],
          summary: "Atualizar um time",
          description: "Atualiza os dados de um time existente. Todos os campos são opcionais.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "ID do time",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateTeam" },
              },
            },
          },
          responses: {
            200: {
              description: "Time atualizado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Team" },
                },
              },
            },
            404: {
              description: "Time não encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            409: {
              description: "Nome ou sigla já em uso",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            422: {
              description: "Erro de validação",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ValidationError" },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Teams"],
          summary: "Remover um time",
          description: "Remove um time do sistema.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "ID do time",
            },
          ],
          responses: {
            204: { description: "Time removido com sucesso" },
            404: {
              description: "Time não encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/championships": {
        get: {
          tags: ["Championships"],
          summary: "Listar campeonatos",
          description: "Retorna todos os campeonatos cadastrados ordenados por nome.",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Lista de campeonatos",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Championship" } },
                },
              },
            },
            401: {
              description: "Não autenticado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        post: {
          tags: ["Championships"],
          summary: "Criar campeonato",
          description: "Cadastra um novo campeonato.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/CreateChampionship" } },
            },
          },
          responses: {
            201: {
              description: "Campeonato criado",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Championship" } },
              },
            },
            409: {
              description: "Nome já em uso",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
            422: {
              description: "Erro de validação",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ValidationError" } },
              },
            },
          },
        },
      },
      "/championships/{id}": {
        get: {
          tags: ["Championships"],
          summary: "Buscar campeonato por ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            200: {
              description: "Detalhes do campeonato",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Championship" } },
              },
            },
            404: {
              description: "Não encontrado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        put: {
          tags: ["Championships"],
          summary: "Atualizar campeonato",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/UpdateChampionship" } },
            },
          },
          responses: {
            200: {
              description: "Campeonato atualizado",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Championship" } },
              },
            },
            404: {
              description: "Não encontrado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
            409: {
              description: "Nome já em uso",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
            422: {
              description: "Erro de validação",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ValidationError" } },
              },
            },
          },
        },
        delete: {
          tags: ["Championships"],
          summary: "Remover campeonato",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            204: { description: "Campeonato removido" },
            404: {
              description: "Não encontrado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
      },
      "/divisions": {
        get: {
          tags: ["Divisions"],
          summary: "Listar divisões",
          description: "Retorna todas as divisões com campeonato e temporada.",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Lista de divisões",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Division" } },
                },
              },
            },
            401: {
              description: "Não autenticado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        post: {
          tags: ["Divisions"],
          summary: "Criar divisão",
          description:
            "Cadastra uma nova divisão. totalRounds é calculado automaticamente: (totalTeams - 1) * 2.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/CreateDivision" } },
            },
          },
          responses: {
            201: {
              description: "Divisão criada",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Division" } },
              },
            },
            422: {
              description: "Erro de validação",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ValidationError" } },
              },
            },
          },
        },
      },
      "/divisions/{id}": {
        get: {
          tags: ["Divisions"],
          summary: "Buscar divisão por ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            200: {
              description: "Detalhes da divisão",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Division" } },
              },
            },
            404: {
              description: "Não encontrada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        put: {
          tags: ["Divisions"],
          summary: "Atualizar divisão",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/UpdateDivision" } },
            },
          },
          responses: {
            200: {
              description: "Divisão atualizada",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Division" } },
              },
            },
            404: {
              description: "Não encontrada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
            422: {
              description: "Erro de validação",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ValidationError" } },
              },
            },
          },
        },
        delete: {
          tags: ["Divisions"],
          summary: "Remover divisão",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            204: { description: "Divisão removida" },
            404: {
              description: "Não encontrada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
      },
      "/divisions/championship/{championshipId}": {
        get: {
          tags: ["Divisions"],
          summary: "Listar divisões por campeonato",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "championshipId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: {
              description: "Divisões do campeonato",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Division" } },
                },
              },
            },
          },
        },
      },
      "/careers": {
        get: {
          tags: ["Careers"],
          summary: "Listar carreiras do usuário",
          description: "Retorna todas as carreiras do usuário autenticado.",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Lista de carreiras",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Career" } },
                },
              },
            },
            401: {
              description: "Não autenticado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        post: {
          tags: ["Careers"],
          summary: "Criar nova carreira",
          description: "Inicia uma nova carreira escolhendo um campeonato e um time.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/CreateCareer" } },
            },
          },
          responses: {
            201: {
              description: "Carreira criada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Career" } } },
            },
            404: {
              description: "Time ou campeonato não encontrado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
            422: {
              description: "Erro de validação",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ValidationError" } },
              },
            },
          },
        },
      },
      "/careers/{id}": {
        get: {
          tags: ["Careers"],
          summary: "Buscar carreira por ID",
          description: "Retorna detalhes de uma carreira do usuário autenticado.",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            200: {
              description: "Detalhes da carreira",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Career" } } },
            },
            403: {
              description: "Sem permissão",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                  example: { status: "error", message: "You can only manage your own career" },
                },
              },
            },
            404: {
              description: "Não encontrada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        delete: {
          tags: ["Careers"],
          summary: "Excluir carreira",
          description: "Remove uma carreira do usuário autenticado.",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            204: { description: "Carreira removida" },
            403: {
              description: "Sem permissão",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
            404: {
              description: "Não encontrada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
