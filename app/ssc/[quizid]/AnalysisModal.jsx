import React, { useMemo } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

const AnalysisModal = ({ quizData, score, isOpen, onOpenChange }) => {
  const calculateStatistics = () => {
    if (!quizData || !quizData.sections) {
      console.error("Invalid quizData structure");
      return null;
    }

    const sectionStats = quizData.sections.map((section) => {
      const totalQuestions = section.questions.length;
      const attempted = section.questions.filter(
        (q) => q.selectedOption !== null
      ).length;
      const correct = section.questions.filter(
        (q) => q.selectedOption === q.correctAnswer
      ).length;
      const timeSpent = section.questions.reduce(
        (total, q) => total + q.timeSpent,
        0
      );

      return {
        name: section.name,
        totalQuestions,
        attempted,
        correct,
        wrong: attempted - correct,
        unattempted: totalQuestions - attempted,
        timeSpent,
      };
    });

    const totalQuestions = sectionStats.reduce(
      (sum, section) => sum + section.totalQuestions,
      0
    );
    const totalAttempted = sectionStats.reduce(
      (sum, section) => sum + section.attempted,
      0
    );
    const totalCorrect = sectionStats.reduce(
      (sum, section) => sum + section.correct,
      0
    );
    const totalWrong = sectionStats.reduce(
      (sum, section) => sum + section.wrong,
      0
    );
    const totalUnattempted = sectionStats.reduce(
      (sum, section) => sum + section.unattempted,
      0
    );
    const totalTimeSpent = sectionStats.reduce(
      (sum, section) => sum + section.timeSpent,
      0
    );

    return {
      totalQuestions,
      totalAttempted,
      totalCorrect,
      totalWrong,
      totalUnattempted,
      totalTimeSpent,
      sectionStats,
    };
  };

  const stats = useMemo(() => calculateStatistics(), [quizData]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const renderAnalysis = () => {
    if (!stats) {
      return (
        <p>
          Error: Unable to calculate statistics. Please check the quiz data.
        </p>
      );
    }

    const columns = [
      { key: "name", label: "Section" },
      { key: "score", label: "Score" },
      { key: "attempted", label: "Attempted" },
      { key: "accuracy", label: "Accuracy" },
      { key: "time", label: "Time" },
    ];

    const sectionData = stats.sectionStats.map((section) => ({
      name: section.name,
      score: `${section.correct} / ${section.totalQuestions}`,
      attempted: `${section.attempted} / ${section.totalQuestions}`,
      accuracy:
        section.attempted > 0
          ? `${((section.correct / section.attempted) * 100).toFixed(2)}%`
          : "0%",
      time: formatTime(section.timeSpent),
    }));

    const overallData = {
      name: "Overall",
      score: `${stats.totalCorrect} / ${stats.totalQuestions}`,
      attempted: `${stats.totalAttempted} / ${stats.totalQuestions}`,
      accuracy:
        stats.totalAttempted > 0
          ? `${((stats.totalCorrect / stats.totalAttempted) * 100).toFixed(2)}%`
          : "0%",
      time: formatTime(stats.totalTimeSpent),
    };

    const tableData = [...sectionData, overallData];

    return (
      <Card className="w-full mx-auto">
        <CardBody className="p-4">
          <Table aria-label="Analysis table">
            <TableHeader>
              {columns.map((column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              ))}
            </TableHeader>
            <TableBody>
              {tableData.map((item, index) => (
                <TableRow
                  key={index}
                  className={index === tableData.length - 1 ? "font-bold" : ""}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key}>{item[column.key]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <p>
              <strong>Total Score:</strong> {score}
            </p>
          </div>
        </CardBody>
      </Card>
    );
  };

  return (
    <>
      <Button
        className={`px-4 py-2 rounded bg-[#92c4f2] text-black`}
        onPress={() => onOpenChange(true)}
      >
        Show Analysis
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        size="5xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Quiz Analysis
              </ModalHeader>
              <ModalBody>{renderAnalysis()}</ModalBody>
              <ModalFooter>
                <Button
                  className={`px-4 py-2 rounded bg-[#92c4f2] text-black`}
                  onClick={onClose}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AnalysisModal;
