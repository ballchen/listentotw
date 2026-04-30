import { useEffect, useRef } from 'react';
import { tracks } from '../data/tracks';
import { playerStore, usePlayer } from '../state/playerStore';
import Picture from './Picture';

export default function AlbumPicker() {
  const { currentIndex, changing } = usePlayer();
  const listRef = useRef<HTMLUListElement | null>(null);

  // Roving tabindex: keep the active item visible
  useEffect(() => {
    const li = listRef.current?.children[currentIndex] as HTMLElement | undefined;
    li?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [currentIndex]);

  return (
    <nav
      aria-label="選擇唱片"
      className="relative w-full z-40
                 lg:absolute lg:inset-x-0 lg:top-[50px]"
    >
      <ul
        ref={listRef}
        role="listbox"
        aria-label="十首聲音"
        className="flex gap-4 sm:gap-8 lg:gap-12 px-4 sm:px-8 lg:px-12 py-4
                   overflow-x-auto snap-x snap-mandatory
                   [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
      >
        {tracks.map((t, i) => {
          const active = currentIndex === i;
          return (
            <li
              key={t.id}
              role="option"
              aria-selected={active}
              className="snap-center shrink-0"
            >
              <button
                type="button"
                disabled={changing}
                onClick={() => playerStore.setIndex(i)}
                aria-label={`切換到第 ${t.id} 首：${t.title}（${t.theme}）`}
                aria-current={active ? 'true' : undefined}
                className={`group relative block transition-transform duration-500 cursor-pointer
                            ${active ? 'scale-110' : 'hover:scale-105 focus-visible:scale-105'}
                            disabled:cursor-wait disabled:opacity-70
                            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white`}
              >
                <Picture
                  src={t.cover}
                  alt={`${t.title} 封面`}
                  loading="lazy"
                  className="w-[140px] h-[140px] sm:w-[170px] sm:h-[170px] lg:w-[200px] lg:h-[200px]
                             border-[6px] sm:border-[8px] lg:border-[10px] border-white
                             shadow-[-10px_10px_30px_rgba(0,0,0,0.5)] object-cover"
                />
                <span className="block text-center mt-2 text-xs sm:text-sm text-white/80 tracking-widest">
                  {t.title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Affordance arrows on touch — desktop has the disc visual instead */}
      <p className="lg:hidden text-center text-xs text-white/40 mt-1">
        ← 滑動切換唱片 →
      </p>
    </nav>
  );
}
