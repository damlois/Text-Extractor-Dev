import React from "react";
import { DatePicker, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

interface DateRangePickerProps {
  title?: string;
  tooltipText?: string;
  onDateChange: (dates: any) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  title = "Date Range",
  tooltipText = "Select a start and end date to filter data within a specific time period. Only data within this range will be displayed",
  onDateChange,
}) => {
  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <p className="text-dark-gray font-bold text-[14.5px]">{title}</p>
        {tooltipText && (
          <Tooltip title={tooltipText}>
            <InfoCircleOutlined className="text-gray-500 text-[14px] cursor-pointer" />
          </Tooltip>
        )}
      </div>
      <RangePicker
        className="w-full h-[38px]"
        onChange={(dates) => onDateChange(dates)}
      />
    </>
  );
};

export default DateRangePicker;
