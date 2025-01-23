import { useNavigate } from "react-router-dom";

const CreateDataSource = () => {
  const navigate = useNavigate();

  return (
    <div>
      <>
        <div className="w-full text-center">
          <h2 className="text-dark-gray text-[24px] mb-1">
            Select Your Invoice Source
          </h2>
          <p className="text-gray font-normal text-sm">
            Choose where to access, configure and extract your invoices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6 gap-6">
          <div className="border border-[#D9D9D9] rounded-lg px-2 py-8 text-center cursor-pointer">
            <div className="flex gap-4 mx-auto justify-center mb-4 flex-wrap">
              <img
                src="/assets/icons/google-drive.svg"
                alt="google drive icon"
              />
              <img src="/assets/icons/cloud.svg" alt="cloud icon" />
              <img src="/assets/icons/dropbox.svg" alt="dropbox icon" />
            </div>
            <p>
              <b>
                <u>Browse and Upload</u>
              </b>{" "}
              <span className="text-[#667085]"></span>from cloud storage
            </p>
          </div>
          <div
            className="border border-[#D9D9D9] rounded-lg px-2 py-8 text-center cursor-pointer"
            onClick={() => navigate("../data-source/connect-email")}
          >
            <img
              src="/assets/icons/mail.svg"
              className="mb-4 mx-auto"
              alt="mail icon"
            />
            <p>
              <b>
                <u>Click</u>
              </b>{" "}
              <span className="text-[#667085]"></span>to connect email address
            </p>
          </div>
          <div className="border border-[#D9D9D9] rounded-lg px-2 py-8 text-center cursor-pointer">
            <img
              src="/assets/icons/folder.svg"
              className="mb-4 mx-auto"
              alt="folder icon"
            />
            <p>
              <b>
                <u>Browse and Upload</u>
              </b>{" "}
              <span className="text-[#667085]"></span>from PC
            </p>
          </div>
        </div>

        <div className="border-b-[0.5px] border-[#0000000F] mt-10 w-full"></div>
      </>
    </div>
  );
};

export default CreateDataSource;
