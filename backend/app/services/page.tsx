import Link from "next/link";
import { db } from "@/db/client";
import { services } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const allServices = await db
    .select()
    .from(services)
    .where(eq(services.published, true))
    .orderBy(asc(services.order))
    .all();

  return (
    <main className="min-h-screen bg-white px-8 py-16">
      <Link href="/" className="text-sm text-[#b08d57]">
        ← Home
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-[#0a2540]">Services</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {allServices.map((s) => (
          <div key={s.id} className="overflow-hidden rounded-xl border">
            {s.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.image} alt={s.title} className="h-44 w-full object-cover" />
            )}
            <div className="p-5">
              <h3 className="font-semibold text-[#0a2540]">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.summary}</p>
              <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
                {(JSON.parse(s.features || "[]") as string[]).map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
