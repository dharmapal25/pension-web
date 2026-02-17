import { z } from 'zod';
import { 
  insertPensionPotSchemaClient, 
  insertRetirementGoalSchemaClient, 
  pensionPots, 
  retirementGoals 
} from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  })
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  pensions: {
    list: {
      method: 'GET' as const,
      path: '/api/pensions' as const,
      responses: {
        200: z.array(z.custom<typeof pensionPots.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/pensions' as const,
      input: insertPensionPotSchemaClient,
      responses: {
        201: z.custom<typeof pensionPots.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/pensions/:id' as const,
      responses: {
        200: z.custom<typeof pensionPots.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/pensions/:id' as const,
      input: insertPensionPotSchemaClient.partial(),
      responses: {
        200: z.custom<typeof pensionPots.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/pensions/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },
  goals: {
    get: {
      method: 'GET' as const,
      path: '/api/goals' as const,
      responses: {
        200: z.custom<typeof retirementGoals.$inferSelect>().nullable(),
        401: errorSchemas.unauthorized,
      },
    },
    upsert: {
      method: 'POST' as const,
      path: '/api/goals' as const,
      input: insertRetirementGoalSchemaClient,
      responses: {
        200: z.custom<typeof retirementGoals.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
