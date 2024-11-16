interface LabelTagProps {
  name: string;
  id: number;
  handleRemove: (id: number) => void;
}

const LabelTag = ({ name, id, handleRemove }: LabelTagProps) => {
  return (
    <div className="flex justify-between gap-2 py=[1px] px-2 border border-deep-blue rounded-sm text-deep-blue font-inter text-[12px] bg-light-blue">
      <div>{name}</div>
      <div className="cursor-pointer" onClick={() => handleRemove(id)}>
        x
      </div>
    </div>
  );
};

export default LabelTag;
