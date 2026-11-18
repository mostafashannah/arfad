import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/admin/sidebar";

// TEMPORARY PREVIEW BYPASS — matches lib/require-session.ts. Set to false
// before this holds any real content: with it true, /admin needs no login.
// Turn the login ON without changing code: set the environment variable ADMIN_REQUIRE_LOGIN=true and restart.
const PREVIEW_NO_LOGIN = process.env.ADMIN_REQUIRE_LOGIN !== "true";

// read the setting on every request, not once at build time
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = PREVIEW_NO_LOGIN
    ? { user: { role: "ADMIN" } }
    : await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role={(session!.user as any)?.role} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
