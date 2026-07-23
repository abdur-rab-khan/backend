import { z } from 'zod';

export const addMoviesSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, 'name is required')
    .max(10, 'Name is only allowed 10 characters'),
});
