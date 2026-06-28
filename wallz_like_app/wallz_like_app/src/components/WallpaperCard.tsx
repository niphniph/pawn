import React from 'react';
import { Heart, Download, Eye } from 'lucide-react';
import { Wallpaper } from '../data/wallpapers';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenDetails: (wallpaper: Wallpaper) => void;
}

export const WallpaperCard: React.FC<WallpaperCardProps> = ({
  wallpaper,
  isFavorite,
  onToggleFavorite,
  onOpenDetails
}) => {
  return (
    <div 
      onClick={() => onOpenDetails(wallpaper)}
      className="dark-tile p-3 rounded-[24px] cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] select-none flex flex-col justify-between group"
    >
      {/* Gradient Preview Area */}
      <div className="relative aspect-[9/16] md:aspect-[3/4] w-full rounded-[18px] overflow-hidden bg-gradient-to-br glossy-purple">
        <div className={`absolute inset-0 bg-gradient-to-br ${wallpaper.gradient}`} />
        
        {/* Neon overlays */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full bg-gaming-darker/60 backdrop-blur-md border border-gaming-purpleLight/40 text-gaming-purpleLight">
            {wallpaper.category}
          </span>
          {wallpaper.featured && (
            <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full bg-gaming-gold/25 border border-gaming-gold/40 text-gaming-gold">
              ★ Featured
            </span>
          )}
        </div>

        {/* Glossy Overlay effect for the whole card */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-white/5 to-transparent opacity-60 pointer-events-none" />
        
        {/* Bottom quick stats */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl bg-gaming-darker/80 backdrop-blur-md border border-white/5">
          <div className="flex items-center gap-1 text-slate-300">
            <Eye size={12} className="text-gaming-blue" />
            <span className="font-semibold">{wallpaper.views >= 1000 ? `${(wallpaper.views / 1000).toFixed(1)}k` : wallpaper.views}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-300">
            <Download size={12} className="text-gaming-gold" />
            <span className="font-semibold">{wallpaper.downloads}</span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-3 px-1 flex justify-between items-center">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-bold text-sm text-white truncate leading-tight group-hover:text-gaming-blue transition-colors">
            {wallpaper.title}
          </h3>
          <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
            by {wallpaper.author}
          </p>
        </div>

        {/* Favorite Button: inspired by the glossy pink bubble */}
        <button
          onClick={(e) => onToggleFavorite(wallpaper.id, e)}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 active:translate-y-0.5 select-none ${
            isFavorite 
              ? 'glossy-pink text-white scale-105' 
              : 'bg-gaming-dark/60 text-slate-400 hover:text-white border border-gaming-tileBorder hover:border-gaming-purpleLight/40'
          }`}
        >
          <Heart size={14} fill={isFavorite ? "white" : "transparent"} strokeWidth={isFavorite ? 0 : 2.5} />
        </button>
      </div>
    </div>
  );
};
