export function LegendHeader(props: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 h-4 text-xs leading-4 font-normal">{props.label}</div>
      <div className="h-5 text-base leading-5 font-semibold">{props.value}</div>
    </div>
  );
}
