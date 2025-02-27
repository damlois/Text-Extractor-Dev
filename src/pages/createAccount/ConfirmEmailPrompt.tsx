import { useNavigate } from "react-router-dom";

const ConfirmEmailPrompt = ({ emailAddress }: { emailAddress: string }) => {
  const navigate = useNavigate();

  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/images/background.png')" }}
    >
      <div className="bg-white lg:py-[135px] lg:px-[208px] md:p-12 p-[8px] rounded-[20px] max-w-[90%] text-center border border-[#F0F0F0]">
        <img
          src="/assets/images/mailbox.png"
          alt="Email Icon"
          className="w-[74px] mb-6 mx-auto"
        />
        <h2 className="text-2xl font-medium mb-6 text-dark-gray">
          Check your email
        </h2>
        <p className="text-[#373737]">
          We've sent a confirmation link to <br />
          <span className="font-medium text-dark-gray">{emailAddress}</span>
        </p>
        <p className="text-[#373737] mb-8 mt-6">
          Please check your inbox and click the link <br /> to verify your
          account.
        </p>
        <p className="text-[#4E4E4E] font-medium mb-4">
          Didn’t receive the mail?
        </p>
        <button
          className="text-deep-blue font-medium underline cursor-pointer"
          onClick={() => navigate("/users")}
        >
          Click to resend
        </button>
      </div>
    </div>
  );
};

export default ConfirmEmailPrompt;
