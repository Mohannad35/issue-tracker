import { createIssueSchema, updateIssueSchema } from '@/lib/validationSchemas';
import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';
import { nanoid } from 'nanoid';
import { error } from 'console';
import { formatErrors } from '../../_utils/format-errors';

export async function GET(
  request: NextRequest,
  { params: { slug } }: { params: { slug: string } }
) {
  const issue = await prisma.issue.findUnique({ where: { slug } });
  return NextResponse.json(issue);
}

export async function DELETE(
  request: NextRequest,
  { params: { slug } }: { params: { slug: string } }
) {
  const issue = await prisma.issue.findUnique({ where: { slug } });
  if (!issue) return NextResponse.json({ message: 'Issue not found' }, { status: 404 });
  // Check if the user is authenticated and has the necessary permissions.
  const deletedIssue = await prisma.issue.delete({ where: { slug } });
  return NextResponse.json(deletedIssue);
}

export async function PATCH(
  request: NextRequest,
  { params: { slug } }: { params: { slug: string } }
) {
  const issue = await prisma.issue.findUnique({ where: { slug } });
  if (!issue) return NextResponse.json({ message: 'Issue not found' }, { status: 404 });
  const body = await request.json();
  const validationResult: any = updateIssueSchema.safeParse(body);
  // Validate the request body.
  if (!validationResult.success) {
    return NextResponse.json(formatErrors(validationResult.error), { status: 400 });
  }
  if (validationResult.data.title) {
    let newSlug = slugify(validationResult.data.title, { lower: true, strict: true, trim: true });
    while (await prisma.issue.findUnique({ where: { slug: newSlug } })) {
      newSlug += `-${nanoid(10)}`;
    }
    const updatedIssue = await prisma.issue.update({
      where: { slug },
      data: { ...validationResult.data, slug: newSlug },
    });
    return NextResponse.json(updatedIssue);
  }
  const updatedIssue = await prisma.issue.update({
    where: { slug },
    data: validationResult.data,
  });
  return NextResponse.json(updatedIssue);
}
