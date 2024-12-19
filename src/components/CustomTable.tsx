import React, { useState } from "react";

interface Column {
  title: string;
  dataIndex: string;
  key: string;
  render?: (value: any, record: any, index: number) => React.ReactNode;
}

interface CustomTableProps {
  columns: Column[];
  dataSource: any[];
  rowKey?: string;
  bordered?: boolean;
  striped?: boolean;
  className?: string;
  pagination?: { pageSize: number } | false;
}

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  dataSource,
  rowKey = "key",
  bordered = false,
  striped = false,
  className = "",
  pagination = { pageSize: 5 },
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedData = pagination
    ? dataSource.slice(
        (currentPage - 1) * pagination.pageSize,
        currentPage * pagination.pageSize
      )
    : dataSource;

  const totalPages = pagination
    ? Math.ceil(dataSource.length / pagination.pageSize)
    : 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleObjectData = (value: any) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return Object.values(value).join(", ") || "";
    }
    return value || "";
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table
        className={`w-full border-collapse ${
          bordered
            ? "border-black border-opacity-30 border-[1px] rounded-lg"
            : ""
        }`}
        style={{ borderSpacing: bordered ? "0px" : undefined }}
      >
        <thead>
          <tr className="bg-red">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2 text-left text-gray-700 border-[1px] border-gray-300 border-opacity-30"
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((record, rowIndex) => (
            <tr
              key={record[rowKey] || rowIndex}
              className={`${
                striped && rowIndex % 2 === 1 ? "bg-gray-100" : ""
              } hover:bg-gray-50`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-2 text-gray-600 border-[1px] border-gray-300 border-opacity-30"
                >
                  {col.render
                    ? col.render(record[col.dataIndex], record, rowIndex)
                    : handleObjectData(record[col.dataIndex])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && (
        <div className="flex justify-end items-center mt-4 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === index + 1
                  ? "bg-deep-blue text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomTable;
