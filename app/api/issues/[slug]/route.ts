import { auth } from '@/auth';
import { formatErrors } from '@/lib/utils';
import { updateIssueSchema } from '@/lib/validationSchemas';
import prisma from '@/prisma/client';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';
import slugify from 'slugify';

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
  const session = await auth();
  if (!session) return NextResponse.json({}, { status: 401 });

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
  // Check if the user is authenticated.
  const session = await auth();
  if (!session) return NextResponse.json({}, { status: 401 });

  // Check if the issue exists.
  const issue = await prisma.issue.findUnique({ where: { slug } });
  if (!issue) return NextResponse.json({ message: 'Issue not found' }, { status: 404 });

  const body = await request.json();
  // Validate the request body.
  const validationResult = updateIssueSchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(formatErrors(validationResult.error), { status: 400 });
  }

  const { title, description, status, priority, assigneeId } = body;
  // Check if the assigneeId is provided and if the user exists.
  if (assigneeId) {
    const user = await prisma.user.findUnique({ where: { id: assigneeId } });
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  // Generate a new slug if the title is provided.
  if (title) {
    let newSlug = slugify(title, { lower: true, strict: true, trim: true });
    while (await prisma.issue.findUnique({ where: { slug: newSlug } })) {
      newSlug += `-${nanoid(10)}`;
    }
    const updatedIssue = await prisma.issue.update({
      where: { slug },
      data: { ...body, slug: newSlug },
    });
    return NextResponse.json(updatedIssue);
  }

  // Update the issue.
  const updatedIssue = await prisma.issue.update({ where: { slug }, data: body });
  return NextResponse.json(updatedIssue);
}
