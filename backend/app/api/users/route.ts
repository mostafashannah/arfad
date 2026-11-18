import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { asc, sql } from "drizzle-orm";
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

  const email = String(body.email).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (String(body.password).length < 8) {
    return NextResponse.json({ error: "The password must be at least 8 characters." }, { status: 400 });
  }
  const existing = await db.select({ id: users.id }).from(users).where(sql`lower(${users.email}) = ${email}`).get();
  if (existing) {
    return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(String(body.password), 10);
  const [user] = await db
    .insert(users)
    .values({
      name: body.name,
      email,
      passwordHash,
      role: body.role === "ADMIN" ? "ADMIN" : "EDITOR",
    })
    .returning({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt });

  return NextResponse.json(user);
}
