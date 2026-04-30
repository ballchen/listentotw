import Picture from './Picture';

type Props = {
  cover: string;
  spinning: boolean;
  changing: boolean;
  /** desktop / mobile size class wrapper */
  className?: string;
};

/**
 * Pure-SVG/CSS vinyl disc + cover label.
 * Replaces the legacy 1.5 MB record.png with ~0 KB of vector.
 */
export default function VinylDisc({ cover, spinning, changing, className }: Props) {
  const animClass =
    `${spinning && !changing ? 'disc-spin' : ''} ${changing ? 'disc-change' : ''}`.trim();

  return (
    <div className={`relative ${className ?? ''}`}>
      {/* Vinyl base: radial grooves rendered as repeating-radial-gradient */}
      <div
        className={`absolute inset-0 rounded-full ${animClass}`}
        style={{
          background:
            'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0d0d0d 40%, #1a1a1a 41%, #0d0d0d 100%)',
          boxShadow:
            'inset 0 0 0 2px #2a2a2a, 0 8px 24px rgba(0,0,0,0.6)',
        }}
        aria-hidden="true"
      >
        {/* Grooves */}
        <div
          className="absolute inset-[3%] rounded-full opacity-60"
          style={{
            background:
              'repeating-radial-gradient(circle at 50% 50%, transparent 0 1.4%, rgba(255,255,255,0.04) 1.4% 1.5%)',
          }}
        />
        {/* Light highlight */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.08), transparent 45%)',
          }}
        />
      </div>

      {/* Cover label — square art clipped to a circle in the middle */}
      <div
        className={`absolute left-1/2 top-1/2 w-[42%] h-[42%] -translate-x-1/2 -translate-y-1/2
                    rounded-full overflow-hidden ring-4 ring-black/40 ${animClass}`}
      >
        <Picture
          src={cover}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
        {/* Center spindle */}
        <div
          className="absolute left-1/2 top-1/2 w-[6%] h-[6%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
