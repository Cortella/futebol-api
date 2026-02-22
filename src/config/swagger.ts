import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Futebol API",
      version: "1.0.0",
      description: "API RESTful para gerenciamento de dados de futebol",
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
      schemas: {
        Team: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid", example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
            name: { type: "string", example: "Flamengo" },
            city: { type: "string", example: "Rio de Janeiro" },
            stadium: { type: "string", example: "Maracanã" },
            foundedYear: { type: "integer", example: 1895 },
            logoUrl: { type: "string", nullable: true, example: "https://example.com/logo.png" },
            players: {
              type: "array",
              items: { $ref: "#/components/schemas/Player" },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateTeam: {
          type: "object",
          required: ["name", "city", "stadium", "foundedYear"],
          properties: {
            name: { type: "string", minLength: 1, maxLength: 100, example: "Flamengo" },
            city: { type: "string", minLength: 1, maxLength: 100, example: "Rio de Janeiro" },
            stadium: { type: "string", minLength: 1, maxLength: 100, example: "Maracanã" },
            foundedYear: { type: "integer", minimum: 1800, example: 1895 },
            logoUrl: {
              type: "string",
              format: "uri",
              maxLength: 500,
              example: "https://example.com/logo.png",
            },
          },
        },
        UpdateTeam: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 1, maxLength: 100 },
            city: { type: "string", minLength: 1, maxLength: 100 },
            stadium: { type: "string", minLength: 1, maxLength: 100 },
            foundedYear: { type: "integer", minimum: 1800 },
            logoUrl: { type: "string", format: "uri", maxLength: 500 },
          },
        },
        Player: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Gabigol" },
            position: { type: "string", example: "Forward" },
            number: { type: "integer", example: 9 },
            nationality: { type: "string", example: "Brazilian" },
            birthDate: { type: "string", format: "date", example: "1996-08-30" },
            teamId: { type: "string", format: "uuid", nullable: true },
            team: { $ref: "#/components/schemas/Team" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreatePlayer: {
          type: "object",
          required: ["name", "position", "number", "nationality", "birthDate"],
          properties: {
            name: { type: "string", minLength: 1, maxLength: 100, example: "Gabigol" },
            position: { type: "string", minLength: 1, maxLength: 50, example: "Forward" },
            number: { type: "integer", minimum: 1, maximum: 99, example: 9 },
            nationality: { type: "string", minLength: 1, maxLength: 50, example: "Brazilian" },
            birthDate: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$", example: "1996-08-30" },
            teamId: { type: "string", format: "uuid" },
          },
        },
        UpdatePlayer: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 1, maxLength: 100 },
            position: { type: "string", minLength: 1, maxLength: 50 },
            number: { type: "integer", minimum: 1, maximum: 99 },
            nationality: { type: "string", minLength: 1, maxLength: 50 },
            birthDate: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
            teamId: { type: "string", format: "uuid" },
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
                  field: { type: "string", example: "name" },
                  message: { type: "string", example: "Required" },
                },
              },
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
      "/teams": {
        get: {
          tags: ["Teams"],
          summary: "Listar todos os times",
          description: "Retorna todos os times cadastrados com seus jogadores",
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
          },
        },
        post: {
          tags: ["Teams"],
          summary: "Criar um novo time",
          description: "Cadastra um novo time no sistema",
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
          description: "Retorna os detalhes de um time específico",
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
                },
              },
            },
          },
        },
        put: {
          tags: ["Teams"],
          summary: "Atualizar um time",
          description: "Atualiza os dados de um time existente",
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
          description: "Remove um time do sistema",
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
      "/players": {
        get: {
          tags: ["Players"],
          summary: "Listar todos os jogadores",
          description: "Retorna todos os jogadores cadastrados com seus times",
          responses: {
            200: {
              description: "Lista de jogadores",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Player" },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Players"],
          summary: "Criar um novo jogador",
          description: "Cadastra um novo jogador no sistema",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreatePlayer" },
              },
            },
          },
          responses: {
            201: {
              description: "Jogador criado com sucesso",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Player" },
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
      "/players/{id}": {
        get: {
          tags: ["Players"],
          summary: "Buscar jogador por ID",
          description: "Retorna os detalhes de um jogador específico",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "ID do jogador",
            },
          ],
          responses: {
            200: {
              description: "Detalhes do jogador",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Player" },
                },
              },
            },
            404: {
              description: "Jogador não encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
        put: {
          tags: ["Players"],
          summary: "Atualizar um jogador",
          description: "Atualiza os dados de um jogador existente",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "ID do jogador",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdatePlayer" },
              },
            },
          },
          responses: {
            200: {
              description: "Jogador atualizado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Player" },
                },
              },
            },
            404: {
              description: "Jogador não encontrado",
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
          tags: ["Players"],
          summary: "Remover um jogador",
          description: "Remove um jogador do sistema",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "ID do jogador",
            },
          ],
          responses: {
            204: { description: "Jogador removido com sucesso" },
            404: {
              description: "Jogador não encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/players/team/{teamId}": {
        get: {
          tags: ["Players"],
          summary: "Buscar jogadores por time",
          description: "Retorna todos os jogadores de um time específico",
          parameters: [
            {
              name: "teamId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "ID do time",
            },
          ],
          responses: {
            200: {
              description: "Lista de jogadores do time",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Player" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
