import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { posts } from "@/db/schema";
import { PostForm } from "@/components/admin/post-form";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await db.select().from(posts).where(eq(posts.id, params.id)).get();
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit post</h1>
        <p className="text-sm text-muted-foreground">{post.title}</p>
      </div>
      <PostForm
        initial={{
          id: post.id,
          title: post.title,
          category: post.category,
          publishedAt: post.publishedAt,
          excerpt: post.excerpt,
          body: post.body,
          coverUrl: post.coverUrl,
          published: post.published,
          slug: post.slug,
        }}
      />
    </div>
  );
}
