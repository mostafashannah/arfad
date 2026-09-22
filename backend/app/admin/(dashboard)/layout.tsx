import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/admin/sidebar";

// TEMPORARY PREVIEW BYPASS — matches lib/require-session.ts. Set to false
// before this holds any real content: with it true, /admin needs no login.
const PREVIEW_NO_LOGIN = true;

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
