import React, { useState } from "react";
import AppInput from "../../../../components/AppInput";
import AppButton from "../../../../components/AppButton";
import { LabelT } from "../types";
import AppTextArea from "../../../../components/AppTextArea";
import LabelTag from "../components/LabelTag";
import ExtractionResults from "../components/ExtractionResults";

const FieldExtraction = () => {
  const [labels, setLabels] = useState<LabelT[]>([]);
  const [inputState, setInputState] = useState<LabelT>({
    id: 0,
    name: "",
    description: "",
  });
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>([
    { id: 1, name: "John Doe", age: 28, email: "johndoe@example.com" },
    { id: 2, name: "Jane Smith", age: 32, email: "janesmith@example.com" },
    {
      id: 3,
      name: "Alice Johnson",
      age: 24,
      email: "alicejohnson@example.com",
    },
  ]);

  const handleLabelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(e.target.value);
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
  };

  const handleLabelRemoval = (selectedLabelId: number) => {
    const newLables = labels.filter((label) => label.id !== selectedLabelId);
    setLabels(newLables);
  };

  const handleExtraction = () => {
    setShowResult(!showResult);
  };

  return (
    <div>
      {!showResult ? (
        <div className="flex flex-col items-center w-full">
          <h2 className="text-black text-[6] text-[24px] mb-2">Add a label</h2>

          <div className="flex flex-col w-[40%] mb-6">
            <div className="flex flex-wrap gap-4 items-start">
              {labels.map((label) => (
                <LabelTag
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
              onChange={handleLabelInputChange}
              required
            />
            <AppTextArea
              label="Description"
              tooltip="Describe your label name"
              placeholder="Describe your label name"
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
              >
                Add label
              </AppButton>
              <AppButton disabled={!labels.length} onClick={handleExtraction}>
                Extract Data
              </AppButton>
            </div>
          </div>
        </div>
      ) : (
        <ExtractionResults result={result} />
      )}
    </div>
  );
};

export default FieldExtraction;
