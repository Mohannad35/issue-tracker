import { createIssueSchema } from '@/lib/validationSchemas';
import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { formatErrors } from '../_utils/format-errors';
import slugify from 'slugify';
import { nanoid } from 'nanoid';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({}, { status: 401 });

  const body = await request.json();
  const validationResult = createIssueSchema.safeParse(body);
  if (!validationResult.success)
    return NextResponse.json(formatErrors(validationResult.error), { status: 400 });
  let slug = slugify(validationResult.data.title, { lower: true, strict: true, trim: true });
  while (await prisma.issue.findUnique({ where: { slug } })) slug = `${slug}-${nanoid(10)}`;
  const createdIssue = await prisma.issue.create({ data: { ...validationResult.data, slug } });
  return NextResponse.json(createdIssue, { status: 201 });
}

export async function GET(request: NextRequest) {
  const issues = await prisma.issue.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(issues);
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({}, { status: 401 });

  const deletedIssues = await prisma.issue.deleteMany();
  return NextResponse.json(deletedIssues);
}
