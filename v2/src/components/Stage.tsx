import { useState } from 'react';
import RecordPlayer from './RecordPlayer';
import AlbumPicker from './AlbumPicker';
import ScrollStory from './ScrollStory';

type View = 'player' | 'story';

export default function Stage() {
  const [view, setView] = useState<View>('player');

  if (view === 'story') {
    return <ScrollStory onBack={() => setView('player')} />;
  }

  return (
    <div className="relative w-full">
      <RecordPlayer onEnter={() => setView('story')} />
      <AlbumPicker />
    </div>
  );
}
