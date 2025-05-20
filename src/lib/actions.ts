"use server";
import { revalidatePath } from "next/cache";
import { collection, addDoc, updateDoc, doc, serverTimestamp, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";
import type { FoundItemFormData, LostItemFormData, FoundItem, LostItem } from "./types";

export async function submitFoundItemAction(formData: FoundItemFormData, file?: File) {
  try {
    let imageUrl: string | undefined = undefined;
    let imageFileName: string | undefined = undefined;

    if (file) {
      const fileExtension = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2,9)}.${fileExtension}`;
      const storageRef = ref(storage, `found-items/${fileName}`);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
      imageFileName = fileName;
    }
    
    const newItem: Omit<FoundItem, "id" | "createdAt"> & { createdAt: ReturnType<typeof serverTimestamp> } = {
      description: formData.description,
      locationFound: formData.locationFound,
      contactInfo: formData.contactInfo,
      imageUrl,
      imageFileName,
      tags: [], 
      categories: [], 
      createdAt: serverTimestamp(),
      reported: false,
      resolved: false,
    };

    await addDoc(collection(db, "foundItems"), newItem);
    revalidatePath("/found-items");
    revalidatePath("/dashboard");
    return { success: true, message: "Found item submitted successfully!" };
  } catch (error) {
    console.error("Error submitting found item:", error);
    const errorMessage = error instanceof Error ? error.message : String(error || "Unknown error occurred");
    return { success: false, message: `Failed to submit found item: ${errorMessage}` };
  }
}

export async function postLostItemAction(formData: LostItemFormData) {
  try {
    const newItem: Omit<LostItem, "id" | "createdAt" | "lastSeenDate"> & { createdAt: ReturnType<typeof serverTimestamp>, lastSeenDate: Timestamp } = {
      description: formData.description,
      lastSeenLocation: formData.lastSeenLocation,
      lastSeenDate: Timestamp.fromDate(formData.lastSeenDate),
      contactInfo: formData.contactInfo,
      tags: [], 
      categories: [], 
      createdAt: serverTimestamp(),
      reported: false,
      resolved: false,
    };

    await addDoc(collection(db, "lostItems"), newItem);
    revalidatePath("/lost-items");
    revalidatePath("/dashboard");
    return { success: true, message: "Lost item posted successfully!" };
  } catch (error) {
    console.error("Error posting lost item:", error);
    const errorMessage = error instanceof Error ? error.message : String(error || "Unknown error occurred");
    return { success: false, message: `Failed to post lost item: ${errorMessage}` };
  }
}

export async function markItemAsResolved(collectionName: "foundItems" | "lostItems", itemId: string) {
  try {
    const itemRef = doc(db, collectionName, itemId);
    await updateDoc(itemRef, { resolved: true });
    revalidatePath(`/${collectionName}`);
    revalidatePath("/dashboard");
    return { success: true, message: "Item status updated successfully." };
  } catch (error) {
    console.error("Error marking item as resolved:", error);
    const errorMessage = error instanceof Error ? error.message : String(error || "Unknown error occurred");
    return { success: false, message: `Failed to update item status: ${errorMessage}` };
  }
}

export async function reportItemAction(collectionName: "foundItems" | "lostItems", itemId: string, reason: string) {
  try {
    console.log(`Item ${itemId} in ${collectionName} reported for: ${reason}`);
    const itemRef = doc(db, collectionName, itemId);
    await updateDoc(itemRef, { reported: true, reportReason: reason }); 
    revalidatePath(`/${collectionName}`);
    revalidatePath("/dashboard");
    return { success: true, message: "Item reported. Thank you for your feedback." };
  } catch (error) {
    console.error("Error reporting item:", error);
    const errorMessage = error instanceof Error ? error.message : String(error || "Unknown error occurred");
    return { success: false, message: `Failed to report item: ${errorMessage}` };
  }
}
