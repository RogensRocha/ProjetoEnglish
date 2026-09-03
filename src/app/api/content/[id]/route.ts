import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";

// PATCH — Update a content item
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();
    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const existing = await prisma.contentItem.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
    }

    const { url, title, type, thumbnailUrl, notes, status, level, tagIds } = body;

    // Update tags if provided
    if (tagIds !== undefined) {
      await prisma.contentItemTag.deleteMany({
        where: { contentItemId: id },
      });

      if (tagIds.length > 0) {
        await prisma.contentItemTag.createMany({
          data: tagIds.map((tagId: string) => ({
            contentItemId: id,
            tagId,
          })),
        });
      }
    }

    const item = await prisma.contentItem.update({
      where: { id },
      data: {
        ...(url !== undefined && { url }),
        ...(title !== undefined && { title }),
        ...(type !== undefined && { type }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl }),
        ...(notes !== undefined && { notes }),
        ...(status !== undefined && { status }),
        ...(level !== undefined && { level }),
      },
      include: {
        tags: { include: { tag: true } },
      },
    });

    const formatted = {
      ...item,
      tags: item.tags.map((t: any) => t.tag),
    };

    return NextResponse.json({ data: formatted });
  } catch (error) {
    console.error("Content PATCH error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// DELETE — Remove a content item
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserId();
    const { id } = await params;

    // Verify ownership
    const existing = await prisma.contentItem.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
    }

    await prisma.contentItem.delete({ where: { id } });

    return NextResponse.json({ message: "Item removido" });
  } catch (error) {
    console.error("Content DELETE error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
