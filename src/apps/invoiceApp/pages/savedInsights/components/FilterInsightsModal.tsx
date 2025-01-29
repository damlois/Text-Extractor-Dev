import { DatePicker, Modal, Tooltip } from "antd";
import AppButton from "../../../../../components/AppButton";
import { InfoCircleOutlined } from "@ant-design/icons";

interface FilterInsightsModalProps {
  open: boolean;
  onCancel: () => void;
}

const FilterInsightsModal = ({ open, onCancel }: FilterInsightsModalProps) => {
  const { RangePicker } = DatePicker;

  const handleDateChange = (dates: any) => {
    if (dates) {
      const [dateFrom, dateTo] = dates;
      console.log("From:", dateFrom?.format("YYYY-MM-DD"));
      console.log("To:", dateTo?.format("YYYY-MM-DD"));
    } else {
      console.log("No date selected.");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      className="app-modal"
      style={{ minWidth: "30%", top: "30%" }}
    >
      <div>
        <div className="text-[20px] font-bold p-6 border-b border-0.5 border-[#cfc1c1]">
          Filter by Date
        </div>
        <div className="p-6">
          <div className={`flex items-center gap-2 mb-2 `}>
            <p className="text-dark-gray font-bold text-[14.5px]">Date Range</p>

            <Tooltip title="Select a start and end date to filter data within a specific time period. Only data within this range will be displayed">
              <InfoCircleOutlined className="text-gray-500 text-[14px] cursor-pointer" />
            </Tooltip>
          </div>
          <RangePicker
            className="w-full h-[38px]"
            onChange={handleDateChange}
          />
        </div>
        <div className="border-t border-[#f0f0f0]">
          <div className="flex flex-end gap-2 p-6 flex-wrap">
            <AppButton
              width="82px"
              className="mr-0"
              variant="secondary"
              onClick={onCancel}
            >
              Clear All
            </AppButton>
            <AppButton width="82px" className="ml-0 mr-0">
              Filter
            </AppButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FilterInsightsModal;
