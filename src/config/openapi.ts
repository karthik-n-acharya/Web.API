export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Portfolio AI API",
    version: "1.0.0",
    description: "Local interactive documentation for the Portfolio AI API.",
  },
  servers: [{ url: "/" }],
  paths: {
    "/api/health": {
      get: {
        summary: "Check API health",
        responses: {
          "200": {
            description: "The API is healthy.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    service: {
                      type: "string",
                      example: "portfolio-ai-api",
                    },
                  },
                  required: ["status", "service"],
                },
              },
            },
          },
        },
      },
    },
    "/api/chat": {
      post: {
        summary: "Ask the portfolio assistant",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    minLength: 1,
                    example: "Hello, tell me about Karthik.",
                  },
                },
                required: ["message"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "The assistant's response.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { answer: { type: "string" } },
                  required: ["answer"],
                },
              },
            },
          },
          "400": {
            description: "The message is missing, empty, or invalid.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                },
              },
            },
          },
          "502": {
            description: "The assistant could not process the request.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                },
              },
            },
          },
        },
      },
    },
  },
} as const;
