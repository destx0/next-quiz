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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Create New Batch</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  label="Batch Title"
                  placeholder="Enter batch title"
                  value={title}
                  onChange={onTitleChange}
                  required
                />
                <Textarea
                  label="Description"
                  placeholder="Enter batch description"
                  value={description}
                  onChange={onDescriptionChange}
                  minRows={3}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={onSubmit}
                isLoading={isLoading}
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