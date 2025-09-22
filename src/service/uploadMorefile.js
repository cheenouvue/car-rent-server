import path from "path";
import fs from "fs";

// Function to validate if the file is an image
const isImage = (file) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];
  return allowedMimeTypes.includes(file.mimetype);
};

export const uploadMoreFile = async (files) => {
  try {
    if (!files || !files.identity_card) {
      return res.status(400).json({ error: "No identity card image uploaded" });
    }

    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("Created 'uploads' directory.");
    }

    const uploadedFileNames = [];

    // Check if files is an array or object and handle accordingly
    const fileArray = Array.isArray(files) ? files : [files]; // Handle both single and multiple files

    for (const file of fileArray) {
      if (!isImage(file)) {
        throw new Error("The uploaded file is not a valid image.");
      }

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);

      // Move the file to the uploads directory
      await file.mv(filePath);

      uploadedFileNames.push(fileName); // Store the uploaded file name
    }

    return uploadedFileNames; // Return the array of file names
  } catch (error) {
    throw new Error("Error uploading files: " + error.message);
  }
};

// Function to delete files from the uploads folder
export const RemoveFile = async (fileNames) => {
  try {
    const uploadDir = path.join(process.cwd(), "uploads");

    // Ensure fileNames is an array
    const fileArray = Array.isArray(fileNames) ? fileNames : [fileNames];

    for (const fileName of fileArray) {
      const filePath = path.join(uploadDir, fileName);

      // Check if the file exists before deleting
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${fileName}`);
      } else {
        console.log(`File not found: ${fileName}`);
      }
    }
  } catch (error) {
    throw new Error("Error deleting files: " + error.message);
  }
};
