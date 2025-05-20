"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { FoundItemFormData } from "@/lib/types";
import { FoundItemSchema } from "@/lib/types";
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
import { submitFoundItemAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { UploadCloud, Send } from "lucide-react";

export function SubmitFoundItemForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  const form = useForm<FoundItemFormData>({
    resolver: zodResolver(FoundItemSchema),
    defaultValues: {
      description: "",
      locationFound: "",
      contactInfo: "",
      photo: undefined,
    },
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("photo", [file] as any); // For Zod validation
    } else {
      setSelectedFile(null);
      setPreviewImage(null);
      form.setValue("photo", undefined);
    }
  };

  async function onSubmit(values: FoundItemFormData) {
    setIsSubmitting(true);
    try {
      const result = await submitFoundItemAction(values, selectedFile ?? undefined);

      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        });
        form.reset();
        setPreviewImage(null);
        setSelectedFile(null);
        router.push("/found-items");
      } else {
        toast({
          title: "Error",
          description: result.message || "An unknown error occurred while submitting.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to execute submit found item action:", error);
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
        <CardTitle className="text-2xl">Report a Found Item</CardTitle>
        <CardDescription>
          Thank you for helping our campus community! Please provide details about the item you found.
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
                  <FormLabel>Item Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Black iPhone 12 with a blue case, found near the library entrance."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide as much detail as possible to help the owner identify it.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => ( 
                <FormItem>
                  <FormLabel>Photo of the Item (Optional but Recommended)</FormLabel>
                  <FormControl>
                    {/* Use a new key for the input to allow re-selection of the same file after reset */}
                    <Input key={selectedFile ? selectedFile.name : 'file-input'} type="file" accept="image/*" onChange={handleFileChange} />
                  </FormControl>
                  {previewImage && (
                    <div className="mt-2 rounded-md overflow-hidden border border-muted w-48 h-48 relative">
                      <Image src={previewImage} alt="Preview" fill style={{objectFit: 'cover'}} />
                    </div>
                  )}
                  <FormDescription>
                    A clear photo greatly increases the chances of the item being claimed. Max 5MB.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="locationFound"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Found</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Main Quad, Library Room 302" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Contact Information (for owner to reach you)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Email, Phone, or Office Number" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will only be shared with someone claiming the item.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <UploadCloud className="mr-2 h-4 w-4 animate-pulse" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Found Item
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
