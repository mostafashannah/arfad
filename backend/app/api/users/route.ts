import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/require-session";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const all = await db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt })
    .from(users)
    .orderBy(asc(users.createdAt))
    .all();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  if (!body.email || !body.password || !body.name) {
    return NextResponse.json({ error: "name, email and password are required" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(body.password, 10);
  const [user] = await db
    .insert(users)
    .values({
      name: body.name,
      email: body.email,
      passwordHash,
      role: body.role === "ADMIN" ? "ADMIN" : "EDITOR",
    })
    .returning({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt });

  return NextResponse.json(user);
}
