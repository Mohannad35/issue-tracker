import { z } from 'zod';

export const createIssueSchema = z
  .object({
    title: z
      .string({
        invalid_type_error: 'Title must be a string',
        required_error: 'Title is required',
      })
      .min(1, "Title shouldn't be empty")
      .max(255, "Title shouldn't exceed 255 characters"),
    description: z
      .string({
        invalid_type_error: 'Description must be a string',
        required_error: 'Description is required',
      })
      .min(1, "description shouldn't be empty"),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'DONE', 'CANCELLED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  })
  .strict();

export const updateIssueSchema = createIssueSchema
  .partial()
  .refine(
    ({ title, description, status, priority }) =>
      title !== undefined ||
      description !== undefined ||
      status !== undefined ||
      priority !== undefined,
    'No fields provided for update'
  );
