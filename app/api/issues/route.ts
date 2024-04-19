import { auth } from '@/auth';
import { createIssueSchema, issuesQuerySchema } from '@/lib/validationSchemas';
import prisma from '@/prisma/client';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';
import { formatErrors } from '../_utils/format-errors';

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
  const searchParams = request.nextUrl.searchParams;
  const validationResult = issuesQuerySchema.safeParse({
    status: searchParams.get('status')?.split(','),
    sortBy: searchParams.get('sortBy') || 'createdAt',
    direction: searchParams.get('direction') || 'desc',
    search: searchParams.get('search'),
  });

  if (!validationResult.success)
    return NextResponse.json(formatErrors(validationResult.error), { status: 400 });

  const { status, sortBy, direction, search } = validationResult.data;
  const issues = await prisma.issue.findMany({
    where: { title: { contains: search, mode: 'insensitive' }, status: { in: status } },
    orderBy: { [sortBy!]: direction?.replace(/ending$/, '') },
  });
  return NextResponse.json(issues);
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({}, { status: 401 });

  const deletedIssues = await prisma.issue.deleteMany();
  return NextResponse.json(deletedIssues);
}
