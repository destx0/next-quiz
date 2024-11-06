"use client";

import React from "react";
import QuizBatches from "./QuizBatches";

export default function SSCPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow overflow-y-auto">
        <div className="container mx-auto p-4">
          <QuizBatches />
        </div>
      </main>
    </div>
  );
}
