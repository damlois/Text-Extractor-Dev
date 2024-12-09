import { Card, Image, Pagination } from "antd";
import { useEffect, useState } from "react";
import AppInput from "../../../../../../components/AppInput";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import { PageT } from "../types";
import ImageModal from "./ImageModal";
import NoImage from "./NoImage";
import { useGetProjectImages } from "../../../../../../hooks/useFileProcessor";
import { useFileProcessor } from "../../../../../../context/FileProcessorContext";

const DisplayImages: React.FC = () => {
  const [images, setImages] = useState<string[]>(["yoo", "yoo", "yoie", "ehk"]);
  const [nameToSearch, setNameToSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const { getProjectImages } = useGetProjectImages();
  const fetchImages = async () => {
    console.log(await getProjectImages());
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const paginatedResults = images.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleImageSelection = (imgUrl: string) => {
    setIsModalOpen(true);
    setSelectedImage(imgUrl);
  };

  return (
    <>
      {images.length ? (
        <div>
          <h5 className="text-dark-gray font-medium text-[16px] mb-1">
            Extract visual insights with Intelligent Image Analysis
          </h5>
          <p className="text-[14px]">Select an image to analyze.</p>
          <AppInput
            placeholder="search by document name"
            value={nameToSearch}
            onChange={(e) => setNameToSearch(e.target.value)}
            className="mb-6 sm: w-full md:w-7/12"
            rightIcon={<SearchOutlined className="text-[14px] text-gray" />}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedResults.map((iamge, index) => {
              return (
                <Card
                  key={index}
                  className="min-w-[200px] border-1 border-[#F0F0F0] rounded-none cursor-pointer"
                  bodyStyle={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: 0,
                  }}
                >
                  <div
                    className="w-full h-[12em] bg-[#F0F0F0]"
                    style={{ width: "100%" }}
                  >
                    <div className="relative group cursor-pointer !h-full">
                      <img
                        src="/assets/images/test_image.jpeg"
                        className="!h-full !w-full object-cover"
                        style={{ width: "100%" }}
                        alt="an image"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span
                          className="text-white text-lg font-semibold"
                          onClick={() =>
                            handleImageSelection(
                              "/assets/images/test_image.jpeg"
                            )
                          }
                        >
                          Click to preview
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 font-inter text-sm border-b border-1 w-full border-[#F0F0F0]">
                    <p className="text-dark-gray font-medium mb-2">
                      Source: Consumer Credit 1 ...
                    </p>
                    <p className="text-gray">Page 1</p>
                  </div>

                  <div
                    className="p-3 cursor-pointer w-full flex justify-center hover:text-white hover:bg-deep-blue"
                    // onClick={handleDownload}
                  >
                    <DownloadOutlined className="text-[20px] text-gray-600" />
                  </div>
                </Card>
              );
            })}
            {images.length > 8 && (
              <div className="mt-6 w-full flex">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={images.length}
                  onChange={(page, size) => {
                    setCurrentPage(page);
                    setPageSize(size);
                  }}
                />
              </div>
            )}
            <ImageModal
              isModalOpen={isModalOpen}
              imgSrc={selectedImage}
              onCancel={() => setIsModalOpen(false)}
              // setPage={setPage}
            />
          </div>
        </div>
      ) : (
        <NoImage />
      )}
    </>
  );
};

export default DisplayImages;
