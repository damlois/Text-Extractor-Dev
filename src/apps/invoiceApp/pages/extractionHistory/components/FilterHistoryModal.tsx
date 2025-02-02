import { Modal } from "antd";
import AppButton from "../../../../../components/AppButton";
import AppSelect from "../../../../../components/AppSelect";
import ToggleButton from "../../../../../components/ToggleButton";
import { useState } from "react";
import { ExtractionHistoryFilter } from "../../../../../types";
import DateRangePicker from "../../../../../components/DateRangePicker";

interface FilterHistoryModalProps {
  open: boolean;
  onCancel: () => void;
}

const FilterHistoryModal = ({ open, onCancel }: FilterHistoryModalProps) => {
  const [filters, setFilters] = useState<ExtractionHistoryFilter | null>(null);

  const sources = [
    "loisade@mail.com",
    "Blesso@mail.com",
    "tao@mail.com",
    "modupsy@mail.com",
  ];

  console.log(filters, "filters");

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
            title="Source"
            placeholder="Select multiple sources"
            options={sources}
            onSelectionChange={(selected: string[]) => {
              setFilters({ ...filters, sources: selected });
            }}
            className="mb-4"
          />
          <AppSelect
            title="Sender"
            placeholder="Select multiple senders"
            options={sources}
            onSelectionChange={(selected: string[]) => {
              setFilters({ ...filters, senders: selected });
            }}
            className="mb-4"
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

export default FilterHistoryModal;
