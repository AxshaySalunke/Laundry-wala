import React from 'react';
import { Vinyl } from './Vinyl';
import { SongInfo } from './SongInfo';
import { Controls } from './Controls';
import { PlayerBottom } from './PlayerBottom';

export function Player({
  song,
  playing,
  progress,
  duration,
  volume,
  muted,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleMute,
}) {
  return (
    <section className="player" aria-label="Lundry Wala radio player">
      <div className="player-head">
        <span>
          <i /> NOW WASHING
        </span>
        <span>90s · HINDI</span>
      </div>

      <div className="player-main">
        <Vinyl playing={playing} />
        <SongInfo
          title={song?.title}
          artist={song?.artist}
          film={song?.film}
        />
        <Controls
          playing={playing}
          onTogglePlay={onTogglePlay}
          onPrev={onPrev}
          onNext={onNext}
        />
      </div>

      <PlayerBottom
        progress={progress}
        duration={duration}
        volume={volume}
        muted={muted}
        onSeek={onSeek}
        onVolumeChange={onVolumeChange}
        onToggleMute={onToggleMute}
      />
    </section>
  );
}
