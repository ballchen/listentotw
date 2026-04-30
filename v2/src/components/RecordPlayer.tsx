import { useEffect, useRef } from 'react';
import { tracks } from '../data/tracks';
import { playerStore, usePlayer } from '../state/playerStore';

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

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: 'url(/img/bg.jpg)' }}
      aria-label="聽見福爾摩沙 唱片機"
    >
      {/* Recorder body — kept as raster for visual fidelity in Phase 1 */}
      <div className="absolute inset-0">
        <img
          src="/img/recorder.png"
          alt=""
          className="absolute pointer-events-none select-none
                     left-[-440px] top-[-87px] w-[933px] h-[600px]
                     md:left-[-200px] md:top-[40px] md:w-[700px] md:h-auto
                     lg:left-[-440px] lg:top-[-87px] lg:w-[933px] lg:h-[600px]"
        />
      </div>

      {/* Disc with cover art */}
      <div className="absolute left-[-180px] top-[-140px] w-[700px] h-[700px] z-30
                      lg:left-[-180px] lg:top-[-140px] lg:w-[700px] lg:h-[700px]">
        <img
          src="/img/record.png"
          alt=""
          className={`absolute inset-0 w-full h-full
                      ${playing && !changing ? 'disc-spin' : ''}
                      ${changing ? 'disc-change' : ''}`}
        />
        <img
          src={track.cover}
          alt={`${track.title} 專輯封面`}
          className={`absolute left-[200px] top-[200px] w-[300px] h-[300px]
                      ${playing && !changing ? 'disc-spin' : ''}
                      ${changing ? 'disc-change' : ''}`}
        />
      </div>

      {/* Tonearm */}
      <div className="absolute left-[-180px] top-[-140px] w-[700px] h-[700px] z-40 pointer-events-none">
        <img
          src="/img/head.png"
          alt=""
          className={`absolute w-[550px] h-[550px] top-[-3%]
                      origin-[46.9%_24.25%] rotate-45
                      ${changing ? 'arm-lift' : ''}`}
        />
      </div>

      {/* Logo + controls (right column) */}
      <div className="absolute left-[750px] top-0 w-[480px] z-50
                      max-lg:static max-lg:w-full max-lg:flex max-lg:flex-col max-lg:items-center max-lg:pt-8">
        <img
          src="/img/logo.png"
          alt="聽見，福爾摩沙"
          className="float-right mt-5 w-[254px] h-[250px] max-lg:float-none"
        />

        <div className="clear-both pt-[300px] flex gap-2 max-lg:pt-4 max-lg:justify-center">
          <ControlButton src="/img/btn-1.png" label="播放" onClick={() => playerStore.setPlaying(true)} />
          <ControlButton src="/img/btn-2.png" label="暫停" onClick={() => playerStore.setPlaying(false)} />
          <ControlButton src="/img/btn-3.png" label="停止" onClick={() => {
            playerStore.stop();
            const a = audioRef.current; if (a) a.load();
          }} />
          <button
            type="button"
            onClick={onEnter}
            className="cursor-pointer transition-transform hover:-translate-y-px"
            aria-label="進入故事"
          >
            <img src="/img/btn-story.png" alt="" className="h-[50px]" />
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        hidden
        onEnded={() => playerStore.setPlaying(false)}
        preload="metadata"
      >
        <source src={track.audio.mp3} type="audio/mpeg" />
        <source src={track.audio.ogg} type="audio/ogg" />
      </audio>

      <style>{`
        @keyframes disc-change {
          0%   { transform: translateX(0); }
          50%  { transform: translateX(-600px); }
          100% { transform: translateX(0); }
        }
        .disc-change { animation: disc-change 2s ease-in-out 1; }
        @keyframes arm-lift {
          0%, 100% { transform: rotate(45deg); }
          20%, 80% { transform: rotate(30deg); }
        }
        .arm-lift { animation: arm-lift 2.8s ease-in-out 1; }
      `}</style>
    </section>
  );
}

function ControlButton({
  src, label, onClick,
}: { src: string; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="cursor-pointer transition-transform hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
    >
      <img src={src} alt="" className="w-[50px] h-[50px]" />
    </button>
  );
}
