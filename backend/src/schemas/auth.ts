// Schémas JSON Schema (Ajv) pour les routes d'authentification.
// Fastify utilise ces schémas pour valider ET sérialiser automatiquement.

export const registerSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email', maxLength: 255 },
      password: { type: 'string', minLength: 8, maxLength: 100 },
      first_name: { type: 'string', maxLength: 100 },
      last_name: { type: 'string', maxLength: 100 },
    },
    additionalProperties: false,
  },
  response: {
    201: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        first_name: { type: 'string', nullable: true },
        last_name: { type: 'string', nullable: true },
      },
    },
  },
}

export const loginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        first_name: { type: 'string', nullable: true },
        last_name: { type: 'string', nullable: true },
      },
    },
  },
}

export const meSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        first_name: { type: 'string', nullable: true },
        last_name: { type: 'string', nullable: true },
        created_at: { type: 'string' },
      },
    },
  },
}
