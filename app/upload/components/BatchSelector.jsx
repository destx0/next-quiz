import React from "react";
import {
  RadioGroup,
  Radio,
  Button,
} from "@nextui-org/react";

export default function BatchSelector({ 
  selectedBatch, 
  onBatchChange, 
  testBatches, 
  onCreateNew 
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Select Batch</h3>
        <Button 
          color="primary" 
          variant="flat" 
          onPress={onCreateNew}
          size="sm"
        >
          Create New Batch
        </Button>
      </div>
      <RadioGroup
        value={selectedBatch}
        onValueChange={onBatchChange}
        orientation="horizontal"
      >
        <Radio value="none">No Batch</Radio>
        {testBatches.map((batch) => (
          <Radio key={batch.id} value={batch.id}>
            {batch.title}
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
} 