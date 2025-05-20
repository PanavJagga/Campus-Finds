import { PageHeader } from "@/components/shared/PageHeader";
import { PostLostItemForm } from "@/components/lost-items/PostLostItemForm";
import { FileQuestion } from "lucide-react";

export default function NewLostItemPage() {
  return (
    <div>
      <PageHeader
        title="Post a Lost Item"
        description="Describe the item you've lost so others can help you find it."
        icon={FileQuestion}
      />
      <PostLostItemForm />
    </div>
  );
}
