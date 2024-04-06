import { createIssueSchema } from '@/lib/validationSchemas';
import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { formatErrors } from '../format-errors';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validationResult = createIssueSchema.safeParse(body);
  if (!validationResult.success)
    return NextResponse.json(formatErrors(validationResult.error), { status: 400 });
  const createdIssue = await prisma.issue.create({ data: validationResult.data });
  return NextResponse.json(createdIssue, { status: 201 });
}

export async function GET() {
  const issues = await prisma.issue.findMany();
  return NextResponse.json(issues);
}

export async function DELETE(request: NextRequest) {
  const deletedIssues = await prisma.issue.deleteMany();
  return NextResponse.json(deletedIssues);
}
