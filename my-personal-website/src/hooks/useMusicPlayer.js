import { useCallback, useEffect, useRef, useState } from 'react';

const MUSIC_URL = `${import.meta.env.BASE_URL}assets/audio/lofi-background.mp3`;

export default function useMusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);

  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = 'none';
    audioRef.current = audio;
    const syncPlayback = () => setIsPlaying(!audio.paused);
    audio.addEventListener('play', syncPlayback);
    audio.addEventListener('pause', syncPlayback);
    return () => {
      audio.removeEventListener('play', syncPlayback);
      audio.removeEventListener('pause', syncPlayback);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audioRef.current = null;
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, []);

  const changeVolume = useCallback((value) => {
    setVolume(value);
    if (audioRef.current) audioRef.current.volume = value;
  }, []);

  return { isPlaying, togglePlay, volume, changeVolume };
}
