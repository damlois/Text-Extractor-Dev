interface LabelTagProps {
  name: string;
  id: number;
  handleRemove?: (id: number) => void;
  style?: React.CSSProperties;
}

const LabelTag = ({ name, id, handleRemove, style }: LabelTagProps) => {
  return (
    <div
      style={style}
      className="flex justify-between gap-2 py=[1px] px-2 border border-deep-blue rounded-sm text-deep-blue font-inter text-[12px] bg-light-blue"
    >
      <div>{name}</div>
      {handleRemove && (
        <div className="cursor-pointer" onClick={() => handleRemove(id)}>
          x
        </div>
      )}
    </div>
  );
};

export default LabelTag;
