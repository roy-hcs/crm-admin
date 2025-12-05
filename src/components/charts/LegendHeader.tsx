export function LegendHeader(props: { label: string; value: number }) {
  return (
    <div className="grid gap-2">
      <div className="text-muted-foreground text-sm leading-5 font-medium">{props.label}</div>
      <div className="text-card-foreground text-base leading-4 font-semibold">{props.value}</div>
    </div>
  );
}
