const FailedExtraction = ({ message }: { message?: string }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-4">
        <img
          src="/assets/images/failed-extraction.png"
          alt="failed extraction"
        />
        <p className="text-[14px] text-gray mt-[-50px]">
          {message || "Unable to preview extracted content."}
        </p>
      </div>
    </div>
  );
};

export default FailedExtraction;
