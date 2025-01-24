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
  useDisclosure,
  RadioGroup,
  Radio,
  Spinner,
  Progress,
} from "@nextui-org/react";
import { ChevronDown, ChevronRight, Plus, Edit2, Upload } from "lucide-react";
import NewCategoryModal from "./components/NewCategoryModal";
import NewTopicModal from "./components/NewTopicModal";
import {
  addNewExamCategory,
  addTopicToCategory,
  uploadQuizzesToBatch,
} from "@/lib/organizerService";

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
  const [notification, setNotification] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  });

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

  const handleFileUpload = async (event, batchId) => {
    event.preventDefault();
    const files = Array.from(event.target.files);

    if (files.length === 0) return;

    // Validate file types
    const invalidFiles = files.filter((file) => !file.name.endsWith(".json"));
    if (invalidFiles.length > 0) {
      setNotification({
        type: "error",
        title: "Invalid file type",
        message: "Please upload only JSON files",
      });
      onOpen();
      return;
    }

    setIsUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    try {
      const results = await uploadQuizzesToBatch(
        batchId,
        files,
        selectedLanguage,
        (current, total) => {
          setUploadProgress({ current, total });
        }
      );

      let message = [];
      if (results.successful.length > 0) {
        message.push(
          `Successfully uploaded ${results.successful.length} quizzes`
        );
      }
      if (results.failed.length > 0) {
        message.push(`Failed to upload ${results.failed.length} quizzes`);
      }

      setNotification({
        type: results.failed.length === 0 ? "success" : "warning",
        title: "Upload Results",
        message: message.join(". "),
      });
      onOpen();

      // Refresh the organizer data
      fetchOrganizerData();
    } catch (error) {
      setNotification({
        type: "error",
        title: "Upload Failed",
        message: error.message,
      });
      onOpen();
    } finally {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0 });
      // Reset the file input
      event.target.value = "";
    }
  };

  const renderUploadSection = (category, title, batchId) => {
    return (
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
        {isUploading ? (
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <Progress
              size="sm"
              value={(uploadProgress.current / uploadProgress.total) * 100}
              className="max-w-md"
            />
            <p className="text-sm text-gray-500">
              Processing {uploadProgress.current} of {uploadProgress.total}{" "}
              files...
            </p>
          </div>
        ) : (
          <>
            <input
              type="file"
              accept=".json"
              multiple
              className="hidden"
              id={`${category}Upload`}
              onChange={(e) => handleFileUpload(e, batchId)}
              disabled={isUploading}
            />
            <label
              htmlFor={`${category}Upload`}
              className={`cursor-pointer ${isUploading ? "pointer-events-none" : ""}`}
            >
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 mb-2" />
                <p className="text-lg mb-1">Upload {title} Tests</p>
                <p className="text-sm text-gray-500">
                  Click to select JSON files or drag and drop
                </p>
              </div>
            </label>
          </>
        )}
      </div>
    );
  };

  const renderExamContent = (examData) => {
    if (!selectedSection) return null;

    if (selectedSection === "topic_wise") {
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            {selectedTopic && (
              <Card key={selectedTopic} className="w-full col-span-2">
                <CardHeader className="font-bold">
                  <span>{selectedTopic.replace(/_/g, " ").toUpperCase()}</span>
                </CardHeader>
                <CardBody>
                  {renderUploadSection(
                    selectedTopic,
                    selectedTopic.replace(/_/g, " ").toUpperCase(),
                    examData.topic_wise[selectedTopic]
                  )}
                </CardBody>
              </Card>
            )}
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
            selectedSection.replace(/_/g, " ").toUpperCase(),
            examData[selectedSection]
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
            <ChevronDown className="w-4 h-4 text-primary" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )
        }
        onClick={() => {
          setSelectedExam(selectedExam === exam ? null : exam);
          setSelectedSection(null);
          setSelectedTopic(null);
        }}
        className={`font-medium ${
          selectedExam === exam ? "bg-primary-50" : "hover:bg-gray-50"
        }`}
      >
        {exam.replace(/_/g, " ").toUpperCase()}
      </ListboxItem>,
      ...(selectedExam === exam
        ? [
            <ListboxItem
              key={`${exam}-pyqs`}
              className={`pl-8 text-sm ${
                selectedSection === "pyqs"
                  ? "bg-primary-50 text-primary font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setSelectedSection("pyqs")}
            >
              PYQs
            </ListboxItem>,
            <ListboxItem
              key={`${exam}-mock`}
              className={`pl-8 text-sm ${
                selectedSection === "full_mock"
                  ? "bg-primary-50 text-primary font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setSelectedSection("full_mock")}
            >
              Full Mock
            </ListboxItem>,
            <ListboxItem
              key={`${exam}-topic`}
              startContent={
                selectedCategory === "topic_wise" ? (
                  <ChevronDown className="w-4 h-4 text-primary" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )
              }
              className={`pl-8 text-sm ${
                selectedSection === "topic_wise" && !selectedTopic
                  ? "bg-primary-50 text-primary font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
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
              ? Object.keys(examData.topic_wise).map((topic) => (
                  <ListboxItem
                    key={topic}
                    className={`pl-12 text-sm ${
                      selectedTopic === topic
                        ? "bg-primary-50 text-primary font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setSelectedSection("topic_wise");
                      setSelectedTopic(topic);
                    }}
                  >
                    {topic.replace(/_/g, " ").toUpperCase()}
                  </ListboxItem>
                ))
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

  const renderNotificationModal = () => (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader
              className={
                notification?.type === "error"
                  ? "text-danger"
                  : notification?.type === "success"
                    ? "text-success"
                    : "text-warning"
              }
            >
              {notification?.title}
            </ModalHeader>
            <ModalBody>
              <p>{notification?.message}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-72 p-4 bg-white border-r shadow-sm">
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold mb-3 text-gray-700">Language</h3>
          <RadioGroup
            value={selectedLanguage}
            onValueChange={setSelectedLanguage}
            orientation="horizontal"
            size="sm"
          >
            <Radio value="english">English</Radio>
            <Radio value="hindi">Hindi</Radio>
            <Radio value="bengali">Bengali</Radio>
          </RadioGroup>
        </div>

        <div className="mb-6">
          <Button
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
            className="w-full shadow-sm"
            onPress={() => setIsNewCategoryModalOpen(true)}
          >
            Add Category
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-240px)] rounded-lg border bg-white">
          <Listbox
            aria-label="Exam Categories"
            className="p-0 gap-0"
            itemClasses={{
              base: "px-3 rounded-none",
            }}
          >
            {renderListboxItems()}
          </Listbox>
        </div>
      </div>

      <main className="flex-1 p-8">
        {selectedExam && organizerData && (
          <div>
            <div className="flex flex-col gap-2 mb-6 bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-800">
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
              {selectedSection === "topic_wise" && (
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    color="primary"
                    variant="flat"
                    startContent={<Plus className="h-4 w-4" />}
                    onPress={() => setIsNewTopicModalOpen(true)}
                    className="w-fit"
                  >
                    Add New Topic
                  </Button>
                </div>
              )}
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

      {renderNotificationModal()}
    </div>
  );
}
