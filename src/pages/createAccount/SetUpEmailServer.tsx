import { useNavigate } from "react-router-dom";
import AppButton from "../../components/AppButton";
import EmailConfigTemplate from "../../components/EmailConfigTemplate";
import { showNotification } from "../../utils/notification";

const SetUpEmailServer = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full sm:w-[90%] md:w-[27%] text-center">
        <img src="/assets/images/logo.png" className="mb-6 w-fit mx-auto" />
        <p className="text-dark-gray font-medium text-[24px] mb-2">
          Welcome to InterprAIs
        </p>
        <p className="text-gray mb-6">
          Providing your SMTP server settings for email configuration.
        </p>
        <EmailConfigTemplate
          onSuccessCallback={() => {
            showNotification("success", "Email connected Successfully");
            navigate("../data-source/field-extraction-setup");
          }}
          buttonComponent={({ loading }) => (
            <AppButton htmlType="submit" loading={loading}>
              Continue
            </AppButton>
          )}
        />
      </div>
    </div>
  );
};

export default SetUpEmailServer;
