import supabase from "../clients/supabaseClient";

export const uploadProfileImage = async (
  userId: number,
  profileImage: Express.Multer.File
) => {
  const { error } = await supabase.storage
    .from("MangaBlog")
    .upload(`profiles/${userId}`, profileImage.buffer, {
      cacheControl: "3600",
      upsert: true,
      contentType: profileImage.mimetype,
    });

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

export const retrievePublicUrl = async (userId: number) => {
  const { data } = supabase.storage
    .from("MangaBlog")
    .getPublicUrl(`profiles/${userId}`);

  if (!data || !data.publicUrl) {
    throw new Error("Failed to retrieve public URL for the uploaded image.");
  }
  return data.publicUrl;
};

export const replaceProfileImage = async (
  userId: number,
  profileImage: Express.Multer.File
) => {
  const { error } = await supabase.storage
    .from("MangaBlog")
    .update(`profiles/${userId}`, profileImage.buffer, {
      cacheControl: "3600",
      upsert: true,
      contentType: profileImage.mimetype,
    });

  if (error) {
    throw new Error(`Image update failed: ${error.message}`);
  }
};
