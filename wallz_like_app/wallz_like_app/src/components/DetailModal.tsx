import React, { useState, useEffect } from 'react';
import { X, Heart, Download, Share2, Info, ZoomIn, ZoomOut, RotateCcw, Check, Sparkles } from 'lucide-react';
import { Wallpaper, wallpapers } from '../data/wallpapers';

interface DetailModalProps {
  wallpaper: Wallpaper;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectWallpaper: (wallpaper: Wallpaper) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  wallpaper,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onSelectWallpaper
}) => {
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'completed'>('idle');
  const [copied, setCopied] = useState<boolean>(false);

  // Reset states when wallpaper changes
  useEffect(() => {
    setZoomScale(1);
    setDownloadStatus('idle');
    setCopied(false);
  }, [wallpaper]);

  if (!isOpen) return null;

  // Find related wallpapers (same category, excluding current)
  const related = wallpapers
    .filter(w => w.category === wallpaper.category && w.id !== wallpaper.id)
    .slice(0, 3);

  const handleZoomIn = () => {
    setZoomScale(prev => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setZoomScale(prev => Math.max(prev - 0.25, 0.75));
  };

  const handleResetZoom = () => {
    setZoomScale(1);
  };

  const handleDownload = () => {
    if (downloadStatus !== 'idle') return;
    setDownloadStatus('downloading');
    setTimeout(() => {
      setDownloadStatus('completed');
    }, 1500);
  };

  const handleShare = () => {
    setCopied(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-gaming-darker/90 backdrop-blur-xl animate-fade-in overflow-y-auto">
      {/* Modal Card wrapper */}
      <div className="relative w-full max-w-5xl h-full sm:h-[85vh] bg-[#0d0721] sm:rounded-[32px] sm:border-2 sm:border-gaming-tileBorder flex flex-col md:flex-row overflow-hidden shadow-2xl glossy-purple !shadow-none !border-gaming-tileBorder">
        
        {/* Close Button for mobile */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-gaming-darker/60 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all hover:bg-gaming-dark active:translate-y-0.5"
        >
          <X size={20} />
        </button>

        {/* Left Side: Wallpaper Visual Canvas */}
        <div className="relative flex-1 bg-gaming-darker flex flex-col items-center justify-center p-6 min-h-[350px] md:min-h-0 overflow-hidden border-b md:border-b-0 md:border-r border-gaming-tileBorder">
          
          {/* Wallpaper Viewport */}
          <div className="w-full h-full max-w-[270px] aspect-[9/16] rounded-2xl overflow-hidden relative shadow-2xl border border-white/5 bg-[#171030] dark-tile flex items-center justify-center">
            <div 
              style={{ transform: `scale(${zoomScale})` }}
              className={`w-full h-full bg-gradient-to-br ${wallpaper.gradient} transition-transform duration-300 ease-out relative`}
            >
              {/* Glossy shine reflection on top of the preview */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Canvas Utilities: Zoom Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-gaming-darker/80 backdrop-blur-md px-3.5 py-2 rounded-full border border-gaming-tileBorder/80 shadow-lg">
            <button 
              onClick={handleZoomOut} 
              disabled={zoomScale <= 0.75}
              className="p-1.5 rounded-full hover:bg-gaming-tile text-slate-400 hover:text-white transition-colors disabled:opacity-40"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-xs font-bold font-mono text-slate-300 select-none min-w-[36px] text-center">
              {Math.round(zoomScale * 100)}%
            </span>
            <button 
              onClick={handleZoomIn} 
              disabled={zoomScale >= 2.5}
              className="p-1.5 rounded-full hover:bg-gaming-tile text-slate-400 hover:text-white transition-colors disabled:opacity-40"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            <div className="w-px h-4 bg-gaming-tileBorder mx-1" />
            <button 
              onClick={handleResetZoom}
              className="p-1.5 rounded-full hover:bg-gaming-tile text-slate-400 hover:text-white transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Right Side: Detailed Metadata & Options */}
        <div className="w-full md:w-[420px] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-gradient-to-b from-[#130b2c] to-[#090416]">
          <div>
            {/* Title & Creator */}
            <div className="mb-6 mt-4 md:mt-0">
              <span className="text-[11px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full bg-gaming-purple/35 text-gaming-purpleLight border border-gaming-purpleLight/30">
                {wallpaper.category}
              </span>
              <h2 className="text-2xl font-black text-white mt-3.5 tracking-tight leading-none">
                {wallpaper.title}
              </h2>
              <p className="text-sm text-slate-400 font-medium mt-1.5">
                Created by <span className="text-gaming-blue hover:underline cursor-pointer">@{wallpaper.author}</span>
              </p>
            </div>

            {/* Specifications Cards Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[#1b123a] border border-[#2d2055] rounded-2xl p-3 flex items-center gap-3">
                <Info size={16} className="text-gaming-blue shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Dimensions</p>
                  <p className="text-xs font-extrabold text-white mt-0.5">{wallpaper.resolution}</p>
                </div>
              </div>
              <div className="bg-[#1b123a] border border-[#2d2055] rounded-2xl p-3 flex items-center gap-3">
                <Sparkles size={16} className="text-gaming-gold shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">File Size</p>
                  <p className="text-xs font-extrabold text-white mt-0.5">{wallpaper.fileSize}</p>
                </div>
              </div>
            </div>

            {/* Tags Section */}
            <div className="mb-6">
              <h4 className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-2">Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {wallpaper.tags.map((t, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs font-semibold px-3 py-1 rounded-lg bg-gaming-tile/50 border border-gaming-tileBorder text-slate-300 hover:border-gaming-blue/40 hover:text-white cursor-pointer transition-colors"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions: Download / Favorite / Share */}
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex gap-3">
                {/* Download Button: Glossy Blue Bubble */}
                <button
                  onClick={handleDownload}
                  disabled={downloadStatus === 'downloading'}
                  className="flex-1 h-12 glossy-blue hover:brightness-105 active:translate-y-0.5 rounded-[16px] text-white font-extrabold text-sm flex items-center justify-center gap-2 select-none transition-all disabled:opacity-80"
                >
                  {downloadStatus === 'idle' && (
                    <>
                      <Download size={18} strokeWidth={2.5} />
                      <span>Download Wallpaper</span>
                    </>
                  )}
                  {downloadStatus === 'downloading' && (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving to files...</span>
                    </div>
                  )}
                  {downloadStatus === 'completed' && (
                    <>
                      <Check size={18} className="text-white" strokeWidth={3} />
                      <span>Wallpaper Downloaded!</span>
                    </>
                  )}
                </button>

                {/* Favorite Toggle: Glossy Pink Bubble */}
                <button
                  onClick={() => onToggleFavorite(wallpaper.id)}
                  className={`w-12 h-12 rounded-[16px] flex items-center justify-center active:translate-y-0.5 select-none transition-all ${
                    isFavorite 
                      ? 'glossy-pink text-white border border-transparent' 
                      : 'bg-gaming-tile/60 text-slate-400 hover:text-white border border-gaming-tileBorder hover:border-gaming-purpleLight/40'
                  }`}
                  title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                >
                  <Heart size={20} fill={isFavorite ? "white" : "transparent"} strokeWidth={isFavorite ? 0 : 2.5} />
                </button>
              </div>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="w-full h-11 bg-gaming-tile/40 hover:bg-gaming-tile/70 border border-gaming-tileBorder active:translate-y-0.5 rounded-[16px] text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Share2 size={14} />
                <span>{copied ? 'Copied link to clipboard!' : 'Share Wallpaper'}</span>
              </button>
            </div>
          </div>

          {/* Recommendations section */}
          {related.length > 0 && (
            <div className="border-t border-gaming-tileBorder pt-5 mt-auto">
              <h4 className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-3">Similar Wallpapers</h4>
              <div className="grid grid-cols-3 gap-2">
                {related.map(w => (
                  <div
                    key={w.id}
                    onClick={() => onSelectWallpaper(w)}
                    className="aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border border-[#2d2055] hover:border-gaming-blue/60 hover:scale-[1.04] transition-all relative"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${w.gradient}`} />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
