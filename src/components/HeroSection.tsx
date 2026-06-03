import { Animate } from "./Animate";

interface HeroSectionProps {
  tag: string;
  title: string;
  subtitle: string;
}

export function HeroSection({ tag, title, subtitle }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-white via-emerald-50/40 to-white pt-16 pb-12 sm:pt-20 sm:pb-14">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <Animate type="fadeUp">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">{tag}</p>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 mb-3">{title}</h1>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">{subtitle}</p>
        </Animate>
      </div>
    </section>
  );
}
