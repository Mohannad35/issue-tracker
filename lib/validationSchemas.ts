import { capitalize } from 'lodash';
import { z } from 'zod';

// const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
//   if (issue.code === z.ZodIssueCode.invalid_type) {
//     if (issue.expected === 'string') {
//       return { message: 'bad type!' };
//     }
//   }
//   if (issue.code === z.ZodIssueCode.custom) {
//     return { message: `less-than-${(issue.params || {}).minimum}` };
//   }
//   return { message: ctx.defaultError };
// };
// z.setErrorMap(customErrorMap);

const title = z
  .string({
    invalid_type_error: 'Title must be a string',
    required_error: 'Title is required',
  })
  .min(1, "Title shouldn't be empty")
  .max(255, "Title shouldn't exceed 255 characters")
  .transform(value => capitalize(value));

const description = z
  .string({
    invalid_type_error: 'Description must be a string',
    required_error: 'Description is required',
  })
  .min(1, "description shouldn't be empty");

export const createIssueSchema = z
  .object({
    title,
    description,
    status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED', 'CANCELLED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  })
  .strict();

export const updateIssueSchema = z
  .object({
    title,
    description,
    status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED', 'CANCELLED']),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    assigneeId: z
      .string()
      .refine(val => /^[0-9a-fA-F]{24}$/.test(val), 'Invalid assignee id')
      .nullable(),
  })
  .partial()
  .strict()
  .refine(
    ({ title, description, status, priority, assigneeId }) =>
      title !== undefined ||
      description !== undefined ||
      status !== undefined ||
      priority !== undefined ||
      assigneeId !== undefined,
    'No fields provided for update'
  );

export const issuesQuerySchema = z.object({
  sortBy: z
    .string()
    .regex(/^(title|description|status|priority|createdAt)$/g)
    .default('createdAt'),
  direction: z
    .string()
    .regex(/^(asc|desc|ascending|descending)$/g)
    .default('desc')
    .transform(value => value.replace(/ending$/, '')),
  populate: z
    .enum(['true', 'false'])
    .transform(value => (value === 'true' ? true : false))
    .optional(),
  status: z
    .string()
    .regex(/^(OPEN|IN_PROGRESS|CLOSED|CANCELLED)(,(OPEN|IN_PROGRESS|CLOSED|CANCELLED))*$/g)
    .transform(value => value.split(','))
    .optional(),
  search: z
    .string()
    .nullable()
    .transform(value => (value === '' || value === null ? undefined : value))
    .optional(),
  take: z
    .string()
    .regex(/^[0-9]+$/g, 'Invalid take value')
    .transform(value => parseInt(value))
    .optional(),
  skip: z
    .string()
    .regex(/^[0-9]+$/g, 'Invalid skip value')
    .transform(value => parseInt(value))
    .optional(),
});
