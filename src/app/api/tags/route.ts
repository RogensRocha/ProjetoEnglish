import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";

// GET — List user's tags
export async function GET() {
  try {
    const userId = await getUserId();

    const tags = await prisma.tag.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ data: tags });
  } catch (error) {
    console.error("Tags GET error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// POST — Create a new tag
export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    const { name, color } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
    }

    const tag = await prisma.tag.create({
      data: {
        userId,
        name,
        color: color || "#6366f1",
      },
    });

    return NextResponse.json({ data: tag }, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
      return NextResponse.json({ error: "Tag já existe" }, { status: 409 });
    }
    console.error("Tags POST error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
