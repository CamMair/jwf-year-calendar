const Year = (props: { className?: string; onClick?: (year: number) => unknown; year: number }) => {
  return (
    <button
      className={`${props.className || ''} font-bold h-11 text-2xl w-full`}
      onClick={() => (props.onClick ? props.onClick(props.year) : null)}
    >
      {props.year}
    </button>
  );
};
export default Year;
