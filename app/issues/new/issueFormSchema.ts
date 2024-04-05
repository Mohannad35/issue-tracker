import { z } from "zod";

export const issueFormSchema = z.object({
  title: z
    .string({ required_error: 'Required' })
    .min(2, 'at least 2 characters')
    .max(255, 'at most 255 characters'),
  description: z.string().min(2, 'at least 2 characters'),
});
