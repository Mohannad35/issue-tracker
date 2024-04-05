import type { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { formatErrors } from '../format-errors';
import prisma from '@/prisma/client';

const createIssueSchema = z
  .object({
    title: z
      .string({
        invalid_type_error: 'title should be a string',
        required_error: 'title is required',
      })
      .min(1, "title shouldn't be empty")
      .max(255, "title shouldn't be longer than 255 characters"),
    description: z
      .string({
        invalid_type_error: 'description should be a string',
        required_error: 'description is required',
      })
      .min(1, "description shouldn't be empty"),
  })
  .strict();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validationResult = createIssueSchema.safeParse(body);
  if (!validationResult.success)
    return NextResponse.json(formatErrors(validationResult.error), { status: 400 });

  const createdIssue = await prisma.issue.create({
    data: {
      title: body.title,
      description: body.description,
    },
  });

  return NextResponse.json(createdIssue, { status: 201 });
}
