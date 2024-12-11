import { Card, Spin } from "antd";
import { useEffect, useState, useMemo, useCallback } from "react";
import AppInput from "../../../../../../components/AppInput";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import ImageModal from "./ImageModal";
import NoImage from "./NoImage";
import { useGetProjectImages } from "../../../../../../hooks/useFileProcessor";
import { useFileProcessor } from "../../../../../../context/FileProcessorContext";
import { ImageData } from "../../../../../../types";
import {
  base64ToBlob,
  downloadImageFromBlobUrl,
} from "../../../../../../utils";
import PaginationControls from "../../../../projectList/components/PaginationControls";

const DisplayImages: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const { getProjectImages } = useGetProjectImages();
  const { currentProject } = useFileProcessor();

  const fetchImages = async () => {
    setLoading(true);

    if (currentProject?.image_data?.length) {
      setImages(currentProject.image_data);
      setLoading(false);
    } else {
      const fetchedImages = await getProjectImages();
      if (fetchedImages.length) setImages(fetchedImages);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const filteredImages = useMemo(() => {
    if (!(searchTerm.trim().length > 0)) return images;
    return images.filter((image) =>
      image.file_name?.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }, [searchTerm, images]);

  console.log(images, "images");
  console.log(filteredImages, "filtered");
  console.log(searchTerm, "searchTerm");

  const handleSearch = (input: string) => {
    setSearchTerm(input);
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedResults = filteredImages.slice(
    startIndex,
    startIndex + pageSize
  );

  const handleImageSelection = (image: ImageData) => {
    const imageUrl = URL.createObjectURL(base64ToBlob(image.image_path));
    setSelectedImage({ ...image, image_path_url: imageUrl });
    setIsModalOpen(true);
  };

  return (
    <>
      {loading ? (
        <div className="flex w-full justify-center mt-[100px]">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {images.length > 0 ? (
            <>
              <div>
                <h5 className="text-dark-gray font-medium text-[16px] mb-1">
                  Extract visual insights with Intelligent Image Analysis
                </h5>
                <p className="text-[14px]">Select an image to analyze.</p>
                <AppInput
                  placeholder="Search by document name"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="mb-6 sm:w-full md:w-7/12"
                  rightIcon={
                    <SearchOutlined className="text-[14px] text-gray" />
                  }
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {paginatedResults.map((image, index) => {
                  const imageUrl = URL.createObjectURL(
                    base64ToBlob(image.image_path)
                  );
                  return (
                    <Card
                      key={index}
                      className="min-w-[200px] border-1 border-[#F0F0F0] rounded-none cursor-pointer flex-col"
                      bodyStyle={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: 0,
                        height: "100%",
                      }}
                    >
                      <div
                        className="w-full h-[12em] bg-[#F0F0F0]"
                        style={{ width: "100%" }}
                      >
                        <div className="relative group cursor-pointer !h-full">
                          <img
                            src={imageUrl}
                            className="!h-full !w-full object-cover"
                            alt="an image"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span
                              className="text-white text-lg font-semibold"
                              onClick={() => handleImageSelection(image)}
                            >
                              Click to preview
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 font-inter text-sm border-b border-1 w-full border-[#F0F0F0] flex-1">
                        <p className="text-dark-gray font-medium mb-2">
                          Source: {image.file_name}
                        </p>
                        <p className="text-gray">Page {image.page_number}</p>
                      </div>
                      <div
                        className="p-3 cursor-pointer w-full flex justify-center hover:text-white hover:bg-deep-blue"
                        onClick={() =>
                          downloadImageFromBlobUrl(
                            imageUrl,
                            `${image.file_name.split(".")[0]}_${
                              image.image_name
                            }`
                          )
                        }
                      >
                        <DownloadOutlined className="text-[20px] text-gray-600" />
                      </div>
                    </Card>
                  );
                })}
              </div>

              <PaginationControls
                currentPage={currentPage}
                pageSize={pageSize}
                total={filteredImages.length}
                onPageChange={(page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                }}
              />
            </>
          ) : (
            <NoImage />
          )}

          <ImageModal
            isModalOpen={isModalOpen}
            imageData={selectedImage}
            onCancel={() => setIsModalOpen(false)}
          />
        </>
      )}
    </>
  );
};

export default DisplayImages;
