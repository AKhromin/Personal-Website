import { useCallback, useEffect, useRef } from 'react';

export default function useWindowSounds(enabled) {
  const audioRef = useRef(null);

  useEffect(() => () => {
    audioRef.current?.close().catch(() => {});
    audioRef.current = null;
  }, []);

  return useCallback(async (kind = 'click') => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!enabled || !AudioContext) return;

    try {
      const audio = audioRef.current ?? (audioRef.current = new AudioContext());
      if (audio.state !== 'running') await audio.resume();
      const start = audio.currentTime;
      const isSnap = kind === 'snap';
      const duration = isSnap ? 0.13 : 0.06;
      const tone = audio.createOscillator();
      const gain = audio.createGain();
      tone.type = 'sine';
      tone.frequency.setValueAtTime(isSnap ? 380 : 520, start);
      tone.frequency.exponentialRampToValueAtTime(isSnap ? 680 : 320, start + duration);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(0.055, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      tone.connect(gain);
      gain.connect(audio.destination);
      tone.start(start);
      tone.stop(start + duration);
    } catch {
      // Window actions still work when the browser blocks audio.
    }
  }, [enabled]);
}
