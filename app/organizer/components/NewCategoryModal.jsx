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

export default function NewCategoryModal({ isOpen, onClose, onAdd }) {
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
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalContent>
        <ModalHeader>Add New Category</ModalHeader>
        <ModalBody>
          <Input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
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
