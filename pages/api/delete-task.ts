import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../libs/prisma";

/**
 * Default API route handler for getting tasks.
 *
 * Authenticates request using Clerk. Checks for user ID and throws error if not found.
 * Queries tasks from Prisma db filtered by user ID.
 * Returns tasks sorted descending by createdAt date.
 * Handles errors:
 * - 400 if no user ID
 * - 500 for any other error
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body;
  try {
    const { userId } = getAuth(req);

    // Check if userId is available
    if (!userId) {
      throw new Error("User ID not found");
    }

    await prisma.tasks.delete({
      where: {
        id,
      },
    });

    res.status(200).json({ success: true });
  } catch (error: any) {
    // Handle specific errors and return appropriate error messages
    if (error.message === "User ID not found") {
      res.status(400).json({ error: "User ID not provided" });
    } else {
      // For other errors, return a generic error message
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
