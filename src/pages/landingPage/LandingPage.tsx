import AppButton from "../../components/AppButton";

const LandingPage = () => {
  return (
    <main className="flex flex-col items-center justify-center text-center text-white mt-20 font-montserrat">
      <h1 className="text-5xl font-extrabold mb-4">
        Effortless Data Extraction,
      </h1>
      <h2 className="text-4xl font-bold mb-4">Maximum Efficiency.</h2>
      <p className="text-lg mb-8">
        Extract text, images, and tables with precision, speed, and accuracy.
      </p>
      <AppButton text="Try it out" width= "182px" />
    </main>
  );
};

export default LandingPage;
