// services/supabase.ts
import supabase from "../clients/supabaseClient"; // Make sure this path is correct
import { Request } from "express";

export const uploadProfileImage = async (
  userId: number,
  profileImage: Express.Multer.File
) => {
  // Upload the image to Supabase storage
  const { data: uploadData, error } = await supabase.storage
    .from("MangaBlog")
    .upload(`profiles/${userId}`, profileImage.buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: profileImage.mimetype,
    });

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from("MangaBlog")
    .getPublicUrl(`profiles/${userId}`);

  if (!urlData || !urlData.publicUrl) {
    throw new Error("Failed to retrieve public URL for the uploaded image.");
  }
  return urlData.publicUrl;
};
