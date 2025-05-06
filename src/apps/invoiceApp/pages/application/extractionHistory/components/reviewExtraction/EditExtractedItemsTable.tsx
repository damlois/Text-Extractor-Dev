import { ChangeEvent } from "react";
import ConfidenceBadge from "./ConfidenceBadge";

interface ExtractedItemsTableProps {
  label: string;
  itemsFieldData: any;
  confidence: number | undefined;
  onCellChange?: (rowIndex: number, key: string, value: string) => void;
}

const EditExtractedItemsTable = ({
  label,
  itemsFieldData,
  confidence,
  onCellChange,
}: ExtractedItemsTableProps) => {
  const isArray = Array.isArray(itemsFieldData);
  const isArrayOfObjects =
    isArray &&
    itemsFieldData.length > 0 &&
    typeof itemsFieldData[0] === "object" &&
    !Array.isArray(itemsFieldData[0]);
  const isArrayOfStrings =
    isArray &&
    itemsFieldData.length > 0 &&
    typeof itemsFieldData[0] === "string";
  const isNumericKeyedObject =
    !isArray &&
    itemsFieldData &&
    typeof itemsFieldData === "object" &&
    Object.keys(itemsFieldData).every((key) => /^\d+$/.test(key));

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    key: string
  ) => {
    if (onCellChange) {
      onCellChange(rowIndex, key, e.target.value);
    }
  };

  const renderStrings = (arr: string[]) => (
    <tbody>
      {arr.map((str, idx) => (
        <tr key={idx} className="border-t border-[#E5E7EB]">
          <td className="px-4 py-2 text-left text-dark-gray text-[11px] font-medium">
            <input
              type="text"
              value={str}
              onChange={(e) => handleInputChange(e, idx, "")}
              className="w-full bg-transparent border-none outline-none text-[11px] text-dark-gray"
            />
          </td>
        </tr>
      ))}
    </tbody>
  );

  const renderObjects = (arr: any[]) => (
    <>
      <thead className="bg-[#F5F5F5]">
        <tr>
          {Object.keys(arr[0]).map((key) => (
            <th
              key={key}
              className="px-4 py-2 text-left text-dark-gray text-[10px] font-medium extracted-content-th"
            >
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {arr.map((item, rowIndex) => (
          <tr key={rowIndex} className="border-t border-[#E5E7EB]">
            {Object.entries(item).map(([key, value], colIndex) => (
              <td
                key={colIndex}
                className="px-4 py-2 text-left text-dark-gray text-[11px] font-medium"
              >
                <input
                  type="text"
                  value={
                    typeof value === "object" && value !== null
                      ? JSON.stringify(value)
                      : String(value)
                  }
                  onChange={(e) => handleInputChange(e, rowIndex, key)}
                  className="w-full bg-transparent border-none outline-none text-[11px] text-dark-gray"
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </>
  );

  const renderTableContent = () => {
    if (isArrayOfObjects) return renderObjects(itemsFieldData);
    if (isArrayOfStrings) return renderStrings(itemsFieldData);
    if (isNumericKeyedObject)
      return renderStrings(Object.values(itemsFieldData));
    return null;
  };

  return (
    <div className="w-full">
      <label className="text-dark-gray text-[14px] font-bold">
        {label}
        {confidence && typeof confidence === "number" && (
          <ConfidenceBadge confidence={confidence} />
        )}
      </label>
      <div className="overflow-x-auto border-t border-b border-[#E5E7EB] mt-2">
        <table className="min-w-full">{renderTableContent()}</table>
      </div>
    </div>
  );
};

export default EditExtractedItemsTable;
