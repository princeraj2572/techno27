import { ImageIcon } from "lucide-react";

// Reserved spaces for artwork. Pass `src` (e.g. "/images/events/robovation.jpg", files in /public)
// and the real picture replaces the placeholder — no layout change.

export function ImageSlot({
  src,
  alt,
  label = "Image",
  hint,
  ratio = "aspect-video",
  tone = "from-[#f5c928] to-[#c8421f]",
  className = "",
}: {
  src?: string;
  alt?: string;
  label?: string;
  hint?: string; // e.g. "1200 × 675"
  ratio?: string; // tailwind aspect class
  tone?: string; // tailwind gradient classes for the placeholder
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt ?? label} className={`${ratio} w-full object-cover ${className}`} />
    );
  }
  return (
    <div
      role="img"
      aria-label={`${label} placeholder`}
      className={`relative ${ratio} w-full overflow-hidden bg-gradient-to-br ${tone} ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(0,0,0,.35) 0 2px, transparent 2px 14px)" }}
      />
      <div className="absolute inset-3 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-black/50 bg-black/10 text-center text-black/70">
        <ImageIcon className="h-6 w-6" aria-hidden />
        <span className="text-xs font-bold uppercase tracking-[0.25em]">{label}</span>
        {hint && <span className="text-[10px] font-semibold uppercase tracking-widest opacity-70">{hint}</span>}
      </div>
    </div>
  );
}

export function LogoSlot({
  src,
  alt,
  label = "Logo",
  size = "h-24 w-24",
  shape = "rounded-xl",
  className = "",
}: {
  src?: string;
  alt?: string;
  label?: string;
  size?: string; // tailwind size classes
  shape?: string; // rounded-xl | rounded-full
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt ?? label} className={`${size} ${shape} object-contain ${className}`} />
    );
  }
  return (
    <div
      role="img"
      aria-label={`${label} placeholder`}
      className={`${size} ${shape} flex shrink-0 flex-col items-center justify-center gap-0.5 border-2 border-dashed border-current bg-black/10 text-center ${className}`}
    >
      <ImageIcon className="h-5 w-5 opacity-70" aria-hidden />
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">{label}</span>
    </div>
  );
}
