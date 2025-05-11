const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Mini CRM API',
    version: '1.0.0',
    description: 'API documentation for Mini CRM platform',
  },
  paths: {
    '/api/customers': {
      post: {
        summary: 'Add a single customer',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Customer',
              },
            },
          },
        },
        responses: {
          201: { description: 'Customer created' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/api/customers/bulk': {
      post: {
        summary: 'Add multiple customers',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Customer' },
              },
            },
          },
        },
        responses: {
          201: { description: 'Customers created' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/api/orders': {
      post: {
        summary: 'Add a single order',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Order',
              },
            },
          },
        },
        responses: {
          201: { description: 'Order created' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/api/orders/bulk': {
      post: {
        summary: 'Add multiple orders',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Order' },
              },
            },
          },
        },
        responses: {
          201: { description: 'Orders created' },
          400: { description: 'Validation error' },
        },
      },
    },
  },
  components: {
    schemas: {
      Customer: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          totalSpend: { type: 'number' },
          visits: { type: 'number' },
          lastActive: { type: 'string', format: 'date-time' },
        },
        required: ['name', 'email'],
      },
      Order: {
        type: 'object',
        properties: {
          customer: { type: 'string' },
          amount: { type: 'number' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                price: { type: 'number' },
                quantity: { type: 'number' },
              },
            },
          },
        },
        required: ['customer', 'amount'],
      },
    },
  },
};

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router; 