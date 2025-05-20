import { PageHeader } from "@/components/shared/PageHeader";
import { FoundItemsList } from "@/components/found-items/FoundItemsList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, PlusCircle } from "lucide-react";

export default function FoundItemsPage() {
  return (
    <div>
      <PageHeader
        title="Found Items"
        description="Browse items that have been found and reported by the campus community."
        icon={Search}
        actions={
          <Button asChild>
            <Link href="/found-items/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Submit Found Item
            </Link>
          </Button>
        }
      />
      <FoundItemsList />
    </div>
  );
}
