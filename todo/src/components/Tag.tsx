import { getTagColors } from "../helpers/tagColor";

export function Tag({ label }: { label: string }) {
  const { bg, border, text, hoverBg, ring } = getTagColors(label);
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium
                 transition-colors focus:outline-none focus:ring-2"
      style={{
        backgroundColor: bg,
        borderColor: border,
        color: text,
        // subtle focus ring w/ inline color (Tailwind can't generate dynamic classes)
        boxShadow: `0 0 0 0px transparent`,
      }}
      onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px ${ring}`)}
      onBlur={(e) => (e.currentTarget.style.boxShadow = '0 0 0 0px transparent')}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverBg)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = bg)}
      role="note"
      aria-label={`tag ${label}`}
      tabIndex={0}
      title={`#${label}`}
    >
      <span aria-hidden>#</span>
      {label}
    </span>
  );
}
