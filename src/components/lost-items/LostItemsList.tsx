"use client";
import type { LostItem } from "@/lib/types";
import { LostItemCard } from "./LostItemCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, useMemo } from "react";
import { Search, Filter, XCircle } from "lucide-react";
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

// Mock categories for filter - in a real app, these might come from a predefined list or AI suggestions
const mockCategories = ["Electronics", "Books", "Clothing", "Accessories", "ID Cards", "Keys", "Other"];


export function LostItemsList() {
  const [items, setItems] = useState<LostItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "lostItems"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedItems: LostItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now();
        const lastSeenDate = data.lastSeenDate instanceof Timestamp ? data.lastSeenDate : Timestamp.now();
        fetchedItems.push({ id: doc.id, ...data, createdAt, lastSeenDate } as LostItem);
      });
      setItems(fetchedItems);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching lost items:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      const matchesCategory = categoryFilter === "all" || (item.categories && item.categories.includes(categoryFilter)); // Categories might be empty
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, categoryFilter]);

  if (loading) {
     return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(6)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg shadow bg-card">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search lost items by description or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value === "all" ? "all" : value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {mockCategories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <LostItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium text-foreground">No lost item posts found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filter, or post about your lost item.
          </p>
        </div>
      )}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col space-y-3 p-4 border rounded-lg shadow">
      <Skeleton className="h-[70px] w-full rounded-xl bg-muted" /> {/* No image for lost item card by default */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <Skeleton className="h-10 w-full mt-auto" />
    </div>
  );
}
