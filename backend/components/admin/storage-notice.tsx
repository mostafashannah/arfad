import { DATA_DIR_CONFIGURED } from "@/lib/data-dir";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function StorageNotice() {
  if (DATA_DIR_CONFIGURED || process.env.NODE_ENV !== "production") return null;
  return (
    <Card className="mb-6 border-amber-500/30">
      <CardHeader>
        <CardTitle>Saved data can be erased on redeploy</CardTitle>
        <CardDescription>
          Uploads, the database, CVs and the company profile are stored inside the app folder, and a redeploy replaces
          that folder. Set the DATA_DIR environment variable to a folder outside the app (for example
          /home/&lt;user&gt;/arfad-data) and restart, so everything you save here is kept.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
