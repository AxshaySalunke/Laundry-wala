import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music2 } from 'lucide-react';
import './styles.css';

const songs = [
  { title: 'Pehla Nasha', artist: 'Udit Narayan · Sadhana Sargam', film: 'Jo Jeeta Wohi Sikandar · 1992', id: '1R8MGdgZDns' },
  { title: 'Mera Dil Bhi Kitna Pagal Hai', artist: 'Kumar Sanu · Alka Yagnik', film: 'Saajan · 1991', id: '5synzzf1H7g' },
  { title: 'Ek Ladki Ko Dekha', artist: 'Kumar Sanu', film: '1942: A Love Story · 1994', id: 'z15nRYTphXk', start: 7 },
];

function App() {
  const playerRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(65);
  const [muted, setMuted] = useState(false);
  const song = songs[index];

  useEffect(() => {
    const createPlayer = () => {
      if (!window.YT?.Player || playerRef.current) return;
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: songs[0].id,
        playerVars: { playsinline: 1, controls: 0, rel: 0, modestbranding: 1, iv_load_policy: 3 },
        events: {
          onReady: ({ target }) => target.setVolume(volume),
          onStateChange: ({ data }) => {
            if (data === window.YT.PlayerState.PLAYING) setPlaying(true);
            if (data === window.YT.PlayerState.PAUSED) setPlaying(false);
            if (data === window.YT.PlayerState.ENDED) setIndex(i => (i + 1) % songs.length);
          }
        }
      });
    };
    if (window.YT?.Player) createPlayer();
    else {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { previous?.(); createPlayer(); };
    }
    return () => { window.onYouTubeIframeAPIReady = undefined; };
  }, []);

  useEffect(() => {
    if (!playerRef.current?.loadVideoById) return;
    playerRef.current.loadVideoById({ videoId: song.id, startSeconds: song.start || 0 });
    playerRef.current.setVolume(muted ? 0 : volume);
    playerRef.current.playVideo();
    setPlaying(true);
  }, [index]);

  useEffect(() => {
    const timer = setInterval(() => {
      const p = playerRef.current;
      if (!p?.getCurrentTime || !p?.getDuration) return;
      const current = p.getCurrentTime();
      const total = p.getDuration();
      if (Number.isFinite(current)) setProgress(current);
      if (Number.isFinite(total) && total > 0) setDuration(total);
    }, 250);
    return () => clearInterval(timer);
  }, []);

  const togglePlay = () => {
    if (!playerRef.current) return;
    const state = playerRef.current.getPlayerState();
    if (state === window.YT?.PlayerState.PLAYING) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  const changeSong = direction => setIndex(i => (i + direction + songs.length) % songs.length);

  const changeVolume = value => {
    const v = Number(value);
    setVolume(v);
    setMuted(v === 0);
    playerRef.current?.setVolume(v);
    if (v > 0) playerRef.current?.unMute();
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (muted) {
      const v = volume || 65;
      playerRef.current.unMute();
      playerRef.current.setVolume(v);
      setVolume(v);
      setMuted(false);
    } else {
      playerRef.current.mute();
      setMuted(true);
    }
  };

  const formatTime = value => {
    const total = Math.max(0, Math.floor(Number(value) || 0));
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
  };

  return (
    <main className="page">
      <img className="background" src="/lundry-background.png" alt="Lundry Wala comic artwork" />
      <div className="shade" />
      <div className="hidden-youtube" aria-hidden="true"><div id="youtube-player" /></div>

      <header className="site-header" aria-label="Lundry Wala header">
        <div className="brand-mark">LW</div>
        <div className="brand-copy">
          <div className="brand-hindi">लुंड्री वाला</div>
          <div className="brand-sub">90s RADIO&nbsp;&nbsp;·&nbsp;&nbsp;मोहल्ले से</div>
        </div>
        <div className="live-status"><i /> LIVE · 90s HINDI</div>
      </header>

      <section className="player" aria-label="Lundry Wala radio player">
        <div className="player-head">
          <span><i /> NOW WASHING</span>
          <span>90s · HINDI</span>
        </div>

        <div className="player-main">
          <div className={`vinyl ${playing ? 'spin' : ''}`}><div className="vinyl-center"><Music2 size={14} /></div></div>
          <div className="song-info">
            <h2>{song.title}</h2>
            <p>{song.artist}</p>
            <small>{song.film}</small>
          </div>
          <div className="controls">
            <button onClick={() => changeSong(-1)} aria-label="Previous song"><SkipBack /></button>
            <button className="play" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
            </button>
            <button onClick={() => changeSong(1)} aria-label="Next song"><SkipForward /></button>
          </div>
        </div>

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
            onChange={e => { const value = Number(e.target.value); setProgress(value); playerRef.current?.seekTo(value, true); }}
            aria-label="Seek song"
          />
          <span>{formatTime(duration)}</span>
          <button className="mute" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
            {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input className="volume" type="range" min="0" max="100" value={muted ? 0 : volume} onChange={e => changeVolume(e.target.value)} aria-label="Volume" />
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
