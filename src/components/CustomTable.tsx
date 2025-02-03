import React from "react";
import { Table } from "antd";
import type { ColumnType } from "antd/es/table";

export interface Column extends Omit<ColumnType<any>, "dataIndex"> {
  dataIndex?: string | string[];
}

interface CustomTableProps {
  columns: Column[];
  dataSource: any[];
  rowKey: string | ((record: any) => string);
  bordered?: boolean;
  striped?: boolean;
  className?: string;
  pagination?: { pageSize: number } | false;
}

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  dataSource,
  rowKey,
  bordered,
  striped,
  className,
  pagination,
}) => {
  const handleObjectData = (value: any) => {
    if (value === null || value === undefined) {
      return "-";
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return value;
  };

  const getNestedValue = (record: any, dataIndex: string | string[]) => {
    if (typeof dataIndex === "string") {
      return record[dataIndex];
    }

    return dataIndex.reduce((obj, key) => obj?.[key], record);
  };

  return (
    <Table
      columns={columns.map((col) => ({
        ...col,
        render: (value: any, record: any, rowIndex: number) =>
          col.render
            ? col.render(value, record, rowIndex)
            : col.dataIndex
            ? handleObjectData(getNestedValue(record, col.dataIndex))
            : value,
      }))}
      dataSource={dataSource}
      rowKey={rowKey}
      pagination={pagination}
      bordered={bordered}
      className={`${striped ? "striped" : ""} ${className || ""}`}
    />
  );
};

export default CustomTable;
