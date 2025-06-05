import { DownloadOutlined } from "@ant-design/icons";

interface DownloadResultsProp {
  jsonData: any;
  csvData: any;
}

const DownloadResults = ({ jsonData, csvData }: DownloadResultsProp) => {
  const flatten = (obj: any, parentKey = "") => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      if (Array.isArray(value)) {
        acc[newKey] = value
          .map((v) => (typeof v === "object" ? JSON.stringify(v) : v))
          .join("; ");
      } else if (typeof value === "object" && value !== null) {
        Object.assign(acc, flatten(value, newKey));
      } else {
        acc[newKey] = value;
      }

      return acc;
    }, {} as any);
  };

  const downloadAsCsv = () => {
    if (!Array.isArray(csvData) || csvData.length === 0) {
      console.error("No data to download.");
      return;
    }

    const headers = Object.keys(flatten(csvData[0]));
    const csvRows: string[] = [
      headers.join(","),
      ...csvData.map((item) => {
        const flatItem = flatten(item);
        return headers
          .map((header) => {
            const cell = flatItem[header];
            const safeCell =
              cell === null || cell === undefined
                ? ""
                : String(cell).replace(/"/g, '""');
            return `"${safeCell}"`;
          })
          .join(",");
      }),
    ];

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "extraction-history.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAsJSON = () => {
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `extraction-history.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="mt-4 text-dark-gray text-[13px] font-normal">
        Download in CSV or JSON format.
      </div>
      <div className="flex gap-0 mt-2 mb-9 border border-[#D9D9D9] rounded-sm w-fit tetx-[14px] font-normal">
        <span
          className="p-2 border-r border-[#D9D9D9] cursor-pointer"
          onClick={downloadAsCsv}
        >
          <DownloadOutlined className="mr-[10px]" /> CSV
        </span>
        <span className="p-2 cursor-pointer" onClick={downloadAsJSON}>
          <DownloadOutlined className="mr-[10px]" /> JSON
        </span>
      </div>
    </div>
  );
};

export default DownloadResults;
