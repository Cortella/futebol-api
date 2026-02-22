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
        Player: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Endrick" },
            nickname: { type: "string", nullable: true, example: "Endrick" },
            teamId: { type: "string", format: "uuid", nullable: true },
            position: {
              type: "string",
              enum: ["GOL", "ZAG", "LD", "LE", "VOL", "MC", "MEI", "PD", "PE", "ATA", "SA"],
              example: "ATA",
            },
            age: { type: "integer", example: 20 },
            nationality: { type: "string", example: "Brasileiro" },
            shirtNumber: { type: "integer", nullable: true, example: 9 },
            force: { type: "integer", example: 78 },
            velocity: { type: "integer", example: 82 },
            stamina: { type: "integer", example: 75 },
            technique: { type: "integer", example: 80 },
            morale: { type: "integer", example: 50 },
            condition: { type: "integer", example: 100 },
            injury: { type: "integer", example: 0 },
            salary: { type: "string", example: "500000" },
            marketValue: { type: "string", example: "8320000" },
            forSale: { type: "boolean", example: false },
            askingPrice: { type: "string", nullable: true },
            suspended: { type: "boolean", example: false },
            yellowCards: { type: "integer", example: 0 },
            redCards: { type: "integer", example: 0 },
          },
        },
        CreatePlayer: {
          type: "object",
          required: [
            "name",
            "position",
            "age",
            "nationality",
            "force",
            "velocity",
            "stamina",
            "technique",
            "salary",
            "marketValue",
          ],
          properties: {
            name: { type: "string", example: "Endrick" },
            nickname: { type: "string", nullable: true },
            teamId: { type: "string", format: "uuid", nullable: true },
            position: {
              type: "string",
              enum: ["GOL", "ZAG", "LD", "LE", "VOL", "MC", "MEI", "PD", "PE", "ATA", "SA"],
            },
            age: { type: "integer", minimum: 16, maximum: 40 },
            nationality: { type: "string" },
            shirtNumber: { type: "integer", minimum: 1, maximum: 99, nullable: true },
            force: { type: "integer", minimum: 1, maximum: 100 },
            velocity: { type: "integer", minimum: 1, maximum: 100 },
            stamina: { type: "integer", minimum: 1, maximum: 100 },
            technique: { type: "integer", minimum: 1, maximum: 100 },
            salary: { type: "integer", minimum: 0 },
            marketValue: { type: "integer", minimum: 0 },
          },
        },
        UpdatePlayer: {
          type: "object",
          properties: {
            name: { type: "string" },
            nickname: { type: "string", nullable: true },
            teamId: { type: "string", format: "uuid", nullable: true },
            position: {
              type: "string",
              enum: ["GOL", "ZAG", "LD", "LE", "VOL", "MC", "MEI", "PD", "PE", "ATA", "SA"],
            },
            age: { type: "integer" },
            nationality: { type: "string" },
            shirtNumber: { type: "integer", nullable: true },
            force: { type: "integer" },
            velocity: { type: "integer" },
            stamina: { type: "integer" },
            technique: { type: "integer" },
            salary: { type: "integer" },
            marketValue: { type: "integer" },
          },
        },
        DivisionTeam: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            divisionId: { type: "string", format: "uuid" },
            teamId: { type: "string", format: "uuid" },
            isUserTeam: { type: "boolean" },
          },
        },
        Tactic: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            careerId: { type: "string", format: "uuid" },
            formation: { type: "string", example: "4-4-2" },
            style: {
              type: "string",
              enum: ["ultra_defensive", "defensive", "moderate", "offensive", "ultra_offensive"],
            },
            marking: { type: "string", enum: ["zone", "man_to_man"] },
            tempo: { type: "string", enum: ["slow", "normal", "fast"] },
            passing: { type: "string", enum: ["short", "mixed", "long"] },
            pressure: { type: "string", enum: ["low", "normal", "high"] },
          },
        },
        Lineup: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            careerId: { type: "string", format: "uuid" },
            name: { type: "string", nullable: true },
          },
        },
        LineupPlayer: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            lineupId: { type: "string", format: "uuid" },
            playerId: { type: "string", format: "uuid" },
            positionSlot: { type: "string", example: "ATA1" },
            isStarter: { type: "boolean" },
          },
        },
        Round: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            divisionId: { type: "string", format: "uuid" },
            seasonId: { type: "string", format: "uuid" },
            number: { type: "integer", example: 1 },
            status: { type: "string", enum: ["pending", "simulated"] },
          },
        },
        Match: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            roundId: { type: "string", format: "uuid" },
            divisionId: { type: "string", format: "uuid" },
            homeTeamId: { type: "string", format: "uuid" },
            awayTeamId: { type: "string", format: "uuid" },
            homeGoals: { type: "integer", nullable: true },
            awayGoals: { type: "integer", nullable: true },
            attendance: { type: "integer", nullable: true },
            played: { type: "boolean" },
            events: { type: "array", nullable: true, items: { type: "object" } },
          },
        },
        Standing: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            divisionId: { type: "string", format: "uuid" },
            teamId: { type: "string", format: "uuid" },
            position: { type: "integer" },
            points: { type: "integer" },
            played: { type: "integer" },
            wins: { type: "integer" },
            draws: { type: "integer" },
            losses: { type: "integer" },
            goalsFor: { type: "integer" },
            goalsAgainst: { type: "integer" },
            goalDifference: { type: "integer" },
            form: { type: "string", example: "VVDEV" },
            streak: { type: "string", example: "3V" },
          },
        },
        Transfer: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            playerId: { type: "string", format: "uuid" },
            fromTeamId: { type: "string", format: "uuid", nullable: true },
            toTeamId: { type: "string", format: "uuid" },
            seasonId: { type: "string", format: "uuid" },
            price: { type: "string", example: "5000000" },
            type: { type: "string", enum: ["buy", "sell", "free", "loan"] },
            date: { type: "string", format: "date-time" },
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
      "/seasons": {
        get: {
          tags: ["Seasons"],
          summary: "Listar temporadas",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Lista de temporadas",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Season" } },
                },
              },
            },
          },
        },
        post: {
          tags: ["Seasons"],
          summary: "Criar temporada",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["year"],
                  properties: { year: { type: "integer", example: 2026 } },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Temporada criada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Season" } } },
            },
            409: {
              description: "Ano já existe",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
      },
      "/seasons/{id}": {
        get: {
          tags: ["Seasons"],
          summary: "Buscar temporada por ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            200: {
              description: "Temporada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Season" } } },
            },
            404: {
              description: "Não encontrada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        put: {
          tags: ["Seasons"],
          summary: "Atualizar temporada",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { type: "object", properties: { year: { type: "integer" } } },
              },
            },
          },
          responses: {
            200: {
              description: "Atualizada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Season" } } },
            },
            404: {
              description: "Não encontrada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        delete: {
          tags: ["Seasons"],
          summary: "Remover temporada",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            204: { description: "Removida" },
            404: {
              description: "Não encontrada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
      },
      "/players": {
        get: {
          tags: ["Players"],
          summary: "Listar jogadores",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Lista de jogadores",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Player" } },
                },
              },
            },
          },
        },
        post: {
          tags: ["Players"],
          summary: "Criar jogador",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/CreatePlayer" } },
            },
          },
          responses: {
            201: {
              description: "Jogador criado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Player" } } },
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
      "/players/team/{teamId}": {
        get: {
          tags: ["Players"],
          summary: "Jogadores por time",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "teamId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: {
              description: "Lista",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Player" } },
                },
              },
            },
          },
        },
      },
      "/players/{id}": {
        get: {
          tags: ["Players"],
          summary: "Buscar jogador por ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            200: {
              description: "Jogador",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Player" } } },
            },
            404: {
              description: "Não encontrado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        put: {
          tags: ["Players"],
          summary: "Atualizar jogador",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/UpdatePlayer" } },
            },
          },
          responses: {
            200: {
              description: "Atualizado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Player" } } },
            },
            404: {
              description: "Não encontrado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        delete: {
          tags: ["Players"],
          summary: "Remover jogador",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            204: { description: "Removido" },
            404: {
              description: "Não encontrado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
      },
      "/division-teams": {
        get: {
          tags: ["DivisionTeams"],
          summary: "Listar vínculos divisão-time",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Lista",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/DivisionTeam" } },
                },
              },
            },
          },
        },
        post: {
          tags: ["DivisionTeams"],
          summary: "Vincular time a divisão",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["divisionId", "teamId"],
                  properties: {
                    divisionId: { type: "string", format: "uuid" },
                    teamId: { type: "string", format: "uuid" },
                    isUserTeam: { type: "boolean" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Criado",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/DivisionTeam" } },
              },
            },
            409: {
              description: "Já existe",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
      },
      "/division-teams/division/{divisionId}": {
        get: {
          tags: ["DivisionTeams"],
          summary: "Times de uma divisão",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "divisionId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: {
              description: "Lista",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/DivisionTeam" } },
                },
              },
            },
          },
        },
      },
      "/division-teams/{id}": {
        get: {
          tags: ["DivisionTeams"],
          summary: "Buscar por ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            200: {
              description: "DivisionTeam",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/DivisionTeam" } },
              },
            },
            404: {
              description: "Não encontrado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        put: {
          tags: ["DivisionTeams"],
          summary: "Atualizar vínculo",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { type: "object", properties: { isUserTeam: { type: "boolean" } } },
              },
            },
          },
          responses: {
            200: {
              description: "Atualizado",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/DivisionTeam" } },
              },
            },
          },
        },
        delete: {
          tags: ["DivisionTeams"],
          summary: "Remover vínculo",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            204: { description: "Removido" },
            404: {
              description: "Não encontrado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
      },
      "/tactics": {
        post: {
          tags: ["Tactics"],
          summary: "Criar tática",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["careerId"],
                  properties: {
                    careerId: { type: "string", format: "uuid" },
                    formation: { type: "string" },
                    style: { type: "string" },
                    marking: { type: "string" },
                    tempo: { type: "string" },
                    passing: { type: "string" },
                    pressure: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Tática criada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Tactic" } } },
            },
            409: {
              description: "Já existe para esta carreira",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
      },
      "/tactics/career/{careerId}": {
        get: {
          tags: ["Tactics"],
          summary: "Buscar tática por carreira",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "careerId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: {
              description: "Tática",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Tactic" } } },
            },
          },
        },
      },
      "/tactics/{id}": {
        get: {
          tags: ["Tactics"],
          summary: "Buscar tática por ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            200: {
              description: "Tática",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Tactic" } } },
            },
            404: {
              description: "Não encontrada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        put: {
          tags: ["Tactics"],
          summary: "Atualizar tática",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    formation: { type: "string" },
                    style: { type: "string" },
                    marking: { type: "string" },
                    tempo: { type: "string" },
                    passing: { type: "string" },
                    pressure: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Atualizada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Tactic" } } },
            },
          },
        },
        delete: {
          tags: ["Tactics"],
          summary: "Remover tática",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: { 204: { description: "Removida" } },
        },
      },
      "/lineups": {
        post: {
          tags: ["Lineups"],
          summary: "Criar escalação",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["careerId"],
                  properties: {
                    careerId: { type: "string", format: "uuid" },
                    name: { type: "string", nullable: true },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Escalação criada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Lineup" } } },
            },
          },
        },
      },
      "/lineups/career/{careerId}": {
        get: {
          tags: ["Lineups"],
          summary: "Escalações por carreira",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "careerId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: {
              description: "Lista",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Lineup" } },
                },
              },
            },
          },
        },
      },
      "/lineups/{id}": {
        get: {
          tags: ["Lineups"],
          summary: "Buscar escalação por ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            200: {
              description: "Escalação",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Lineup" } } },
            },
            404: {
              description: "Não encontrada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        put: {
          tags: ["Lineups"],
          summary: "Atualizar escalação",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { name: { type: "string", nullable: true } },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Atualizada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Lineup" } } },
            },
          },
        },
        delete: {
          tags: ["Lineups"],
          summary: "Remover escalação",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: { 204: { description: "Removida" } },
        },
      },
      "/lineup-players": {
        post: {
          tags: ["LineupPlayers"],
          summary: "Adicionar jogador à escalação",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["lineupId", "playerId", "positionSlot"],
                  properties: {
                    lineupId: { type: "string", format: "uuid" },
                    playerId: { type: "string", format: "uuid" },
                    positionSlot: { type: "string" },
                    isStarter: { type: "boolean" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Adicionado",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/LineupPlayer" } },
              },
            },
          },
        },
      },
      "/lineup-players/lineup/{lineupId}": {
        get: {
          tags: ["LineupPlayers"],
          summary: "Jogadores de uma escalação",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "lineupId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: {
              description: "Lista",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/LineupPlayer" } },
                },
              },
            },
          },
        },
      },
      "/lineup-players/{id}": {
        get: {
          tags: ["LineupPlayers"],
          summary: "Buscar por ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            200: {
              description: "LineupPlayer",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/LineupPlayer" } },
              },
            },
            404: {
              description: "Não encontrado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        put: {
          tags: ["LineupPlayers"],
          summary: "Atualizar jogador na escalação",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { positionSlot: { type: "string" }, isStarter: { type: "boolean" } },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Atualizado",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/LineupPlayer" } },
              },
            },
          },
        },
        delete: {
          tags: ["LineupPlayers"],
          summary: "Remover jogador da escalação",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: { 204: { description: "Removido" } },
        },
      },
      "/rounds": {
        get: {
          tags: ["Rounds"],
          summary: "Listar rodadas",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Lista",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Round" } },
                },
              },
            },
          },
        },
        post: {
          tags: ["Rounds"],
          summary: "Criar rodada",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["divisionId", "seasonId", "number"],
                  properties: {
                    divisionId: { type: "string", format: "uuid" },
                    seasonId: { type: "string", format: "uuid" },
                    number: { type: "integer" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Rodada criada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Round" } } },
            },
          },
        },
      },
      "/rounds/division/{divisionId}": {
        get: {
          tags: ["Rounds"],
          summary: "Rodadas por divisão",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "divisionId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: {
              description: "Lista",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Round" } },
                },
              },
            },
          },
        },
      },
      "/rounds/{id}": {
        get: {
          tags: ["Rounds"],
          summary: "Buscar rodada por ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            200: {
              description: "Rodada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Round" } } },
            },
            404: {
              description: "Não encontrada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        delete: {
          tags: ["Rounds"],
          summary: "Remover rodada",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: { 204: { description: "Removida" } },
        },
      },
      "/matches": {
        get: {
          tags: ["Matches"],
          summary: "Listar partidas",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Lista",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Match" } },
                },
              },
            },
          },
        },
        post: {
          tags: ["Matches"],
          summary: "Criar partida",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["roundId", "divisionId", "homeTeamId", "awayTeamId"],
                  properties: {
                    roundId: { type: "string", format: "uuid" },
                    divisionId: { type: "string", format: "uuid" },
                    homeTeamId: { type: "string", format: "uuid" },
                    awayTeamId: { type: "string", format: "uuid" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Partida criada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Match" } } },
            },
          },
        },
      },
      "/matches/round/{roundId}": {
        get: {
          tags: ["Matches"],
          summary: "Partidas por rodada",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "roundId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: {
              description: "Lista",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Match" } },
                },
              },
            },
          },
        },
      },
      "/matches/{id}": {
        get: {
          tags: ["Matches"],
          summary: "Buscar partida por ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            200: {
              description: "Partida",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Match" } } },
            },
            404: {
              description: "Não encontrada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        delete: {
          tags: ["Matches"],
          summary: "Remover partida",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: { 204: { description: "Removida" } },
        },
      },
      "/standings/division/{divisionId}": {
        get: {
          tags: ["Standings"],
          summary: "Classificação por divisão",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "divisionId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: {
              description: "Tabela de classificação",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Standing" } },
                },
              },
            },
          },
        },
      },
      "/standings": {
        post: {
          tags: ["Standings"],
          summary: "Criar standing",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["divisionId", "teamId"],
                  properties: {
                    divisionId: { type: "string", format: "uuid" },
                    teamId: { type: "string", format: "uuid" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Criado",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Standing" } },
              },
            },
          },
        },
      },
      "/standings/{id}": {
        get: {
          tags: ["Standings"],
          summary: "Buscar por ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            200: {
              description: "Standing",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Standing" } },
              },
            },
            404: {
              description: "Não encontrado",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        delete: {
          tags: ["Standings"],
          summary: "Remover standing",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: { 204: { description: "Removido" } },
        },
      },
      "/transfers": {
        get: {
          tags: ["Transfers"],
          summary: "Listar transferências",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Lista",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Transfer" } },
                },
              },
            },
          },
        },
        post: {
          tags: ["Transfers"],
          summary: "Registrar transferência",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["playerId", "toTeamId", "seasonId", "price", "type"],
                  properties: {
                    playerId: { type: "string", format: "uuid" },
                    fromTeamId: { type: "string", format: "uuid", nullable: true },
                    toTeamId: { type: "string", format: "uuid" },
                    seasonId: { type: "string", format: "uuid" },
                    price: { type: "integer" },
                    type: { type: "string", enum: ["buy", "sell", "free", "loan"] },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Registrada",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Transfer" } },
              },
            },
          },
        },
      },
      "/transfers/season/{seasonId}": {
        get: {
          tags: ["Transfers"],
          summary: "Transferências por temporada",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "seasonId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: {
              description: "Lista",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: "#/components/schemas/Transfer" } },
                },
              },
            },
          },
        },
      },
      "/transfers/{id}": {
        get: {
          tags: ["Transfers"],
          summary: "Buscar transferência por ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            200: {
              description: "Transferência",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/Transfer" } },
              },
            },
            404: {
              description: "Não encontrada",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        delete: {
          tags: ["Transfers"],
          summary: "Remover transferência",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: { 204: { description: "Removida" } },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
