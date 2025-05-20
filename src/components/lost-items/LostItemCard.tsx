"use client";
import type { LostItem } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, CalendarDays, Phone, ShieldAlert, CheckSquare, Tag, HelpCircle } from "lucide-react";
import { format, formatDistanceToNow } from 'date-fns';
import { markItemAsResolved, reportItemAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface LostItemCardProps {
  item: LostItem;
}

export function LostItemCard({ item }: LostItemCardProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const handleMarkAsFound = async () => {
    setIsProcessing(true);
    try {
      const result = await markItemAsResolved("lostItems", item.id);
      if (result.success) {
        toast({ title: "Item Found!", description: "This item has been marked as found by owner." });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    } catch (error) {
       toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
       setIsProcessing(false);
    }
  };

  const handleReport = async () => {
    if(!reportReason.trim()) {
      toast({ title: "Error", description: "Please provide a reason for reporting.", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    try {
      const result = await reportItemAction("lostItems", item.id, reportReason);
      if (result.success) {
        toast({ title: "Post Reported", description: "Thank you for your feedback." });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
      setReportReason("");
    }
  };

  const createdAtDate = item.createdAt?.toDate ? item.createdAt.toDate() : new Date();
  const lastSeenDate = item.lastSeenDate?.toDate ? item.lastSeenDate.toDate() : new Date();

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
       <div className="relative w-full h-24 bg-muted flex items-center justify-center">
         <HelpCircle className="w-12 h-12 text-muted-foreground" />
          {item.resolved && (
           <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xl font-bold bg-blue-500 px-3 py-1 rounded">FOUND</span>
          </div>
        )}
       </div>
      <CardHeader>
        <CardTitle className="truncate text-lg">{item.description.substring(0, 60)}{item.description.length > 60 ? '...' : ''}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground flex items-center gap-1">
          <CalendarDays className="h-3 w-3" /> Posted {formatDistanceToNow(createdAtDate, { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 text-sm">
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
          <span>Last seen at: {item.lastSeenLocation}</span>
        </div>
        <div className="flex items-start gap-2 text-muted-foreground">
          <CalendarDays className="h-4 w-4 mt-0.5 shrink-0" />
          <span>Last seen on: {format(lastSeenDate, "PPP")}</span>
        </div>
        <div className="flex items-start gap-2 text-muted-foreground">
          <Phone className="h-4 w-4 mt-0.5 shrink-0" />
          <span>Contact if found: {item.contactInfo}</span>
        </div>
         {item.tags && item.tags.length > 0 && (
          <div className="pt-2">
            {item.tags.slice(0,3).map((tag) => (
              <Badge key={tag} variant="secondary" className="mr-1 mb-1">
                 <Tag className="h-3 w-3 mr-1"/>{tag}
              </Badge>
            ))}
            {item.tags.length > 3 && <Badge variant="outline">+{item.tags.length - 3} more</Badge>}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
        {!item.resolved ? (
          <Button onClick={handleMarkAsFound} disabled={isProcessing} className="w-full sm:w-auto flex-1 bg-blue-600 hover:bg-blue-700 text-white">
            <CheckSquare className="mr-2 h-4 w-4" /> Mark as Found
          </Button>
        ) : (
          <Button disabled className="w-full sm:w-auto flex-1">Item Recovered</Button>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" disabled={isProcessing || item.reported} className="w-full sm:w-auto flex-1">
              <ShieldAlert className="mr-2 h-4 w-4" /> {item.reported ? 'Reported' : 'Report Post'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Report this post?</AlertDialogTitle>
              <AlertDialogDescription>
                Please provide a reason for reporting this post.
              </AlertDialogDescription>
            </AlertDialogHeader>
             <div className="grid gap-2">
                <Label htmlFor="reportReasonLost">Reason for reporting</Label>
                <Input 
                  id="reportReasonLost" 
                  placeholder="e.g., Inappropriate content, spam" 
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setReportReason("")}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReport} disabled={isProcessing || !reportReason.trim()}>
                {isProcessing ? "Reporting..." : "Submit Report"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
