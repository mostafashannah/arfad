import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db/client";
import { posts } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { PostsManager } from "@/components/admin/posts-manager";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const rows = await db.select().from(posts).orderBy(desc(posts.publishedAt), desc(posts.createdAt)).all();

  return (
    <div>
      <PageHeader
        title="Posts"
        subtitle="The blog behind the website Media page."
        action={
          <Button asChild>
            <Link href="/admin/posts/new">
              <Plus className="h-4 w-4" /> New post
            </Link>
          </Button>
        }
      />
      <PostsManager
        posts={rows.map((p) => ({ id: p.id, title: p.title, category: p.category, publishedAt: p.publishedAt, published: p.published, coverUrl: p.coverUrl }))}
      />
    </div>
  );
}
