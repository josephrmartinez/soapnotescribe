'use client';

import React, { useEffect, useState } from 'react';
import { AMRPlayer, Player } from 'web-amr';

interface AudioPlayerProps {
  audioUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const [isAMR, setIsAMR] = useState<boolean>(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(true);

  useEffect(() => {
    const checkAndLoadAudio = async () => {
      const url = new URL(audioUrl);
      if (url.pathname.endsWith('.amr')) {
        setIsAMR(true);
        const res = await fetch(audioUrl);
        if (res.ok) {
          const buffer = await res.arrayBuffer();
          const playerInstance = AMRPlayer(buffer);
          setPlayer(playerInstance);
          setDuration(playerInstance.duration);
          playerInstance.addEventListener('timeupdate', () => {
            setCurrentTime(playerInstance.currentTime);
          });
        }
      }
    };

    if (audioUrl) {
      checkAndLoadAudio();
    }
  }, [audioUrl]);

  const handlePlayPause = async () => {
    try {
      if (paused && player) {
        await player.play();
        setPaused(false);
      } else if (!paused && player) {
        await player.pause();
        setPaused(true);
      }
    } catch (error) {
      console.error('Playback error:', error);
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    if (player) {
      player.fastSeek(newTime);
      setCurrentTime(newTime);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {isAMR ? (
        <div className="flex h-16 flex-row items-center space-y-2 rounded-full bg-gray-100 px-6">
          <div
            className="flex w-12 cursor-pointer items-center justify-center"
            onClick={handlePlayPause}
          >
            {paused ? '▶️' : '⏸️'}
          </div>
          <span className="w-24 text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <input
            type="range"
            min="0"
            max={duration.toString()}
            value={currentTime.toString()}
            onChange={handleSeek}
            className="w-full cursor-pointer"
          />
        </div>
      ) : (
        <audio className="w-full" controls preload="metadata" src={audioUrl}>
          Your browser does not support the audio element.
        </audio>
      )}
    </>
  );
};

export default AudioPlayer;
