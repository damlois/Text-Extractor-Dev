import { ChangeEvent, useEffect, useState } from "react";
import ConfidenceBadge from "./ConfidenceBadge";


interface TableRow {
  [key: string]: string;
}


interface ExtractedItemsTableProps {
  label: string;
  itemsFieldData: TableRow[];
  confidence?: number;
  onCellChange?: (rowIndex: number, key: string, value: string) => void;
  onDataUpdate?: (newData: TableRow[]) => void;
}


const EditExtractedItemsTable = ({
  label,
  itemsFieldData,
  confidence,
  onCellChange,
  onDataUpdate,
}: ExtractedItemsTableProps) => {
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");


  useEffect(() => {
    const cleanedData = Array.isArray(itemsFieldData)
      ? itemsFieldData.filter(
          (item) => item && typeof item === "object" && !Array.isArray(item)
        )
      : [];


    if (cleanedData.length > 0) {
      setTableData(cleanedData);
      setColumns(Object.keys(cleanedData[0]));
    }
  }, []);


  const updateData = (newData: TableRow[]) => {
    setTableData(newData);
    onDataUpdate?.(newData);
  };


  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    key: string
  ) => {
    const newData = [...tableData];
    newData[rowIndex][key] = e.target.value;
    updateData(newData);
    onCellChange?.(rowIndex, key, e.target.value);
  };


  const addRow = () => {
    const newRow: TableRow = {};
    columns.forEach((col) => {
      newRow[col] = "";
    });
    updateData([...tableData, newRow]);
  };


  const removeRow = (rowIndex: number) => {
    const newData = tableData.filter((_, idx) => idx !== rowIndex);
    updateData(newData);
  };


  const handleAddColumn = () => {
    const trimmed = newColumnName.trim();
    if (!trimmed || columns.includes(trimmed)) return;


    const updatedData = tableData.map((row) => ({
      ...row,
      [trimmed]: "",
    }));


    setColumns([...columns, trimmed]);
    updateData(updatedData);
    setNewColumnName("");
    setShowModal(false);
  };


  const removeColumn = (key: string) => {
    const updatedColumns = columns.filter((col) => col !== key);
    const updatedData = tableData.map(({ [key]: _, ...rest }) => rest);
    setColumns(updatedColumns);
    updateData(updatedData);
  };


  return (
    <div className="w-full text-sm">
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Column</h3>
            <input
              type="text"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              placeholder="Enter column name"
              className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddColumn}
                className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Header */}
      <label className="text-gray-700 text-sm font-semibold flex items-center justify-between mb-2">
        <span className="flex items-center gap-2">
          {label}
          {confidence !== undefined && <ConfidenceBadge confidence={confidence} />}
        </span>
        <div className="flex gap-3 text-xs text-blue-600 font-medium">
          <button onClick={addRow} className="hover:underline">+ Row</button>
          <button onClick={() => setShowModal(true)} className="hover:underline">+ Column</button>
        </div>
      </label>


      {/* Table */}
      <div className="overflow-x-auto rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-4 py-2 text-left text-gray-600 font-medium relative min-w-[100px] text-[12px]">
                  {col}
                  <button
                    onClick={() => removeColumn(col)}
                    className="ml-1 text-red-500 hover:underline text-xs"
                    title="Remove column"
                  >
                    ✕
                  </button>
                </th>
              ))}
              <th className="px-4 py-2 text-gray-500 text-xs"></th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex} className="">
                {columns.map((col) => (
                  <td key={col} className="px-4 py-2">
                    <input
                      type="text"
                      value={row[col] ?? ""}
                      onChange={(e) => handleInputChange(e, rowIndex, col)}
                      className="w-full bg-transparent border-b border-gray focus:outline-none focus:border-blue-500 text-gray-700 font-normal text-[12px]"
                    />
                  </td>
                ))}
                <td className="px-4 py-2 text-red-500 text-xs">
                  <button
                    onClick={() => removeRow(rowIndex)}
                    className="hover:underline"
                    title="Remove row"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default EditExtractedItemsTable;
