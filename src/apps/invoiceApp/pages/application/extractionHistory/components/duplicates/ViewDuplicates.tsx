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

  const { duplicateMapByFileHash, setDuplicatesMapByFileHash } =
    useInvoiceProcessor();

  const navigate = useNavigate();

  const toggleActionModal = (type: ModalType) => {
    setActionModal((prev) => ({
      open: !prev?.open,
      type,
    }));
  };

  const checkModalDisplay = (type: ModalType) =>
    actionModal?.open && actionModal.type === type;

  const checkFullySelectedGroups = () => {
    for (const [hash, selectedIds] of Object.entries(selectedInvoiceIds)) {
      const totalInvoices =
        duplicateMapByFileHash?.[hash]?.invoices?.length || 0;

      if (totalInvoices > 0 && selectedIds.length === totalInvoices) {
        toggleActionModal("Not-Allowed");
        return;
      }
    }

    toggleActionModal("Archive");
  };

  const pageRefresh = () => {
    setDuplicatesMapByFileHash((prev) => {
      const updatedMap = { ...prev };

      Object.keys(selectedInvoiceIds).forEach((hash) => {
        if (updatedMap[hash]) {
          updatedMap[hash].invoices = updatedMap[hash].invoices.filter(
            (invoice) => !selectedInvoiceIds[hash].includes(invoice.id)
          );

          if (updatedMap[hash].invoices.length <= 1) {
            delete updatedMap[hash];
          }
        }
      });

      return updatedMap;
    });

    setSelectedInvoiceIds({});
  };

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
                  disabled={Object.keys(selectedInvoiceIds).length === 0}
                />
                <AppButton
                  children="Archive Duplicate"
                  className="!w-fit"
                  onClick={checkFullySelectedGroups}
                  disabled={Object.keys(selectedInvoiceIds).length === 0}
                />
              </div>
            </div>

            <DuplicatesTable
              selectedInvoiceIds={selectedInvoiceIds}
              setSelectedInvoiceIds={setSelectedInvoiceIds}
            />
          </div>
        ) : (
          <div className="w-full h-screen flex justify-center mt-40">
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
        selectedInvoiceIds={selectedInvoiceIds}
        pageRefresh={pageRefresh}
      />
      <ArchiveDuplicatesModal
        open={checkModalDisplay("Archive")}
        onCancel={() => toggleActionModal("Archive")}
        selectedInvoiceIds={selectedInvoiceIds}
        pageRefresh={pageRefresh}
      />
    </div>
  );
};

export default ViewDuplicates;
