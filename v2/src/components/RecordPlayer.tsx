import { useEffect, useRef } from 'react';
import { tracks } from '../data/tracks';
import { playerStore, usePlayer } from '../state/playerStore';
import Picture from './Picture';
import VinylDisc from './VinylDisc';

type Props = {
  onEnter: () => void;
};

export default function RecordPlayer({ onEnter }: Props) {
  const { currentIndex, playing, changing } = usePlayer();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const track = tracks[currentIndex]!;

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.load();
    if (playing && !changing) void a.play().catch(() => {});
  }, [currentIndex, changing]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) void a.play().catch(() => {});
    else a.pause();
  }, [playing]);

  // Keyboard: space toggles play, arrows switch tracks
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        playerStore.togglePlay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        playerStore.setIndex((currentIndex + 1) % tracks.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        playerStore.setIndex((currentIndex - 1 + tracks.length) % tracks.length);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentIndex]);

  return (
    <section
      id="player"
      className="relative w-full min-h-screen overflow-hidden flex flex-col items-center"
      style={{
        backgroundImage:
          'image-set(url(/img/bg.avif) type("image/avif"), url(/img/bg.webp) type("image/webp"), url(/img/bg.jpg) type("image/jpeg"))',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      aria-labelledby="player-heading"
    >
      <h1 id="player-heading" className="sr-only">
        聽見，福爾摩沙 — 唱片機
      </h1>

      {/* DESKTOP layout (lg+) */}
      <div className="hidden lg:block w-full h-screen">
        <Picture
          src="/img/recorder.png"
          alt=""
          aria-hidden="true"
          className="absolute pointer-events-none select-none
                     left-[-440px] top-[-87px] w-[933px] h-[600px]"
        />

        <VinylDisc
          cover={track.cover}
          spinning={playing}
          changing={changing}
          className="absolute left-[-180px] top-[-140px] w-[700px] h-[700px] z-30"
        />

        {/* Tonearm — keep raster (head.png) for now, with WebP/AVIF fallback */}
        <Picture
          src="/img/head.png"
          alt=""
          aria-hidden="true"
          className={`absolute left-[-180px] top-[-140px] w-[550px] h-[550px]
                      origin-[46.9%_24.25%] rotate-45 z-40 pointer-events-none
                      ${changing ? 'arm-lift' : ''}`}
        />

        <div className="absolute left-[750px] top-0 w-[480px] z-50">
          <Picture
            src="/img/logo.png"
            alt="聽見，福爾摩沙"
            className="float-right mt-5 w-[254px] h-[250px]"
          />
          <div className="clear-both pt-[300px] flex gap-2">
            <Controls onEnter={onEnter} audioRef={audioRef} />
          </div>
        </div>
      </div>

      {/* MOBILE / TABLET layout */}
      <div className="lg:hidden flex flex-col items-center w-full px-4 pt-6 pb-4 gap-6">
        <Picture
          src="/img/logo.png"
          alt="聽見，福爾摩沙"
          className="w-40 sm:w-48 h-auto"
        />

        <VinylDisc
          cover={track.cover}
          spinning={playing}
          changing={changing}
          className="w-[min(80vw,420px)] aspect-square"
        />

        <div className="text-center" aria-live="polite" aria-atomic="true">
          <p className="text-xs tracking-[0.4em] text-white/60 uppercase">
            {String(track.id).padStart(2, '0')} · {track.theme}
          </p>
          <p className="mt-1 text-xl font-medium">{track.title}</p>
        </div>

        <div className="flex gap-3 items-center justify-center">
          <Controls onEnter={onEnter} audioRef={audioRef} />
        </div>
      </div>

      <audio
        ref={audioRef}
        hidden
        onEnded={() => playerStore.setPlaying(false)}
        preload="metadata"
        aria-label={`音軌：${track.title}`}
      >
        <source src={track.audio.mp3} type="audio/mpeg" />
        <source src={track.audio.ogg} type="audio/ogg" />
      </audio>
    </section>
  );
}

function Controls({
  onEnter, audioRef,
}: { onEnter: () => void; audioRef: React.RefObject<HTMLAudioElement | null> }) {
  const { playing, changing } = usePlayer();
  return (
    <>
      <ControlButton
        src="/img/btn-1.png"
        label="播放"
        pressed={playing}
        disabled={changing}
        onClick={() => playerStore.setPlaying(true)}
      />
      <ControlButton
        src="/img/btn-2.png"
        label="暫停"
        pressed={!playing}
        disabled={changing}
        onClick={() => playerStore.setPlaying(false)}
      />
      <ControlButton
        src="/img/btn-3.png"
        label="停止"
        disabled={changing}
        onClick={() => {
          playerStore.stop();
          const a = audioRef.current;
          if (a) a.load();
        }}
      />
      <button
        type="button"
        onClick={onEnter}
        className="ml-2 cursor-pointer transition-transform hover:-translate-y-px
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="進入故事頁"
      >
        <Picture src="/img/btn-story.png" alt="" aria-hidden="true" className="h-[50px]" />
      </button>
    </>
  );
}

function ControlButton({
  src, label, onClick, pressed, disabled,
}: {
  src: string;
  label: string;
  onClick: () => void;
  pressed?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      className="cursor-pointer transition-transform hover:-translate-y-px
                 disabled:cursor-wait disabled:opacity-60
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <Picture src={src} alt="" aria-hidden="true" className="w-[50px] h-[50px]" />
    </button>
  );
}
