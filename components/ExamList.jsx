import React from "react";
import { Card, Chip } from "@nextui-org/react";
import { title } from "@/components/primitives";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link"; // Add this import

const exams = [
  { name: "CGL", upcoming: false },
  { name: "CHSL", upcoming: true },
  { name: "CPO", upcoming: true },
  { name: "MTS", upcoming: true },
  { name: "Stenographer", upcoming: true },
  { name: "JE", upcoming: true },
  { name: "GD Constable", upcoming: true },
  { name: "Selection Posts", upcoming: true },
];

export default function ExamList() {
  return (
    <section className="mb-16">
      <h2 className={title({ size: "sm", class: "text-center mb-12" })}>
        SSC Exams We Cover
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 justify-items-center">
        {exams.map((exam, index) => (
          <motion.div
            key={exam.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="w-full max-w-[250px]"
          >
            {exam.name === "CGL" ? (
              <Link href="/ssc-mock">
                <Card className="overflow-hidden relative group transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm cursor-pointer">
                  <Card className="relative z-10 p-4 bg-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Image
                          src="/ssc.png"
                          alt={`${exam.name} logo`}
                          width={40}
                          height={40}
                        />
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {exam.name}
                        </p>
                      </div>
                      {exam.upcoming && <Chip size="sm">Upcoming</Chip>}
                    </div>
                  </Card>
                </Card>
              </Link>
            ) : (
              <Card className="overflow-hidden relative group transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
                <Card className="relative z-10 p-4 bg-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Image
                        src="/ssc.png"
                        alt={`${exam.name} logo`}
                        width={40}
                        height={40}
                      />
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {exam.name}
                      </p>
                    </div>
                    {exam.upcoming && <Chip size="sm">Upcoming</Chip>}
                  </div>
                </Card>
              </Card>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
