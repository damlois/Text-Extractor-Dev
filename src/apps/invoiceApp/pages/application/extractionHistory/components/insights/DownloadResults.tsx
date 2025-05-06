import { DownloadOutlined } from "@ant-design/icons";

interface DownloadResultsProp {
  jsonData: any;
  csvData: any;
}

const DownloadResults = ({ jsonData, csvData }: DownloadResultsProp) => {
  const downloadAsCSV = () => {
    if (csvData.length === 0) return;
  
    const csvRows: string[] = [];
  
    const headers = Object.keys(csvData[0]);
    csvRows.push(headers.join(","));
  
    for (const row of csvData) {
      const values = headers.map((header) => {
        const raw = row[header];
        const value = raw !== undefined && raw !== null ? String(raw) : "";
  
        return `"${value.replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(","));
    }
  
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "extraction-history.csv";
    link.style.display = "none";
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
          onClick={downloadAsCSV}
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
