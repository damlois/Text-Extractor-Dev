interface InsightSuggestionRowProps {
  suggestions: string[];
  setInsightQuery: (query: string) => void;
}

const InsightSuggestionRow = ({
  suggestions,
  setInsightQuery,
}: InsightSuggestionRowProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion) => (
        <div
          className="bg-[#F0F0F0] rounded-[999px] py-1 px-2 text-[12px] font-normal text-dark-gray cursor-pointer"
          onClick={() => setInsightQuery(suggestion)}
        >
          {suggestion}
        </div>
      ))}
    </div>
  );
};

export default InsightSuggestionRow;
