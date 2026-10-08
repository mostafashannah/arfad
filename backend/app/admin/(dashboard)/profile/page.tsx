import { PageHeader } from "@/components/admin/page-header";
import { ProfileManager } from "@/components/admin/profile-manager";
import { profileInfo } from "@/lib/profile-file";
import { StorageNotice } from "@/components/admin/storage-notice";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const info = await profileInfo();
  return (
    <div>
      <PageHeader
        title="Company Profile"
        subtitle="The PDF behind the Download Profile button in the website footer. Upload a new file any time to replace it."
      />
      <StorageNotice />
      <ProfileManager initial={info} />
    </div>
  );
}
