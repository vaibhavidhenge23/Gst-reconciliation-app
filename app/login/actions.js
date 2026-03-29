"use server";

import { prisma } from "../../lib/prisma";

export async function verifyAndFetchUser(panInput) {
  try {
    const pan = panInput.toUpperCase().trim();
    
    let user = await prisma.user.findUnique({
      where: { pan },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { pan },
      });
    }

    if (!user.isActive) {
      return { success: false, error: "This PAN account is deactivated." };
    }

    // Success response containing serialized simple user
    return { success: true, user: { id: user.id, pan: user.pan } };
  } catch (error) {
    console.error("Auth database error:", error);
    return { success: false, error: "Failed to verify PAN with Database. Please try again." };
  }
}
