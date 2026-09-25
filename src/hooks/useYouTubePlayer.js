import { useEffect, useRef, useState, useCallback } from 'react';

export function useYouTubePlayer(songs, initialIndex = 0) {
  const playerRef = useRef(null);
  const [index, setIndex] = useState(initialIndex);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(65);
  const [muted, setMuted] = useState(false);

  const songsRef = useRef(songs);
  songsRef.current = songs;
  const volumeRef = useRef(volume);
  volumeRef.current = volume;
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const currentSong = songs[index] || songs[0];
  const isFirstMount = useRef(true);

  // Initialize YouTube Iframe API
  useEffect(() => {
    const createPlayer = () => {
      if (!window.YT?.Player || playerRef.current) return;
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: songsRef.current[0]?.id,
        playerVars: {
          playsinline: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
        },
        events: {
          onReady: ({ target }) => {
            target.setVolume(volumeRef.current);
            if (mutedRef.current) {
              target.mute();
            }
          },
          onStateChange: ({ data }) => {
            if (data === window.YT.PlayerState.PLAYING) setPlaying(true);
            if (data === window.YT.PlayerState.PAUSED) setPlaying(false);
            if (data === window.YT.PlayerState.ENDED) {
              setIndex((i) => (i + 1) % (songsRef.current.length || 1));
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
  }, []);

  // Load new song only when index or currentSong changes
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (!playerRef.current?.loadVideoById || !currentSong) return;
    playerRef.current.loadVideoById({
      videoId: currentSong.id,
      startSeconds: currentSong.start || 0,
    });
    playerRef.current.setVolume(mutedRef.current ? 0 : volumeRef.current);
    if (mutedRef.current) {
      playerRef.current.mute?.();
    } else {
      playerRef.current.unMute?.();
    }
    playerRef.current.playVideo();
    setPlaying(true);
  }, [index, currentSong]);

  // Track progress and duration
  useEffect(() => {
    const timer = setInterval(() => {
      const player = playerRef.current;
      if (!player?.getCurrentTime || !player?.getDuration) return;
      try {
        const current = player.getCurrentTime();
        const total = player.getDuration();
        if (Number.isFinite(current)) setProgress(current);
        if (Number.isFinite(total) && total > 0) setDuration(total);
      } catch (err) {
        // Player may not be ready or destroyed
      }
    }, 250);

    return () => clearInterval(timer);
  }, []);

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    try {
      const state = playerRef.current.getPlayerState ? playerRef.current.getPlayerState() : null;
      if (state === window.YT?.PlayerState.PLAYING) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const changeSong = useCallback(
    (direction) => {
      setIndex((i) => (i + direction + songsRef.current.length) % songsRef.current.length);
    },
    []
  );

  const seekTo = useCallback((seconds) => {
    const value = Number(seconds);
    setProgress(value);
    try {
      playerRef.current?.seekTo(value, true);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const changeVolume = useCallback((value) => {
    const v = Number(value);
    setVolume(v);
    const isMute = v === 0;
    setMuted(isMute);
    try {
      if (playerRef.current) {
        playerRef.current.setVolume?.(v);
        if (isMute) {
          playerRef.current.mute?.();
        } else {
          playerRef.current.unMute?.();
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;
    try {
      if (muted) {
        const v = volume || 65;
        playerRef.current.unMute?.();
        playerRef.current.setVolume?.(v);
        setVolume(v);
        setMuted(false);
      } else {
        playerRef.current.mute?.();
        setMuted(true);
      }
    } catch (err) {
      console.error(err);
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
