import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
      },
    });

    // Create default tags for the new user
    await Promise.all([
      prisma.tag.create({ data: { userId: user.id, name: "Grammar", color: "#6366f1" } }),
      prisma.tag.create({ data: { userId: user.id, name: "Listening", color: "#8b5cf6" } }),
      prisma.tag.create({ data: { userId: user.id, name: "Vocabulary", color: "#06b6d4" } }),
      prisma.tag.create({ data: { userId: user.id, name: "Speaking", color: "#10b981" } }),
      prisma.tag.create({ data: { userId: user.id, name: "Reading", color: "#f59e0b" } }),
    ]);

    return NextResponse.json(
      { message: "Conta criada com sucesso", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
