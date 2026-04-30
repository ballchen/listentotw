import { tracks } from '../data/tracks';
import { playerStore, usePlayer } from '../state/playerStore';

export default function AlbumPicker() {
  const { currentIndex, changing } = usePlayer();
  return (
    <div
      className="absolute inset-x-0 top-[50px] z-40
                 max-lg:static max-lg:mt-6 max-lg:px-2"
      style={{ height: 250 }}
    >
      <ul
        className="flex gap-12 px-12 overflow-x-auto snap-x snap-mandatory
                   [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
        role="listbox"
        aria-label="選擇唱片"
      >
        {tracks.map((t, i) => (
          <li
            key={t.id}
            className="snap-center shrink-0"
            role="option"
            aria-selected={currentIndex === i}
          >
            <button
              type="button"
              disabled={changing}
              onClick={() => playerStore.setIndex(i)}
              className={`relative block transition-[transform,width] duration-700 cursor-pointer
                          ${currentIndex === i ? 'scale-110' : 'hover:scale-105'}
                          disabled:cursor-wait`}
              aria-label={`播放 ${t.title}`}
            >
              <img
                src={t.cover}
                alt={t.title}
                loading="lazy"
                className="w-[200px] h-[200px] border-[10px] border-white shadow-[-10px_10px_30px_rgba(0,0,0,0.5)] object-cover"
              />
              <span className="block text-center mt-2 text-sm text-white/80 tracking-widest">
                {t.title}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
