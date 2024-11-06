import React from "react";
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

export default function NewBatchModal({
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
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
              <h2 className="text-xl font-bold">Create New Test Batch</h2>
              <p className="text-sm text-gray-500">
                Create a new batch to organize your quizzes
              </p>
            </ModalHeader>
            <ModalBody>
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
                    Add details about the batch&lsquo;s content, difficulty
                    level, or intended use
                  </p>
                </div>
              </div>
            </ModalBody>
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
                isDisabled={!title.trim()}
              >
                Create Batch
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
