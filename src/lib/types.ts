import type { Timestamp } from 'firebase/firestore';
import { z } from 'zod';

export interface BaseItem {
  id: string;
  description: string;
  contactInfo: string;
  tags: string[];
  categories: string[];
  createdAt: Timestamp;
  userId?: string; 
  reported: boolean;
  reportReason?: string; // Added to store reason for reporting
  resolved: boolean; 
}

export interface FoundItem extends BaseItem {
  imageUrl?: string; 
  imageFileName?: string; 
  locationFound: string;
}

export interface LostItem extends BaseItem {
  lastSeenDate: Timestamp;
  lastSeenLocation: string;
}


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


export const FoundItemSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters long.").max(500, "Description must be 500 characters or less."),
  locationFound: z.string().min(3, "Location must be at least 3 characters long.").max(100, "Location must be 100 characters or less."),
  contactInfo: z.string().min(5, "Contact info must be at least 5 characters long.").max(100, "Contact info must be 100 characters or less."),
  photo: z.custom<FileList | undefined | null>() // Use z.custom for FileList
    .refine((files) => files === undefined || files === null || files?.length === 0 || files?.length === 1, "Please select a single image or no image.")
    .refine((files) => files === undefined || files === null || files?.length === 0 || (files?.[0]?.size ?? 0) <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (files) => files === undefined || files === null || files?.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type ?? ""),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ).optional(),
});

export type FoundItemFormData = z.infer<typeof FoundItemSchema>;

export const LostItemSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters long.").max(500, "Description must be 500 characters or less."),
  lastSeenLocation: z.string().min(3, "Location must be at least 3 characters long.").max(100, "Location must be 100 characters or less."),
  lastSeenDate: z.date({ required_error: "Please select a date."}),
  contactInfo: z.string().min(5, "Contact info must be at least 5 characters long.").max(100, "Contact info must be 100 characters or less."),
});

export type LostItemFormData = z.infer<typeof LostItemSchema>;
