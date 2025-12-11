import ImageKit from "../utils/imagkit.js";

const folderPath = "prono/avatars/";

export const uploadOnImageKit = async (localFilePath) => {
    return new Promise((resolve, reject) => {
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

export const uploadAudioToImageKit = async (buffer, filename, folder = "prono/audio-submissions") => {
  const base64 = buffer.toString("base64");
  const fileBase64 = `data:audio/mpeg;base64,${base64}`; // mime type generic; ImageKit accepts data URI

  const resp = await ImageKit.upload({
    file: fileBase64,
    fileName: filename,
    folder,
  });

  return resp; // contains url, fileId, etc.
};