"use client";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Listbox,
  ListboxItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "@nextui-org/react";
import { ChevronDown, ChevronRight, Plus, Edit2, Upload } from "lucide-react";
import NewCategoryModal from "./components/NewCategoryModal";
import NewTopicModal from "./components/NewTopicModal";
import { addNewExamCategory, addTopicToCategory } from "@/lib/organizerService";

export default function OrganizerPage() {
  const [organizerData, setOrganizerData] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [isNewTopicModalOpen, setIsNewTopicModalOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    fetchOrganizerData();
  }, []);

  const fetchOrganizerData = async () => {
    try {
      const response = await fetch("/api/organizer");
      const { data } = await response.json();
      setOrganizerData(data);
    } catch (error) {
      console.error("Failed to fetch organizer data:", error);
    }
  };

  const renderUploadSection = (category, title) => {
    return (
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
        <input
          type="file"
          accept=".json"
          multiple
          className="hidden"
          id={`${category}Upload`}
        />
        <label htmlFor={`${category}Upload`} className="cursor-pointer">
          <div className="flex flex-col items-center">
            <Upload className="w-8 h-8 mb-2" />
            <p className="text-lg mb-1">Upload {title} Tests</p>
            <p className="text-sm text-gray-500">
              Click to select JSON files or drag and drop
            </p>
          </div>
        </label>
      </div>
    );
  };

  const renderExamContent = (examData) => {
    if (!selectedSection) return null;

    if (selectedSection === "topic_wise") {
      return (
        <>
          <div className="flex justify-end mb-4">
            <Button
              color="primary"
              startContent={<Plus className="w-4 h-4" />}
              onPress={() => setIsNewTopicModalOpen(true)}
            >
              Add Topic
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(examData.topic_wise).map(([topic, batchId]) => (
              <Card key={topic} className="w-full">
                <CardHeader className="font-bold">
                  <span>{topic.replace(/_/g, " ").toUpperCase()}</span>
                </CardHeader>
                <CardBody>
                  {renderUploadSection(
                    topic,
                    topic.replace(/_/g, " ").toUpperCase()
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        </>
      );
    }

    return (
      <Card className="w-full">
        <CardHeader className="font-bold">
          <span>{selectedSection.replace(/_/g, " ").toUpperCase()}</span>
        </CardHeader>
        <CardBody>
          {renderUploadSection(
            selectedSection,
            selectedSection.replace(/_/g, " ").toUpperCase()
          )}
        </CardBody>
      </Card>
    );
  };

  const renderListboxItems = () => {
    if (!organizerData) return null;

    return Object.entries(organizerData).flatMap(([exam, examData]) => [
      <ListboxItem
        key={exam}
        startContent={
          selectedExam === exam ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )
        }
        onClick={() => {
          setSelectedExam(selectedExam === exam ? null : exam);
          setSelectedSection(null);
        }}
      >
        {exam.replace(/_/g, " ").toUpperCase()}
      </ListboxItem>,
      ...(selectedExam === exam
        ? [
            <ListboxItem
              key={`${exam}-pyqs`}
              className="pl-6"
              onClick={() => setSelectedSection("pyqs")}
            >
              PYQs
            </ListboxItem>,
            <ListboxItem
              key={`${exam}-mock`}
              className="pl-6"
              onClick={() => setSelectedSection("full_mock")}
            >
              Full Mock
            </ListboxItem>,
            <ListboxItem
              key={`${exam}-topic`}
              startContent={
                selectedCategory === "topic_wise" ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )
              }
              className="pl-6"
              onClick={() => {
                setSelectedCategory(
                  selectedCategory === "topic_wise" ? null : "topic_wise"
                );
                setSelectedSection("topic_wise");
              }}
            >
              Topic Wise
            </ListboxItem>,
            ...(selectedCategory === "topic_wise"
              ? [
                  <ListboxItem
                    key={`${exam}-add-topic`}
                    className="pl-12"
                    startContent={<Plus className="w-4 h-4" />}
                    onClick={() => setIsNewTopicModalOpen(true)}
                  >
                    Add New Topic
                  </ListboxItem>,
                  ...Object.keys(examData.topic_wise).map((topic) => (
                    <ListboxItem
                      key={topic}
                      className="pl-12"
                      onClick={() => setSelectedSection("topic_wise")}
                    >
                      {topic.replace(/_/g, " ").toUpperCase()}
                    </ListboxItem>
                  )),
                ]
              : []),
          ]
        : []),
    ]);
  };

  const handleAddCategory = async (categoryName) => {
    try {
      await addNewExamCategory(categoryName);
      fetchOrganizerData();
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  const handleAddTopic = async (categoryName, topicName) => {
    try {
      await addTopicToCategory(categoryName, topicName);
      fetchOrganizerData();
    } catch (error) {
      console.error("Failed to add topic:", error);
    }
  };

  const handleRename = async (itemType, oldName, newName) => {
    try {
      fetchOrganizerData();
      setIsRenaming(false);
      setNewName("");
      setSelectedItem(null);
    } catch (error) {
      console.error("Failed to rename item:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-64 p-4 bg-gray-100 border-r">
        <div className="mb-4">
          <Button
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
            className="w-full"
            onPress={() => setIsNewCategoryModalOpen(true)}
          >
            Add Category
          </Button>
        </div>
        <Listbox
          aria-label="Exam Categories"
          className="p-0 gap-0 divide-y divide-default-300/50 dark:divide-default-100/80"
        >
          {renderListboxItems()}
        </Listbox>
      </div>
      <main className="flex-1 p-8">
        {selectedExam && organizerData && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <h1 className="text-2xl font-bold">
                {selectedExam.replace(/_/g, " ").toUpperCase()}
              </h1>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => {
                  setIsRenaming(true);
                  setSelectedItem({ type: "category", name: selectedExam });
                  setNewName(selectedExam.replace(/_/g, " ").toUpperCase());
                }}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
            {renderExamContent(organizerData[selectedExam])}
          </div>
        )}
      </main>

      <NewCategoryModal
        isOpen={isNewCategoryModalOpen}
        onClose={() => setIsNewCategoryModalOpen(false)}
        onAdd={handleAddCategory}
      />

      <NewTopicModal
        isOpen={isNewTopicModalOpen}
        onClose={() => setIsNewTopicModalOpen(false)}
        onAdd={handleAddTopic}
        examCategory={selectedExam}
      />

      <Modal isOpen={isRenaming} onClose={() => setIsRenaming(false)}>
        <ModalContent>
          <ModalHeader>Rename {selectedItem?.type}</ModalHeader>
          <ModalBody>
            <Input
              label="New Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setIsRenaming(false)}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={() =>
                handleRename(selectedItem?.type, selectedItem?.name, newName)
              }
            >
              Rename
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
