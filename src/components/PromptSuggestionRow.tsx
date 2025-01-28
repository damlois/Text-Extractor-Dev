interface PrmoptSuggestionRowProps {
  promptSuggestions: string[];
  setPrompt: (prompt: string) => void;
}

const PrmoptSuggestionRow = ({
  promptSuggestions,
  setPrompt,
}: PrmoptSuggestionRowProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {promptSuggestions.map((suggestion) => (
        <div
          className="bg-[#F0F0F0] rounded-[999px] py-1 px-2 text-[12px] font-normal text-dark-gray cursor-pointer"
          onClick={() => setPrompt(suggestion)}
        >
          {suggestion}
        </div>
      ))}
    </div>
  );
};

export default PrmoptSuggestionRow;
