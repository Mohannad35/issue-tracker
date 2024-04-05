import { ZodError } from 'zod';

export function formatErrors(error: ZodError) {
  const formErrors = error.flatten().formErrors;
  const fieldErrors = error.flatten().fieldErrors;
  return {
    errors: formErrors.length > 0 ? formErrors : fieldErrors,
    messege:
      formErrors.length > 0
        ? formErrors.join(', ')
        : Object.values(fieldErrors)
            .map(e => e?.join(', '))
            .join('. '),
  };
}