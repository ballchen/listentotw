import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { tracks } from '../data/tracks';
import { usePlayer } from '../state/playerStore';

gsap.registerPlugin(ScrollTrigger);

type Props = { onBack: () => void };

export default function ScrollStory({ onBack }: Props) {
  const { currentIndex } = usePlayer();
  const track = tracks[currentIndex]!;
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('[data-panel]');
      panels.forEach((panel) => {
        const photo = panel.querySelector<HTMLElement>('[data-photo]');
        const text = panel.querySelector<HTMLElement>('[data-text]');
        if (photo) {
          gsap.fromTo(
            photo,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: panel,
                start: 'top 80%',
                end: 'bottom 60%',
                scrub: 0.4,
              },
            },
          );
        }
        if (text) {
          gsap.fromTo(
            text,
            { opacity: 0, y: 80 },
            {
              opacity: 1,
              y: 0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: panel,
                start: 'top 70%',
                end: 'center 50%',
                scrub: 0.6,
              },
            },
          );
        }
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [currentIndex]);

  return (
    <div ref={rootRef} className="relative w-full bg-black text-white">
      <button
        type="button"
        onClick={onBack}
        className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur text-sm cursor-pointer"
      >
        ← 回唱片機
      </button>

      <Panel
        photo="/img/first1.png"
        text={track.intro}
        align="center"
        eyebrow={track.title}
      />
      <Panel photo={track.photos.p1} text={track.scene} align="left" />
      <Panel photo={track.photos.p2} text={track.detail} align="left" />
      <Panel photo={track.photos.p3} text={track.closing} align="left" />
      <Panel
        photo="/img/first2.png"
        text={track.tagline}
        align="center"
        big
      />
    </div>
  );
}

function Panel({
  photo, text, align, eyebrow, big = false,
}: {
  photo: string;
  text: string;
  align: 'left' | 'center';
  eyebrow?: string;
  big?: boolean;
}) {
  return (
    <section
      data-panel
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      <img
        data-photo
        src={photo}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-0"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div
        data-text
        className={`relative z-10 max-w-2xl px-6
                    ${align === 'center' ? 'text-center' : 'text-left ml-[7%]'}
                    ${big ? 'text-2xl md:text-4xl' : 'text-lg md:text-2xl'}`}
        style={{ textShadow: '2px 2px 3px #000', lineHeight: 1.8 }}
      >
        {eyebrow && (
          <p className="mb-4 text-sm tracking-[0.4em] text-white/70 uppercase">
            {eyebrow}
          </p>
        )}
        {text.split('\n').map((line, i) => (
          <span key={i} className="block">
            {line || ' '}
          </span>
        ))}
      </div>
    </section>
  );
}
