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
    let playerInstance: Player | null = null;

    const updateTimeHandler = () => {
      if (playerInstance !== null) {
        setCurrentTime(playerInstance.currentTime);
      }
    };

    const checkAndLoadAudio = async () => {
      const url = new URL(audioUrl);
      if (url.pathname.endsWith('.amr')) {
        setIsAMR(true);
        const res = await fetch(audioUrl);
        if (res.ok) {
          const buffer = await res.arrayBuffer();
          playerInstance = AMRPlayer(buffer);
          setPlayer(playerInstance);
          setDuration(playerInstance.duration);

          playerInstance.addEventListener('timeupdate', updateTimeHandler);
        }
      }
    };

    if (audioUrl) {
      checkAndLoadAudio();
    }

    return () => {
      if (playerInstance) {
        playerInstance.pause();
        playerInstance.removeEventListener('timeupdate', updateTimeHandler);
      }
    };
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
        <div className="flex h-16 flex-row items-center rounded-full bg-gray-100 px-6">
          <div
            className="flex w-12 cursor-pointer items-center justify-center align-middle"
            onClick={handlePlayPause}
          >
            {paused ? (
              '▶️'
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#000000"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            )}
          </div>

          <div className="mx-2 flex flex-row items-center font-mono text-sm">
            <span className="w-[30px]">{formatTime(currentTime)}</span>
            <span className="pl-2 pr-1">/</span>
            <span className="w-[30px]">{formatTime(duration)}</span>
          </div>

          <input
            type="range"
            min="0"
            max={duration.toString()}
            value={currentTime.toString()}
            onChange={handleSeek}
            className="mx-2 w-full cursor-pointer accent-gray-900"
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
