import React from "react";
import { RadioGroup, Radio } from "@nextui-org/react";
import { LANGUAGES } from "../constants";

export default function LanguageSelector({ 
  selectedLanguage, 
  onLanguageChange 
}) {
  return (
    <RadioGroup
      label="Select Language"
      value={selectedLanguage}
      onValueChange={onLanguageChange}
      orientation="horizontal"
      classNames={{
        wrapper: "gap-6"
      }}
    >
      {LANGUAGES.map((lang) => (
        <Radio key={lang.value} value={lang.value}>
          {lang.label}
        </Radio>
      ))}
    </RadioGroup>
  );
} 