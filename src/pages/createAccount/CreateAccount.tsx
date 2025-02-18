import { useNavigate } from "react-router-dom";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";

const CreateAccount = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full sm:w-[90%] md:w-[27%] text-center">
        <img src="/assets/images/logo.png" className="mb-6 w-fit mx-auto" />
        <p className="text-dark-gray font-medium text-[24px] mb-2">
          Welcome to InterprAIs
        </p>
        <p className="text-gray">
          Set up your account by providing your first name and last name.
        </p>
        <div className="mt-6">
          <AppInput
            type="text"
            name="firstName"
            label="First Name"
            placeholder="Enter first name"
          />
        </div>
        <div className="mt-6">
          <AppInput
            type="text"
            name="lastName"
            label="Last Name"
            placeholder="Enter last name"
          />
        </div>
        <AppButton
          className="mt-6"
          onClick={() => navigate("/configure-email")}
          children="Continue"
        />
      </div>
    </div>
  );
};

export default CreateAccount;
