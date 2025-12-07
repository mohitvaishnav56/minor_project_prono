import ImageKit from "../utils/imagkit.js";

const folderPath = "prono/avatars/";

export const uploadOnImageKit = async (localFilePath) => {
    return promise = new Promise((resolve, reject) => {
        ImageKit.upload(
            {
                file: localFilePath.buffer,
                fileName: Date.now().toString(),
                folder: folderPath,
            },
            function (error, result) {  
                if (error) {
                    console.log("Error uploading to ImageKit:", error);
                    reject(null);
                }
                else {
                    console.log("Upload successful:", result);
                    resolve(result);
                }
            }
        );
    });
};

export const deleteFromImageKit = async (fileId) => {
    return promise = new Promise((resolve, reject) => {
        ImageKit.deleteFile(
            fileId,
            function (error, result) {
                if (error) {    
                    console.log("Error deleting from ImageKit:", error);
                    reject(false);
                }
                else {
                    console.log("Delete successful:", result);
                    resolve(true);
                }
            }
        );
    });
};