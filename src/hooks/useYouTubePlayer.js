import { useEffect, useRef, useState, useCallback } from 'react';

export function useYouTubePlayer(songs, initialIndex = 0) {
  const playerRef = useRef(null);
  const [index, setIndex] = useState(initialIndex);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(65);
  const [muted, setMuted] = useState(false);

  const currentSong = songs[index] || songs[0];

  // Initialize YouTube Iframe API
  useEffect(() => {
    const createPlayer = () => {
      if (!window.YT?.Player || playerRef.current) return;
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: songs[0]?.id,
        playerVars: {
          playsinline: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
        },
        events: {
          onReady: ({ target }) => target.setVolume(volume),
          onStateChange: ({ data }) => {
            if (data === window.YT.PlayerState.PLAYING) setPlaying(true);
            if (data === window.YT.PlayerState.PAUSED) setPlaying(false);
            if (data === window.YT.PlayerState.ENDED) {
              setIndex((i) => (i + 1) % songs.length);
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        createPlayer();
      };
    }

    return () => {
      window.onYouTubeIframeAPIReady = undefined;
    };
  }, [songs, volume]);

  // Load new song when index changes
  useEffect(() => {
    if (!playerRef.current?.loadVideoById || !currentSong) return;
    playerRef.current.loadVideoById({
      videoId: currentSong.id,
      startSeconds: currentSong.start || 0,
    });
    playerRef.current.setVolume(muted ? 0 : volume);
    playerRef.current.playVideo();
    setPlaying(true);
  }, [index, currentSong, muted, volume]);

  // Track progress and duration
  useEffect(() => {
    const timer = setInterval(() => {
      const player = playerRef.current;
      if (!player?.getCurrentTime || !player?.getDuration) return;
      const current = player.getCurrentTime();
      const total = player.getDuration();
      if (Number.isFinite(current)) setProgress(current);
      if (Number.isFinite(total) && total > 0) setDuration(total);
    }, 250);

    return () => clearInterval(timer);
  }, []);

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    const state = playerRef.current.getPlayerState();
    if (state === window.YT?.PlayerState.PLAYING) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }, []);

  const changeSong = useCallback(
    (direction) => {
      setIndex((i) => (i + direction + songs.length) % songs.length);
    },
    [songs.length]
  );

  const seekTo = useCallback((seconds) => {
    const value = Number(seconds);
    setProgress(value);
    playerRef.current?.seekTo(value, true);
  }, []);

  const changeVolume = useCallback((value) => {
    const v = Number(value);
    setVolume(v);
    setMuted(v === 0);
    playerRef.current?.setVolume(v);
    if (v > 0) playerRef.current?.unMute();
  }, []);

  const toggleMute = useCallback(() => {
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
  }, [muted, volume]);

  return {
    song: currentSong,
    index,
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
  };
}
