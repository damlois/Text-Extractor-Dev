import React, { useEffect, useState } from "react";
import AppInput from "../../../../../components/AppInput";
import AppButton from "../../../../../components/AppButton";
import { LabelT } from "./types";
import AppTextArea from "../../../../../components/AppTextArea";
import LabelTag from "../../components/LabelTag";
import ExtractionResults from "../../components/ExtractionResults";
import { useAnalyzeFiles } from "../../../../../hooks/useFileProcessor";
import { Instruction } from "../../../../../types";
import { showNotification } from "../../../../../utils/notification";
import { initialInputState } from "./constants";
import { useFileProcessor } from "../../../../../context/FileProcessorContext";

const FieldExtraction = () => {
  const [labels, setLabels] = useState<LabelT[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputState, setInputState] = useState<LabelT>(initialInputState);
  const [showResult, setShowResult] = useState(false);

  const { sessionType } = useFileProcessor();
  const { analyzeFiles } = useAnalyzeFiles();

  useEffect(() => {
    sessionType === "Existing" && setShowResult(true);
  }, []);

  const handleLabelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputState({
      ...inputState,
      name: value,
      id: (labels[labels.length - 1]?.id || 0) + 1,
    });
  };

  const handleDescriptionInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setInputState({
      ...inputState,
      description: value,
      id: (labels[labels.length - 1]?.id || 0) + 1,
    });
  };

  const handleAddLabel = () => {
    setLabels([...labels, inputState]);
    setInputState(initialInputState);
  };

  const handleLabelRemoval = (selectedLabelId: number) => {
    const newLables = labels.filter((label) => label.id !== selectedLabelId);
    setLabels(newLables);
  };

  const handleExtraction = async () => {
    const instructions: Instruction[] = labels.map((label) => ({
      title: label.name,
      description: label.description,
    }));

    try {
      setLoading(true);
      await analyzeFiles(instructions);
      setLoading(false);
      showNotification("success", `Data extracted successfully!`);
      setShowResult(!showResult);
    } catch (error) {
      setLoading(false);
      showNotification(
        "error",
        "Extraction failed",
        "There was an issue extracting your data. Please try again."
      );
    }
  };

  return (
    <div>
      {!showResult ? (
        <div className="flex flex-col items-center w-full">
          <h2 className="text-black text-[6] text-[24px] mb-6">Add a Label</h2>

          <div className="flex flex-col sm:w-[80%] md:w-[40%] mb-6">
            <div className="flex flex-wrap gap-4 items-start mb-4">
              {labels.map((label) => (
                <LabelTag
                  key={label.id}
                  id={label.id}
                  name={label.name}
                  handleRemove={handleLabelRemoval}
                />
              ))}
            </div>
            <AppInput
              label="Label name"
              tooltip="Enter label name"
              placeholder="Enter a label name"
              value={inputState.name}
              onChange={handleLabelInputChange}
              required
            />
            <AppTextArea
              label="Description"
              tooltip="Describe your label name"
              placeholder="Describe your label name"
              value={inputState.description}
              onChange={handleDescriptionInputChange}
              required
            />
            <div className="flex gap-2 items-center mt-6">
              <AppButton
                disabled={
                  inputState.name.length < 2 ||
                  inputState.description.length < 2
                }
                onClick={handleAddLabel}
                variant="secondary"
                dottedBorder
              >
                <span className="mr-[10px] text-[16px]">+</span>Add label
              </AppButton>
              <AppButton
                disabled={!labels.length}
                onClick={handleExtraction}
                loading={loading}
              >
                Extract Data
              </AppButton>
            </div>
          </div>
        </div>
      ) : (
        <ExtractionResults />
      )}
    </div>
  );
};

export default FieldExtraction;
