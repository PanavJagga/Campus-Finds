import { PageHeader } from "@/components/shared/PageHeader";
import { SubmitFoundItemForm } from "@/components/found-items/SubmitFoundItemForm";
import { PackagePlus } from "lucide-react";

export default function NewFoundItemPage() {
  return (
    <div>
      <PageHeader
        title="Submit a Found Item"
        description="Fill out the form below to report an item you've found on campus."
        icon={PackagePlus}
      />
      <SubmitFoundItemForm />
    </div>
  );
}
