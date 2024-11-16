"use client";
import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useDropzone } from "react-dropzone";
import { uploadImageToFirebase } from "../../lib/firebase";

function ImageUploader() {
  const [imageUrls, setImageUrls] = useState([]);
  const [images, setImages] = useState([]);

  const onDrop = (acceptedFiles) => {
    const newImages = acceptedFiles.map((file) => {
      const url = URL.createObjectURL(file); // Create a local URL for preview
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
      'image/png': [],
      'image/jpeg': [],
    },
  });

  return (
    <div>
      <div
        {...getRootProps()}
        style={{ border: "2px dashed #ccc", padding: "20px", cursor: "pointer" }}
      >
        <input {...getInputProps()} />
        <p>Drop your images here or click to select files (PNG, JPG only)</p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
        {images.map(({ url }, index) => (
          <div key={index} style={{ margin: '10px' }}>
            <img src={url} alt={`Preview ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            {imageUrls[index] && (
              <div>
                <Input value={imageUrls[index]} readOnly />
                <Button onClick={() => handleCopy(imageUrls[index])}>Copy Link</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Default export of the page component
export default function Page() {
  return (
    <div>
      <h1>Image Uploader</h1>
      <ImageUploader />
    </div>
  );
}
