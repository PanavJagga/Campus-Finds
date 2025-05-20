import { PageHeader } from "@/components/shared/PageHeader";
import { LostItemsList } from "@/components/lost-items/LostItemsList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ListChecks, PlusCircle } from "lucide-react";

export default function LostItemsPage() {
  return (
    <div>
      <PageHeader
        title="Lost Item Reports"
        description="Browse items reported as lost by members of the campus community."
        icon={ListChecks}
        actions={
          <Button asChild>
            <Link href="/lost-items/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Post Lost Item
            </Link>
          </Button>
        }
      />
      <LostItemsList />
    </div>
  );
}
