import { useEffect, useState } from 'react';
import RecordPlayer from './RecordPlayer';
import AlbumPicker from './AlbumPicker';
import ScrollStory from './ScrollStory';
import { tracks } from '../data/tracks';
import { usePlayer } from '../state/playerStore';

type View = 'player' | 'story';

export default function Stage() {
  const [view, setView] = useState<View>('player');
  const { currentIndex, playing } = usePlayer();
  const track = tracks[currentIndex]!;

  // When the user goes back to the player, scroll to top
  useEffect(() => {
    if (view === 'player') window.scrollTo({ top: 0 });
    else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [view]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        略過導覽，跳到主內容
      </a>

      {/* Live region — announces track + play state changes to screen readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {playing
          ? `正在播放第 ${track.id} 首：${track.title}`
          : `已選擇第 ${track.id} 首：${track.title}`}
      </div>

      <div id="main-content">
        {view === 'story' ? (
          <ScrollStory onBack={() => setView('player')} />
        ) : (
          <div className="relative w-full min-h-screen flex flex-col">
            <RecordPlayer onEnter={() => setView('story')} />
            <AlbumPicker />
          </div>
        )}
      </div>
    </>
  );
}
