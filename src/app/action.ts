"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// insert to db
export const insertToDb = async (formData: FormData) => {
  const title = formData.get("title")?.toString();
  if (!title) {
    return new Error("Title is required");
  }
  return await prisma.todo.create({
    data: {
      title,
    },
  });
};

// get all data from db
export const getAllData = async () => {
  return await prisma.todo.findMany({
    orderBy: {
      id: "desc",
    },
  });
};

// update data in db
export const updateData = async (data: { id: number; status: boolean }) => {
  return await prisma.todo.update({
    where: {
      id: data.id,
    },
    data: {
      done: data.status,
    },
  });
};

// delete data from db
export const deleteData = async (data: { id: number }) => {
  return await prisma.todo.delete({
    where: {
      id: data.id,
    },
  });
};
