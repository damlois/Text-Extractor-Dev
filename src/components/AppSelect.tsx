import React, { useMemo, useState } from "react";
import { Select, Spin, Tooltip } from "antd";
import debounce from "lodash/debounce";
import { InfoCircleOutlined } from "@ant-design/icons";

interface AppSelectProps {
  options: string[];
  onSelectionChange: (selected: string[]) => void;
  tooltipText?: string;
  title?: string;
  placeholder?: string;
  className: string;
}

const AppSelect: React.FC<AppSelectProps> = ({
  options,
  onSelectionChange,
  tooltipText,
  title,
  placeholder,
  className,
  ...props
}) => {
  const [fetching, setFetching] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const debounceFilter = useMemo(() => {
    return debounce((search: string) => {
      setFetching(true);
      setTimeout(() => {
        setFilteredOptions(
          options.filter((option) =>
            option.toLowerCase().includes(search.toLowerCase())
          )
        );
        setFetching(false);
      }, 500);
    }, 800);
  }, [options]);

  const handleChange = (newValue: string[] | string) => {
    const updatedValues = Array.isArray(newValue) ? newValue : [newValue];
    setSelectedValues(updatedValues);
    onSelectionChange(updatedValues);
  };

  return (
    <div className={className}>
      <div className={`flex items-center gap-2 mb-2 w-full`}>
        <p className="text-dark-gray font-normal text-[14px]">{title}</p>
        {tooltipText && (
          <Tooltip title={tooltipText}>
            <InfoCircleOutlined className="text-gray-500 text-[14px] cursor-pointer" />
          </Tooltip>
        )}
      </div>
      <Select
        mode="multiple"
        filterOption={false}
        onSearch={debounceFilter}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        {...props}
        value={selectedValues}
        onChange={handleChange}
        options={filteredOptions.map((option) => ({
          label: option,
          value: option,
        }))}
        placeholder={placeholder}
        className="w-full min-h-[39px]"
      />
    </div>
  );
};

export default AppSelect;
