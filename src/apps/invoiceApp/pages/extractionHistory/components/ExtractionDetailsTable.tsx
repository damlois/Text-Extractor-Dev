import DownloadResults from "./DownloadResults";
import CustomTable from "../../../../../components/CustomTable";
import { constructTableColumns } from "../../../../../utils";

const ExtractionDetailsTable = () => {
    const result = [
        {
          id: "1",
          "Invoice Name": "Lois Adegbohungbe",
          "Invoice Date": "26-01-2025",
          "Vendor Name": "Lola Akindipe",
          "Vendor Address": "34 Kings Strret",
          "Loan Term": "15 days",
          "Due Date": "15-03-2023",
          "Total Sales": "$25",
          "Late Payment Fee": "$25,000",
          "Payment Due Date": "15-09-2027",
        },
        {
          id: "2",
          "Invoice Name": "Lois Adegbohungbe",
          "Invoice Date": "26-01-2025",
          "Vendor Name": "Lola Akindipe",
          "Vendor Address": "34 Kings Strret",
          "Loan Term": "15 days",
          "Due Date": "15-03-2023",
          "Total Sales": "$25",
          "Late Payment Fee": "$25,000",
          "Payment Due Date": "15-09-2027",
        },
        {
          id: "3",
          "Invoice Name": "Lois Adegbohungbe",
          "Invoice Date": "26-01-2025",
          "Vendor Name": "Lola Akindipe",
          "Vendor Address": "34 Kings Strret",
          "Loan Term": "15 days",
          "Due Date": "15-03-2023",
          "Total Sales": "$25",
          "Late Payment Fee": "$25,000",
          "Payment Due Date": "15-09-2027",
        },
        {
          id: "4",
          "Invoice Name": "Lois Adegbohungbe",
          "Invoice Date": "26-01-2025",
          "Vendor Name": "Lola Akindipe",
          "Vendor Address": "34 Kings Strret",
          "Loan Term": "15 days",
          "Due Date": "15-03-2023",
          "Total Sales": "$25",
          "Late Payment Fee": "$25,000",
          "Payment Due Date": "15-09-2027",
        },
      ];
  return (
    <div className="flex gap-4 justify-start items-start w-full">
      <img src="/assets/icons/blue-circle-icon.svg" />
      <div style={{ width: "-webkit-fill-available" }}>
        <p className="text-[13px] font-normal text-dark-gray mb-4">
          Review the details of your extraction below
        </p>
        <div className="w-full">
          <CustomTable
            dataSource={result}
            columns={constructTableColumns(result)}
            rowKey="id"
            pagination={result.length > 7 ? { pageSize: 7 } : false}
            bordered
            striped
          />
        </div>
        <DownloadResults result={result} />
      </div>
    </div>
  );
};

export default ExtractionDetailsTable;
