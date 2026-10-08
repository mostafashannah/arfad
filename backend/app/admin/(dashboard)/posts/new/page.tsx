import { PostForm } from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New post</h1>
        <p className="text-sm text-muted-foreground">Write a news, event or exhibition post.</p>
      </div>
      <PostForm />
    </div>
  );
}
