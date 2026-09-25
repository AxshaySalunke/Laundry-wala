import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { formatTime } from '../../utils/formatTime';

export function PlayerBottom({
  progress,
  duration,
  volume,
  muted,
  onSeek,
  onVolumeChange,
  onToggleMute,
}) {
  return (
    <div className="player-bottom">
      <span>{formatTime(progress)}</span>
      <input
        className="seek"
        type="range"
        min="0"
        max={duration || 0}
        step="0.1"
        value={Math.min(progress, duration || 0)}
        disabled={!duration}
        onChange={(e) => onSeek(e.target.value)}
        aria-label="Seek song"
      />
      <span>{formatTime(duration)}</span>
      <button
        className="mute"
        onClick={onToggleMute}
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
      <input
        className="volume"
        type="range"
        min="0"
        max="100"
        value={muted ? 0 : volume}
        onChange={(e) => onVolumeChange(e.target.value)}
        aria-label="Volume"
      />
    </div>
  );
}
