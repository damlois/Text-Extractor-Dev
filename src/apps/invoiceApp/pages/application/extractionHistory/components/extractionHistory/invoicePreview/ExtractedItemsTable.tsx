interface ExtractedItemsTableProps {
  label: string;
  itemsFieldData: any;
}

const ExtractedItemsTable = ({
  label,
  itemsFieldData,
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

  const renderStrings = (arr: (string | null | undefined)[]) => (
    <tbody>
      {arr.map((str, idx) => (
        <tr key={idx} className="border-t border-[#E5E7EB]">
          <td className="px-4 py-2 text-left text-dark-gray text-[11px] font-medium">
            {str ?? "—"}
          </td>
        </tr>
      ))}
    </tbody>
  );

  const renderObjects = (arr: (Record<string, any> | null | undefined)[]) => {
    // Clean the data first
    const cleanedData = Array.isArray(arr)
      ? arr.filter(
          (item) => item && typeof item === "object" && !Array.isArray(item)
        )
      : [];

    if (cleanedData.length === 0) return null;

    const headers = Object.keys(cleanedData[0] ?? {});

    return (
      <>
        <thead className="bg-[#F5F5F5]">
          <tr>
            {headers.map((key) => (
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
          {cleanedData.map((item, idx) => (
            <tr key={idx} className="border-t border-[#E5E7EB]">
              {headers.map((key, i) => {
                const val = item?.[key];
                return (
                  <td
                    key={i}
                    className="px-4 py-2 text-left text-dark-gray text-[11px] font-medium"
                  >
                    {val === null || val === undefined
                      ? "—"
                      : typeof val === "object"
                      ? JSON.stringify(val)
                      : String(val)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </>
    );
  };

  const renderTableContent = () => {
    if (isArrayOfObjects) return renderObjects(itemsFieldData);
    if (isArrayOfStrings) return renderStrings(itemsFieldData);
    if (isNumericKeyedObject)
      return renderStrings(Object.values(itemsFieldData));
    return null;
  };

  return (
    <div className="w-full">
      <p className="text-dark-gray text-[14px] font-bold mb-2">{label}</p>
      <div className="overflow-x-auto border-t border-b border-[#E5E7EB]">
        <table className="min-w-full">{renderTableContent()}</table>
      </div>
    </div>
  );
};

export default ExtractedItemsTable;
