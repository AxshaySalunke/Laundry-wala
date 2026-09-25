import React from 'react';
import { SONGS } from './constants/songs';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { Header } from './components/Header';
import { Player } from './components/Player/Player';
import { YouTubeEmbed } from './components/YouTubeEmbed';

export function App() {
  const {
    song,
    playing,
    progress,
    duration,
    volume,
    muted,
    togglePlay,
    changeSong,
    seekTo,
    changeVolume,
    toggleMute,
  } = useYouTubePlayer(SONGS);

  return (
    <main className="page">
      <img
        className="background"
        src="/lundry-background.png"
        alt="Lundry Wala comic artwork"
      />
      <div className="shade" />
      <YouTubeEmbed />

      <Header />

      <Player
        song={song}
        playing={playing}
        progress={progress}
        duration={duration}
        volume={volume}
        muted={muted}
        onTogglePlay={togglePlay}
        onPrev={() => changeSong(-1)}
        onNext={() => changeSong(1)}
        onSeek={seekTo}
        onVolumeChange={changeVolume}
        onToggleMute={toggleMute}
      />
    </main>
  );
}

export default App;
