"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@nextui-org/react";
import { useState } from "react";

// Base Modal Componentfff
function BaseFormModal({
  isOpen,
  onClose,
  title,
  description,
  onSubmit,
  isLoading,
  children,
  submitLabel = "Add",
  size = "sm",
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      classNames={{
        base: "bg-white dark:bg-gray-900",
        header: "border-b border-gray-200 dark:border-gray-700",
        body: "py-6",
        footer: "border-t border-gray-200 dark:border-gray-700",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">{title}</h2>
              {description && (
                <p className="text-sm text-gray-500">{description}</p>
              )}
            </ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                className="font-medium"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={onSubmit}
                isLoading={isLoading}
                className="font-medium"
              >
                {submitLabel}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export function NewCategoryModal({ isOpen, onClose, onAdd }) {
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!categoryName.trim()) return;

    setIsLoading(true);
    try {
      const formattedName = categoryName
        .toLowerCase()
        .replace(/\s+/g, "_")
        .trim();
      await onAdd(formattedName);
      setCategoryName("");
      onClose();
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Category"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <Input
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        placeholder="Enter category name"
      />
    </BaseFormModal>
  );
}

export function NewTopicModal({ isOpen, onClose, onAdd, examCategory }) {
  const [topicName, setTopicName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!topicName.trim()) return;

    setIsLoading(true);
    try {
      const formattedName = topicName.toLowerCase().replace(/\s+/g, "_").trim();
      await onAdd(examCategory, formattedName);
      setTopicName("");
      onClose();
    } catch (error) {
      console.error("Error adding topic:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Topic"
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <Input
        value={topicName}
        onChange={(e) => setTopicName(e.target.value)}
        placeholder="Enter topic name"
      />
    </BaseFormModal>
  );
}

export function NewBatchModal({
  isOpen,
  onClose,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  onSubmit,
  isLoading,
}) {
  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Test Batch"
      description="Create a new batch to organize your quizzes"
      onSubmit={onSubmit}
      isLoading={isLoading}
      submitLabel="Create Batch"
      size="lg"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <p>Title</p>
          <Input
            value={title}
            onChange={onTitleChange}
            variant="bordered"
            labelPlacement="outside"
            isRequired
            classNames={{
              label: "text-sm font-medium text-gray-700",
              input: "bg-transparent",
              inputWrapper: "bg-default-100",
            }}
          />
        </div>

        <div className="space-y-2">
          <Textarea
            label="Description"
            placeholder="Describe the purpose and content of this batch"
            value={description}
            onChange={onDescriptionChange}
            variant="bordered"
            labelPlacement="outside"
            minRows={3}
            classNames={{
              label: "text-sm font-medium text-gray-700",
              input: "bg-transparent",
              inputWrapper: "bg-default-100",
            }}
          />
          <p className="text-xs text-gray-500">
            Add details about the batch&apos;s content, difficulty level, or
            intended use
          </p>
        </div>
      </div>
    </BaseFormModal>
  );
}
