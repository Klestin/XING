import React from 'react';
import { MessageCircle, Circle } from 'lucide-react';
import type { Match } from '../types';

interface MatchListProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
}

export const MatchList: React.FC<MatchListProps> = ({ matches, onSelectMatch }) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const matchDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - matchDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return matchDate.toLocaleDateString();
    }
  };

  return (
    <div className="bg-[#2D2D2D] rounded-xl p-4 h-full max-h-screen overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 text-white">Your Matches</h2>
      <div className="space-y-3">
        {matches.map((match) => (
          <div
            key={match.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1E1E1E] cursor-pointer transition-colors"
            onClick={() => onSelectMatch(match)}
          >
            <div className="relative">
              <img
                src={match.profile.photos[0]}
                alt={match.profile.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {match.active && (
                <Circle
                  size={12}
                  className="absolute bottom-0 right-0 text-[#4CAF50] fill-[#4CAF50]"
                />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white">{match.profile.name}</h3>
              {match.lastMessage ? (
                <p className="text-sm text-white/60 truncate">
                  {match.lastMessage.content}
                </p>
              ) : (
                <p className="text-sm text-white/60">
                  Matched {formatDate(match.matchedAt)}
                </p>
              )}
            </div>

            <button className="p-2 hover:bg-[#6200EE] rounded-full transition-colors group">
              <MessageCircle 
                size={20} 
                className="text-[#6200EE] group-hover:text-white transition-colors" 
              />
            </button>
          </div>
        ))}
        
        {matches.length === 0 && (
          <div className="text-center py-8 text-white/60">
            No matches yet. Keep swiping!
          </div>
        )}
      </div>
    </div>
  );
};