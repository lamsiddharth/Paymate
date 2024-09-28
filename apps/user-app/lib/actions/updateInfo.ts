"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function updateInformation(name?: string, email?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return {
      error: "Error no user found",
    };
  }
  try {
    await prisma.user.update({
      where: {
        id: Number(session.user.id),
      },
      data: {
        name: name,
        email: email,
      },
    });
    return {
      message: "successfully updated",
    };
  } catch (error) {
    return {
      error: "Update Unsuccessfull",
    };
  }
}
