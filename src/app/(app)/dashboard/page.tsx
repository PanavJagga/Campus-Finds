import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, ListChecks, PlusCircle, Search } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Welcome to CampusFinds!"
        description="Your central hub for lost and found items on campus."
        icon={Lightbulb}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-6 w-6 text-primary" />
              Found Something?
            </CardTitle>
            <CardDescription>
              Help reunite lost items with their owners. Browse items reported as found or submit a new one.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/found-items">View Found Items</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/found-items/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Submit a Found Item
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-6 w-6 text-primary" />
              Lost Something?
            </CardTitle>
            <CardDescription>
              Check if your item has been found or post a notice about what you've lost.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/lost-items">View Lost Item Posts</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/lost-items/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Post a Lost Item
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 lg:col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-accent" />
              Helpful Tips
            </CardTitle>
            <CardDescription>
              Maximize your chances of finding or returning items.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Be descriptive in your posts.</li>
              <li>Include clear photos if possible.</li>
              <li>Check back regularly.</li>
              <li>Share with campus groups.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
