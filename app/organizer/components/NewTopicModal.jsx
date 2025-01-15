"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useState } from "react";

export default function NewTopicModal({
  isOpen,
  onClose,
  onAdd,
  examCategory,
}) {
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
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalContent>
        <ModalHeader>Add New Topic</ModalHeader>
        <ModalBody>
          <Input
            label="Topic Name"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={isLoading}>
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
