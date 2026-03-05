interface SectionLabelProps {
  step: string;
  label: string;
}

export default function SectionLabel({ step, label }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-2 mb-[14px]">
      <span
        className="text-[11px] tracking-[1.8px] uppercase whitespace-nowrap"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent1)" }}
      >
        {step} · {label}
      </span>
      <div
        className="flex-1 h-px"
        style={{ background: "linear-gradient(to right, rgba(108,99,255,0.3), transparent)" }}
      />
    </div>
  );
}
