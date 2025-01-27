import AppButton from "../../../../components/AppButton";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import EmailConfigTemplate from "./templates/EmailConfigTemplate";
import { showNotification } from "../../../../utils/notification";

const ConnectEmail = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full relative">
      <div
        className="mt-[10px] text-deep-blue px-[0] cursor-pointer absolute"
        onClick={() => navigate("../data-source/create")}
      >
        <ArrowLeftOutlined className="mr-6" /> Back
      </div>
      <div className="lg:w-5/12 md:w-7/12 sm:w-10/12 mx-auto relative">
        <h2 className="text-dark-gray text-[24px] mb-6 text-center">
          Add Your Email Credentials
        </h2>
        <EmailConfigTemplate
          onSuccessCallback={() => {
            showNotification("success", "Email connected Successfully");
            navigate("../data-source/field-extraction-setup");
          }}
          buttonComponent={
            <AppButton htmlType="submit">Connect Email</AppButton>
          }
        />
      </div>
    </div>
  );
};

export default ConnectEmail;
