interface Props {
  label?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
  labelVariant?: "blue" | "gold";
}

export default function SectionHeader({
  label,
  title,
  highlight,
  description,
  align = "left",
  theme = "light",
  labelVariant = "blue",
}: Props) {
  const isDark = theme === "dark";
  const alignment = align === "center" ? "mx-auto text-center items-center" : "text-left items-start";
  const titleParts = highlight ? title.split(highlight) : [title];

  return (
    <div className={`max-w-2xl flex flex-col ${alignment}`}>
      {label && (
        <span
          className={`mb-3 text-xs font-bold uppercase tracking-[0.18em] ${
            labelVariant === "gold"
              ? "text-[#F4C430]"
              : isDark
                ? "text-[var(--navy-100)]"
                : "text-[var(--navy)]"
          }`}
        >
          {label}
        </span>
      )}
      <h2 className={`font-heading text-3xl sm:text-4xl font-bold leading-tight ${isDark ? "text-white" : "text-[var(--ink)]"}`}>
        {titleParts.map((part, index) => (
          <span key={`${part}-${index}`}>
            {part}
            {highlight && index < titleParts.length - 1 && (
              <span className={isDark ? "text-[#F4C430]" : "text-[var(--navy)]"}>{highlight}</span>
            )}
          </span>
        ))}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed ${isDark ? "text-white/70" : "text-[var(--ink-muted)]"}`}>
          {description}
        </p>
      )}
    </div>
  );
}