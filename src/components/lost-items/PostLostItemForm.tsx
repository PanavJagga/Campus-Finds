"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { LostItemFormData } from "@/lib/types";
import { LostItemSchema } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { postLostItemAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarIcon, Send, SearchX } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";


export function PostLostItemForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LostItemFormData>({
    resolver: zodResolver(LostItemSchema),
    defaultValues: {
      description: "",
      lastSeenLocation: "",
      contactInfo: "",
      lastSeenDate: undefined, // Default to undefined
    },
  });

  async function onSubmit(values: LostItemFormData) {
    setIsSubmitting(true);
    try {
      const result = await postLostItemAction(values);

      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        });
        form.reset(); // Reset form fields
        router.push("/lost-items");
      } else {
        toast({
          title: "Error",
          description: result.message || "An unknown error occurred while posting.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to execute post lost item action:", error);
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Report a Lost Item</CardTitle>
        <CardDescription>
          Describe the item you've lost. We hope it gets found soon!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lost Item Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Red backpack with a 'Campus Adventures' keychain, contained a laptop and textbooks."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Be specific! Include brand, color, size, any distinguishing marks.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastSeenLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Seen Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Student Union Cafeteria, Bus Stop B" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastSeenDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Last Seen Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("2000-01-01") // Adjusted min date
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Contact Information (if item is found)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Email, Phone, or Room Number" {...field} />
                  </FormControl>
                  <FormDescription>
                    How should someone contact you if they find your item?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <SearchX className="mr-2 h-4 w-4 animate-pulse" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Post Lost Item
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
