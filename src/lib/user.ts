import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getUserId(): Promise<string> {
  try {
    const session = await auth();
    if (session?.user?.id) {
      return session.user.id;
    }
  } catch {
    // fallback to demo user
  }

  const defaultEmail = "demo@learnit.app";
  let user = await prisma.user.findUnique({
    where: { email: defaultEmail },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: defaultEmail,
        name: "Estudante",
      },
    });

    // Create default tags
    await Promise.all([
      prisma.tag.create({ data: { userId: user.id, name: "Grammar", color: "#6366f1" } }),
      prisma.tag.create({ data: { userId: user.id, name: "Listening", color: "#8b5cf6" } }),
      prisma.tag.create({ data: { userId: user.id, name: "Vocabulary", color: "#06b6d4" } }),
      prisma.tag.create({ data: { userId: user.id, name: "Speaking", color: "#10b981" } }),
      prisma.tag.create({ data: { userId: user.id, name: "Reading", color: "#f59e0b" } }),
    ]);
  }

  return user.id;
}
