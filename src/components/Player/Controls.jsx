import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export function Controls({ playing, onTogglePlay, onPrev, onNext }) {
  return (
    <div className="controls">
      <button onClick={onPrev} aria-label="Previous song">
        <SkipBack />
      </button>
      <button
        className="play"
        onClick={onTogglePlay}
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
      </button>
      <button onClick={onNext} aria-label="Next song">
        <SkipForward />
      </button>
    </div>
  );
}
