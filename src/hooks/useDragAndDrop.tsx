import { ChangeEvent, useEffect, useRef } from "react";

const useDragAndDrop = (onDrop: (file: File) => void) => {
  const dropRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files && event.dataTransfer?.files.length > 0) {
      const file = event.dataTransfer.files[0];
      onDrop(file);
    }
  };

  const selectFile = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.click();
    }
  };

  const selectedFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        onDrop(file);
      }
    }
  };

  useEffect(() => {
    const dropArea = dropRef.current;
    if (dropArea) {
      dropArea.addEventListener("dragover", handleDrag);
      dropArea.addEventListener("drop", handleDrop);
    }

    return () => {
      if (dropArea) {
        dropArea.addEventListener("dragover", handleDrag);
        dropArea.addEventListener("drop", handleDrop);
      }
    };
  }, []);

  return { dropRef, inputRef, selectFile, selectedFile };
};

export default useDragAndDrop;
