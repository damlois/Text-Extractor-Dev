import { Modal } from "antd";
import AppButton from "../../../../components/AppButton";
import DateRangePicker from "../../../../components/DateRangePicker";

interface FilterInsightsModalProps {
  open: boolean;
  onCancel: () => void;
  onFilter: (dateFrom?: string, dateTo?: string) => void;
}

const FilterInsightsModal = ({
  open,
  onCancel,
  onFilter,
}: FilterInsightsModalProps) => {
  const handleDateChange = (dates: any) => {
    if (dates) {
      const [dateFrom, dateTo] = dates;
      onFilter(dateFrom?.format("YYYY-MM-DD"), dateTo?.format("YYYY-MM-DD"));
    } else {
      onFilter();
    }
    onCancel();
  };

  const handleClear = () => {
    onFilter();
    onCancel();
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
          <DateRangePicker
            onDateChange={(dates) => {
              handleDateChange(dates);
            }}
          />
        </div>
        <div className="border-t border-[#f0f0f0]">
          <div className="flex flex-end gap-2 p-6 flex-wrap">
            <AppButton
              width="82px"
              className="mr-0"
              variant="secondary"
              onClick={handleClear}
            >
              Clear All
            </AppButton>
            <AppButton width="82px" className="ml-0 mr-0" onClick={onFilter}>
              Filter
            </AppButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FilterInsightsModal;
