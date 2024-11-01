import React from "react";
import { RadioGroup, Radio } from "@nextui-org/react";

export default function UploadOptions({
  uploadType,
  onUploadTypeChange,
  inputMethod,
  onInputMethodChange,
  uploadVersion,
  onVersionChange,
}) {
  return (
    <div className="flex flex-wrap gap-6 items-start">
      <RadioGroup
        label="Upload Type"
        value={uploadType}
        onValueChange={onUploadTypeChange}
        orientation="horizontal"
        classNames={{
          wrapper: "gap-6"
        }}
      >
        <Radio value="quizzes">Quizzes</Radio>
        <Radio value="questions">Questions</Radio>
      </RadioGroup>

      <RadioGroup
        label="Input Method"
        value={inputMethod}
        onValueChange={onInputMethodChange}
        orientation="horizontal"
      >
        <Radio value="file">File</Radio>
        <Radio value="paste">Paste</Radio>
      </RadioGroup>

      {uploadType === "quizzes" && (
        <RadioGroup
          label="Upload Version"
          value={uploadVersion}
          onValueChange={onVersionChange}
          orientation="horizontal"
        >
          <Radio value="v1">Version 1.0</Radio>
          <Radio value="v2">Version 2.0</Radio>
        </RadioGroup>
      )}
    </div>
  );
} 