import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const results = await prisma.todo.findMany({
    orderBy: {
      id: "desc",
    },
  });
  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  const { title } = await req.json();
  const result = await prisma.todo.create({
    data: {
      title,
    },
  });
  return NextResponse.json(result);
}

// update todo status
export async function PUT(req: NextRequest) {
  const { id, status } = await req.json();
  const result = await prisma.todo.update({
    where: {
      id,
    },
    data: {
      done: status,
    },
  });
  return NextResponse.json(result);
}

// delete todo
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const result = await prisma.todo.delete({
    where: {
      id,
    },
  });
  return NextResponse.json(result);
}
