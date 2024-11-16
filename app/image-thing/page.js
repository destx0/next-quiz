"use client";
import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useDropzone } from "react-dropzone";

const uploadImageToFirebase = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

function ImageUploader() {
  const [imageUrls, setImageUrls] = useState([]);
  const [images, setImages] = useState([]);

  const onDrop = (acceptedFiles) => {
    const newImages = acceptedFiles.map((file) => {
      const url = URL.createObjectURL(file);
      return { file, url };
    });

    setImages((prevImages) => [...prevImages, ...newImages]);

    newImages.forEach(({ file }) => {
      uploadImageToFirebase(file).then((url) => {
        setImageUrls((prevUrls) => [...prevUrls, url]);
      });
    });
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
    },
  });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Image Uploader</h1>
        <p className="text-gray-600">
          Upload and get shareable links instantly
        </p>
      </div>

      <div
        {...getRootProps()}
        className="border-2 border-dashed border-blue-300 rounded-lg p-8 mb-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-blue-50"
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          Drop your images here or click to select files (PNG, JPG only)
        </p>
      </div>

      <div className="space-y-6">
        {images.map(({ url }, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row gap-4 items-center"
          >
            <img
              src={url}
              alt={`Preview ${index}`}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div className="flex-1 w-full space-y-2">
              {imageUrls[index] ? (
                <>
                  <Input
                    value={imageUrls[index]}
                    readOnly
                    className="bg-gray-50"
                  />
                  <Button
                    onClick={() => handleCopy(imageUrls[index])}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Copy Link
                  </Button>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-pulse text-gray-400">
                    Uploading...
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <ImageUploader />
    </div>
  );
}
