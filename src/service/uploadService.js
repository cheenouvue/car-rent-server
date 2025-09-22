import path from "path";
import fs from "fs";
import mime from "mime-types";

// function uploadlFile
export const uploadFile = async (file, folder = "uploads") => {
  try {
    if (!file) {
      throw new Error("No file Upload");
    }

    // check type of file
    const fileType = mime.lookup(file.name);
    if (!fileType || !fileType.startsWith("image/")) {
      throw new Error("Only image(JPG, PNG, GIF, WebP ฯลฯ)");
    }

    // create folder
    const uploadDir = path.join(process.cwd(), folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // new file name
    const fileExt = path.extname(file.name);
    const fileName = `${Date.now()}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    // move file to folder
    await file.mv(filePath);

    return fileName;
  } catch (error) {
    throw new Error("Error Upload File: " + error.message);
  }
};

//removefile
export const removeFile = (fileName, folder = "uploads") => {
  try {
    const filePath = path.join(process.cwd(), folder, fileName);

    // check file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // deletefile
      console.log(`Delete File : ${fileName} `);
    } else {
      console.log(`Not Found: ${fileName} `);
    }
  } catch (error) {
    console.error("Error Delete File: " + error.message);
  }
};
