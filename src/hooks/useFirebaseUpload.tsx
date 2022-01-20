import type { IUser } from "context/userContext";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  UploadTask,
} from "firebase/storage";
import { nanoid } from "nanoid";
import { useState } from "react";
import { storage } from "util/firebase";

const useFirebaseUpload = (user: IUser | null) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadTask, setUploadTask] = useState<UploadTask | null>(null);
  const [isUploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");

  const handleUpload = (file: File) => {
    setFile(file);
    setUploading(true);

    const uploadId = nanoid();
    const storageRef = ref(
      storage,
      `uploads/${user?.uid}/${file.name}-${uploadId}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploadTask(uploadTask);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // get percentage from 0 - 100
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
      },
      (error) => {
        setUploading(false);
        console.error("Error uploading file", error);
      },
      () => {
        getDownloadURL(storageRef).then((url) => {
          setVideoUrl(url);
          setUploading(false);
        });
      }
    );
  };

  const cancelUpload = () => {
    if (uploadTask) {
      setUploading(false);
      uploadTask.cancel();
    }
  };

  const discardUpload = () => {
    setUploading(false);
    setUploadProgress(0);
    setVideoUrl("");
    setFile(null);
    console.log("clean state");
  };

  return {
    handleUpload,
    file,
    videoUrl,
    isUploading,
    uploadProgress,
    cancelUpload,
    discardUpload,
  };
};

export default useFirebaseUpload;
