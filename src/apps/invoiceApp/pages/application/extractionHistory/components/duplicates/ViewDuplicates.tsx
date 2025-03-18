import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AppButton from "../../../../../../../components/AppButton";
import { useState } from "react";
import NotAllowedModal from "./NotAllowedModal";
import IgnoreDuplicatesModal from "./IgnoreDuplicatesModal";
import ArchiveDuplicatesModal from "./ArchiveDuplicatesModal";
import { ModalType } from "../../types";
import DuplicatesTable from "./DuplicatesTable";
import { useInvoiceProcessor } from "../../../../../context/InvoiceProcessorContext";

const ViewDuplicates = () => {
  const [actionModal, setActionModal] = useState<
    { open: boolean; type: ModalType } | undefined
  >();

  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<
    Record<string, string[]>
  >({});

  const navigate = useNavigate();

  const toggleActionModal = (type: ModalType) => {
    setActionModal((prev) => ({
      open: !prev?.open || prev.type !== type,
      type,
    }));
  };

  const checkModalDisplay = (type: ModalType) =>
    actionModal?.open && actionModal.type === type;

  const { duplicateMapByFileHash } = useInvoiceProcessor();

  return (
    <div>
      <div
        className="text-deep-blue px-[0] cursor-pointer"
        onClick={() =>
          navigate("../extraction-history", {
            state: { fromDuplicatesPage: true },
          })
        }
      >
        <ArrowLeftOutlined className="mr-6" /> Back
      </div>

      <>
        {Object.keys(duplicateMapByFileHash).length > 0 ? (
          <div>
            <div className="flex flex-wrap mt-5 mb-5 justify-between gap-5">
              <div className="flex flex-col gap-1">
                <p className="font-medium text-[16px]">
                  List of Duplicate Invoices Found
                </p>
                <p>
                  Here are invoices with duplicates. You can review and select
                  to delete them as needed.
                </p>
              </div>
              <div className="flex gap-4 flex-wrap ml-auto">
                <AppButton
                  children="Ignore"
                  variant="secondary"
                  className="!w-fit"
                  onClick={() => toggleActionModal("Ignore")}
                />
                <AppButton
                  children="Archive Duplicate"
                  className="!w-fit"
                  onClick={() => toggleActionModal("Archive")}
                />
              </div>
            </div>

            <DuplicatesTable
              selectedInvoiceIds={selectedInvoiceIds}
              setSelectedInvoiceIds={setSelectedInvoiceIds}
            />
          </div>
        ) : (
          <div className="w-full h-screen flex justify-center mt-80">
            There are no duplicate invoices
          </div>
        )}
      </>
      <NotAllowedModal
        open={checkModalDisplay("Not-Allowed")}
        onCancel={() => toggleActionModal("Not-Allowed")}
      />
      <IgnoreDuplicatesModal
        open={checkModalDisplay("Ignore")}
        onCancel={() => toggleActionModal("Ignore")}
      />
      <ArchiveDuplicatesModal
        open={checkModalDisplay("Archive")}
        onCancel={() => toggleActionModal("Archive")}
      />
    </div>
  );
};

export default ViewDuplicates;
