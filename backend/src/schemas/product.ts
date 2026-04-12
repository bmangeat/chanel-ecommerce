const productProperties = {
  id: { type: 'string' },
  name: { type: 'string' },
  description: { type: 'string', nullable: true },
  price: { type: 'number' },
  category: { type: 'string' },
  image_url: { type: 'string', nullable: true },
  stock: { type: 'integer' },
  is_limited_edition: { type: 'boolean' },
  version: { type: 'integer' },
  created_at: { type: 'string' },
  updated_at: { type: 'string' },
}

export const listProductsSchema = {
  querystring: {
    type: 'object',
    properties: {
      category: { type: 'string' },
      limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
      offset: { type: 'integer', minimum: 0, default: 0 },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { type: 'object', properties: productProperties },
        },
        total: { type: 'integer' },
        limit: { type: 'integer' },
        offset: { type: 'integer' },
      },
    },
  },
}

export const getProductSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: productProperties,
    },
  },
}

export const getProductStockSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        stock: { type: 'integer' },
        is_limited_edition: { type: 'boolean' },
        version: { type: 'integer' },
      },
    },
  },
}
