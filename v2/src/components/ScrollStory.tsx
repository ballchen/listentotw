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
  const backBtnRef = useRef<HTMLButtonElement | null>(null);

  // Move focus to the back button when story opens (keyboard a11y)
  useEffect(() => {
    backBtnRef.current?.focus();
  }, []);

  // ESC closes story
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onBack]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('[data-panel]');
      panels.forEach((panel) => {
        const photo = panel.querySelector<HTMLElement>('[data-photo]');
        const text = panel.querySelector<HTMLElement>('[data-text]');
        if (reduce) {
          if (photo) gsap.set(photo, { opacity: 1, y: 0 });
          if (text) gsap.set(text, { opacity: 1, y: 0 });
          return;
        }
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
    <div
      ref={rootRef}
      className="relative w-full bg-black text-white"
      role="region"
      aria-label={`故事：${track.title}`}
    >
      <button
        ref={backBtnRef}
        type="button"
        onClick={onBack}
        className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-full
                   bg-white/10 hover:bg-white/20 backdrop-blur text-sm cursor-pointer
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        aria-label="回到唱片機（按 Esc 也可以）"
      >
        ← 回唱片機
      </button>

      <main id="story-main">
        <Panel
          photo="/img/first1.png"
          text={track.intro}
          align="center"
          eyebrow={`${String(track.id).padStart(2, '0')} · ${track.theme}`}
          title={track.title}
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
      </main>
    </div>
  );
}

function Panel({
  photo, text, align, eyebrow, title, big = false,
}: {
  photo: string;
  text: string;
  align: 'left' | 'center';
  eyebrow?: string;
  title?: string;
  big?: boolean;
}) {
  return (
    <article
      data-panel
      className="relative w-full min-h-[100svh] flex items-center justify-center overflow-hidden"
    >
      <img
        data-photo
        src={photo}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-0"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/50 sm:bg-black/40" aria-hidden="true" />
      <div
        data-text
        className={`relative z-10 w-full max-w-2xl px-6 sm:px-10
                    ${align === 'center' ? 'text-center mx-auto' : 'text-left lg:ml-[7%]'}`}
        style={{ textShadow: '2px 2px 3px #000' }}
      >
        {eyebrow && (
          <p className="mb-3 text-xs sm:text-sm tracking-[0.4em] text-white/70 uppercase">
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="mb-6 text-3xl sm:text-4xl font-medium">{title}</h2>
        )}
        <p
          className={`${big
            ? 'text-xl sm:text-2xl lg:text-4xl'
            : 'text-base sm:text-lg lg:text-2xl'} leading-loose whitespace-pre-line`}
        >
          {text}
        </p>
      </div>
    </article>
  );
}
