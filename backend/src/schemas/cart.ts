import { Type } from '@sinclair/typebox'

export const getCartSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        user_id: { type: 'string' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              product_id: { type: 'string' },
              quantity: { type: 'integer' },
              product: {
                type: 'object',
                nullable: true,
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  price: { type: 'number' },
                  image_url: { type: 'string', nullable: true },
                  stock: { type: 'integer' },
                },
              },
            },
          },
        },
        total: { type: 'number' },
      },
    },
  },
}

// ----------------------------------------------------------------
// EXERCISE 2 — Implémenter ce schéma puis la route POST /cart/items
// ----------------------------------------------------------------
export const addToCartSchema = {
  body: Type.Object({
    product_id: Type.String(),
    quantity: Type.Integer({ minimum: 1, maximum: 10 }),
  }, { additionalProperties: false }),
  response: {
    201: Type.Object({
      id: Type.String(),
      product_id: Type.String(),
      quantity: Type.Integer(),
    }),
    404: Type.Object({
      error: Type.String(),
      message: Type.String(),
    }),
    409: Type.Object({
      error: Type.String(),
      message: Type.String(),
    }),
    500: Type.Object({
      error: Type.String(),
      message: Type.String(),
    }),
  },
}

// ----------------------------------------------------------------
// EXERCISE 3 — Schéma pour PUT /cart/items/:itemId
// ----------------------------------------------------------------
export const updateCartItemSchema = {
  params: {
    type: 'object',
    required: ['itemId'],
    properties: { itemId: { type: 'string' } },
  },
  body: {
    type: 'object',
    required: ['quantity'],
    properties: {
      quantity: { type: 'integer', minimum: 1, maximum: 10 },
    },
    additionalProperties: false,
  },
}
