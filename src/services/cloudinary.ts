import cloudinary from "../clients/cloudinaryClient";
import { UploadApiOptions, UploadApiResponse } from "cloudinary";

export const uploadProfileImage = async (
  userId: number,
  profileImage: Express.Multer.File
) => {
  const options: UploadApiOptions = {
    folder: "MangaBlog/profiles",
    public_id: userId.toString(),
    overwrite: true,
  };

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error) {
          reject(new Error(`Image upload failed: ${error.message}`));
        } else {
          resolve(result as UploadApiResponse);
        }
      })
      .end(profileImage.buffer);
  });

  return result.secure_url;
};
