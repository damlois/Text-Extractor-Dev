import { Modal } from "antd";
import AppSelect from "../../../../../../../../components/AppSelect";
import ToggleButton from "../../../../../../../../components/ToggleButton";
import { useState, useEffect } from "react";
import { ExtractionHistoryFilter } from "../../../../../../../../types";
import DateRangePicker from "../../../../../../../../components/DateRangePicker";
import AppButton from "../../../../../../../../components/AppButton";

interface FilterHistoryModalProps {
  open: boolean;
  onCancel: () => void;
  onApply: (filters: ExtractionHistoryFilter) => void;
  onClear: () => void;
  initialFilters: ExtractionHistoryFilter | null;
  senders: string[];
}

const FilterHistoryModal = ({
  open,
  onCancel,
  onApply,
  onClear,
  initialFilters,
  senders,
}: FilterHistoryModalProps) => {
  const [filters, setFilters] = useState<ExtractionHistoryFilter | null>(
    initialFilters
  );

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleClear = () => {
    setFilters(null);
    onClear();
  };

  const handleApply = () => {
    if (filters) {
      onApply(filters);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      className="app-modal"
      style={{ minWidth: "30%" }}
    >
      <div>
        <div className="text-[20px] font-bold p-6 border-b border-0.5 border-[#cfc1c1]">
          Filter
        </div>
        <div className="p-6">
          <AppSelect
            label="Sender"
            placeholder="Select multiple senders"
            options={senders}
            onSelectionChange={(selected: string[] | string) => {
              setFilters({ ...filters, senders: selected as string[] });
            }}
            className="mb-4"
            multiple
          />
          <div className="mb-4">
            <p className="text-dark-gray font-bold text-[14.5px] mb-2">
              Status
            </p>
            <ToggleButton
              options={["Successful", "Failed"]}
              onSelect={(selected) =>
                setFilters({ ...filters, status: selected })
              }
            />
          </div>
          <DateRangePicker
            onDateChange={([dateFrom, dateTo]) => {
              setFilters({
                ...filters,
                dateFrom: dateFrom?.format("DD-MM-YYYY"),
                dateTo: dateTo?.format("DD-MM-YYYY"),
              });
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
            <AppButton
              width="82px"
              className="ml-0 mr-0"
              onClick={handleApply}
              disabled={!filters}
            >
              Filter
            </AppButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FilterHistoryModal;
