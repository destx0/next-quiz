import React from "react";
import { Card, CardBody, Divider } from "@nextui-org/react";
import UploadOptions from "./UploadOptions";
import LanguageSelector from "./LanguageSelector";
import BatchSelector from "./BatchSelector";

export default function UploadSidebar({
  uploadType,
  onUploadTypeChange,
  inputMethod,
  onInputMethodChange,
  uploadVersion,
  onVersionChange,
  selectedLanguage,
  onLanguageChange,
  selectedBatch,
  onBatchChange,
  testBatches,
  onCreateNewBatch
}) {
  return (
    <Card className="h-full">
      <CardBody className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Upload Settings</h2>
          <div className="space-y-6">
            <UploadOptions
              uploadType={uploadType}
              onUploadTypeChange={onUploadTypeChange}
              inputMethod={inputMethod}
              onInputMethodChange={onInputMethodChange}
              uploadVersion={uploadVersion}
              onVersionChange={onVersionChange}
            />
            <Divider />
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={onLanguageChange}
            />
            <Divider />
            {uploadType === "quizzes" && (
              <BatchSelector
                selectedBatch={selectedBatch}
                onBatchChange={onBatchChange}
                testBatches={testBatches}
                onCreateNew={onCreateNewBatch}
              />
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
} 