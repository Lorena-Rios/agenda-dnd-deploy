
import React from 'react';
import { Player } from '../types';

interface PlayerBadgeProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

export const PlayerBadge: React.FC<PlayerBadgeProps> = ({ player, size = 'md', active = true }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-lg'
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white shadow-lg transition-all duration-300 border-2 ${active ? 'opacity-100 scale-100' : 'opacity-30 scale-90 border-transparent grayscale'}`}
      style={{ backgroundColor: player.color, borderColor: active ? 'white' : 'transparent' }}
      title={player.name}
    >
      {player.initial}
    </div>
  );
};
