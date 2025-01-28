import { DownloadOutlined } from "@ant-design/icons";

interface DownloadResultsProp {
  result: any;
}

const DownloadResults = ({ result }: DownloadResultsProp) => {
  const downloadAsCSV = () => {
    if (result.length === 0) return;

    const csvRows: string[] = [];
    const headers = Object.keys(result[0]) as Array<keyof (typeof result)[0]>;
    csvRows.push(headers.join(","));

    for (const row of result) {
      const values = headers.map((header) => row[header]);
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `extraction-history.csv`;

    link.click();
  };

  const downloadAsJSON = () => {
    const jsonString = JSON.stringify(result, null, 2);
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
