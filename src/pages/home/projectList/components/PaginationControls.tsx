import { Pagination } from "antd";

interface PaginationControlsProps {
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number, size: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  pageSize,
  total,
  onPageChange,
}) => {
  return (
    <>
      {total > pageSize ? (
        <div className="flex mt-6 w-full justify-end">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={onPageChange}
            showSizeChanger
            pageSizeOptions={["8", "12", "16", "20"]}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default PaginationControls;
