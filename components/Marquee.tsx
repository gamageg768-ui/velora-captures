type Props = { items: string[]; separator?: string; label?: string };

export default function Marquee({ items, separator = '✳', label = 'Disciplines and services' }: Props) {
  return (
    <div
      role="marquee"
      aria-label={label}
      className="relative w-full overflow-hidden border-y border-line py-5 select-none"
    >
      <div className="flex w-max animate-marquee whitespace-nowrap will-change-transform" aria-hidden="true">
        {[...items, ...items].map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center">
            <span className="px-8 font-display text-2xl font-light italic text-ink/85 md:text-4xl">
              {item}
            </span>
            <span className="text-accent/70">{separator}</span>
          </span>
        ))}
      </div>
      <span className="sr-only">{items.join(', ')}</span>
    </div>
  );
}
