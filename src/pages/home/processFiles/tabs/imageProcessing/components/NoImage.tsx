import { Image } from "antd";

const NoImage = () => {
  return (
    <div
      style={{
        height: "calc(100vh - 240px)",
        color: "rgba(0, 0, 0, 0.25)",
      }}
      className="flex items-center mt-[80px] flex-col gap-2"
    >
      <div style={{ width: "60px", height: "48px" }}>
        <Image src="/assets/icons/inbox.png" alt="inbox icon" />
      </div>
      <p className="font-inter text-[14px]">
        Oops! Looks like we couldn't find any image
      </p>
    </div>
  );
};

export default NoImage;
