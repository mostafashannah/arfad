import { ServiceForm } from "@/components/admin/service-form";

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New service</h1>
        <p className="text-sm text-muted-foreground">Add a new service card.</p>
      </div>
      <ServiceForm />
    </div>
  );
}
