import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";

// GET — List user's content items with optional filters
export async function GET(request: Request) {
  try {
    const userId = await getUserId();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const level = searchParams.get("level") || "";
    const tagIds = searchParams.get("tagIds")?.split(",").filter(Boolean) || [];

    const where: Record<string, unknown> = {
      userId,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
        { url: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (level) {
      where.level = level;
    }

    if (tagIds.length > 0) {
      where.tags = {
        some: {
          tagId: { in: tagIds },
        },
      };
    }

    const items = await prisma.contentItem.findMany({
      where,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Flatten tags for frontend
    const formatted = items.map((item: any) => ({
      ...item,
      tags: item.tags.map((t: any) => t.tag),
    }));

    return NextResponse.json({ data: formatted });
  } catch (error) {
    console.error("Content GET error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// POST — Create a new content item
export async function POST(request: Request) {
  try {
    const userId = await getUserId();

    const body = await request.json();
    const { url, title, type, thumbnailUrl, notes, status, level, tagIds } = body;

    if (!url || !title) {
      return NextResponse.json(
        { error: "URL e título são obrigatórios" },
        { status: 400 }
      );
    }

    const item = await prisma.contentItem.create({
      data: {
        userId,
        url,
        title,
        type: type || "article",
        thumbnailUrl: thumbnailUrl || null,
        notes: notes || null,
        status: status || "todo",
        level: level || "B1",
        tags: tagIds?.length
          ? {
              create: tagIds.map((tagId: string) => ({
                tag: { connect: { id: tagId } },
              })),
            }
          : undefined,
      },
      include: {
        tags: { include: { tag: true } },
      },
    });

    const formatted = {
      ...item,
      tags: item.tags.map((t: any) => t.tag),
    };

    return NextResponse.json({ data: formatted }, { status: 201 });
  } catch (error) {
    console.error("Content POST error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
