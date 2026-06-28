import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Compass, Heart, User, Gamepad2, Search, Sliders, Flame, Sparkles, ChevronRight, Volume2, VolumeX, Undo2, RotateCcw, Star, Play, ChevronLeft, Info } from 'lucide-react';
import { wallpapers, Wallpaper } from './data/wallpapers';
import { WallpaperCard } from './components/WallpaperCard';
import { DetailModal } from './components/DetailModal';
import { levels, Position, Barrier as BarrierType } from './data/levels';
import { playMoveSound, playBlockSound, playWinSound } from './utils/audio';

const VictoryParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    canvas.width = canvas.parentElement?.clientWidth || 400;
    canvas.height = canvas.parentElement?.clientHeight || 400;

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      radius: number;
      alpha: number;
    }[] = [];

    const colors = ['#00ccff', '#ff00cc', '#ffbb00', '#8b5cf6', '#34d399'];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: Math.random() * 4 + 2,
        alpha: 1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.alpha -= 0.015;
        
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        if (p.alpha <= 0) {
          particles.splice(idx, 1);
        }
      });

      if (particles.length < 40) {
        for (let i = 0; i < 3; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() > 0.5 ? 20 : canvas.height - 20,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            radius: Math.random() * 3 + 1,
            alpha: 1
          });
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-40 pointer-events-none w-full h-full" />;
};


export default function App() {
  // Navigation State: 'explore' | 'game' | 'favorites' | 'profile'
  const [currentTab, setCurrentTab] = useState<'explore' | 'game' | 'favorites' | 'profile'>('explore');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);

  // Load Favorites from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('gambit_wallpapers_favs');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Sync Favorites to LocalStorage
  const saveFavorites = (newFavs: string[]) => {
    setFavorites(newFavs);
    localStorage.setItem('gambit_wallpapers_favs', JSON.stringify(newFavs));
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isFav = favorites.includes(id);
    let updated: string[];
    if (isFav) {
      updated = favorites.filter(favId => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    saveFavorites(updated);
  };

  // Unique Categories list
  const categories = useMemo(() => {
    const list = new Set(wallpapers.map(w => w.category));
    return ['All', ...Array.from(list)];
  }, []);

  // Filter Wallpapers
  const filteredWallpapers = useMemo(() => {
    return wallpapers.filter(w => {
      const matchesSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            w.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            w.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || w.category === selectedCategory;

      if (currentTab === 'favorites') {
        return favorites.includes(w.id) && matchesSearch && matchesCategory;
      }
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, currentTab, favorites]);

  // 9x9 Neon Grid Puzzle Game State
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'won'>('start');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [gameMoves, setGameMoves] = useState<number>(0);
  const [selectedBall, setSelectedBall] = useState<'pink' | 'cyan' | null>(null);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [showInvalidFlash, setShowInvalidFlash] = useState<boolean>(false);
  const [undoHistory, setUndoHistory] = useState<{ pink: Position; cyan: Position }[]>([]);
  const [bestScores, setBestScores] = useState<Record<number, number>>({});
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  // Current active level configuration
  const activeLevel = useMemo(() => {
    return levels.find(l => l.id === currentLevel) || levels[0];
  }, [currentLevel]);

  // Initialized ball positions state
  const [ballPositions, setBallPositions] = useState<{ pink: Position; cyan: Position }>({
    pink: { x: levels[0].pinkStart.x, y: levels[0].pinkStart.y },
    cyan: { x: levels[0].cyanStart.x, y: levels[0].cyanStart.y }
  });

  // Load best scores and start the level on level change
  useEffect(() => {
    const scores: Record<number, number> = {};
    levels.forEach(lvl => {
      const saved = localStorage.getItem(`arcadePuzzleBestScore_level_${lvl.id}`);
      if (saved) {
        scores[lvl.id] = parseInt(saved);
      }
    });
    setBestScores(scores);

    // Initial positioning for the level
    setBallPositions({
      pink: { ...activeLevel.pinkStart },
      cyan: { ...activeLevel.cyanStart }
    });
  }, [currentLevel, activeLevel]);

  // Game timer loop
  useEffect(() => {
    let timer: any;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('gameover');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Helper check for barrier collisions
  const isMoveBlocked = (fromX: number, fromY: number, toX: number, toY: number, barriers: BarrierType[]): boolean => {
    if (toX < 0 || toX > 8 || toY < 0 || toY > 8) return true;
    const dx = toX - fromX;
    const dy = toY - fromY;
    if (Math.abs(dx) + Math.abs(dy) !== 1) return true;

    if (dx !== 0) {
      // Horizontal move
      const maxX = Math.max(fromX, toX);
      return barriers.some(b => b.dir === 'v' && b.x === maxX && fromY >= b.y && fromY < b.y + b.length);
    } else {
      // Vertical move
      const maxY = Math.max(fromY, toY);
      return barriers.some(b => b.dir === 'h' && b.y === maxY && fromX >= b.x && fromX < b.x + b.length);
    }
  };

  // Helper check for win condition
  const checkWinCondition = (pink: Position, cyan: Position): boolean => {
    return pink.y === 8 && cyan.y === 0;
  };

  const startLevel = (lvlId: number) => {
    setCurrentLevel(lvlId);
    const targetLvl = levels.find(l => l.id === lvlId) || levels[0];
    setBallPositions({
      pink: { ...targetLvl.pinkStart },
      cyan: { ...targetLvl.cyanStart }
    });
    setUndoHistory([]);
    setGameMoves(0);
    setSelectedBall(null);
    setTimeLeft(60);
    setGameState('playing');
  };

  const handleResetGame = () => {
    setBallPositions({
      pink: { ...activeLevel.pinkStart },
      cyan: { ...activeLevel.cyanStart }
    });
    setUndoHistory([]);
    setGameMoves(0);
    setSelectedBall(null);
    setGameState('playing');
    setTimeLeft(60);
  };

  const handleUndo = () => {
    if (undoHistory.length === 0 || gameState !== 'playing') return;
    const prevHistory = [...undoHistory];
    const lastState = prevHistory.pop()!;
    setBallPositions(lastState);
    setUndoHistory(prevHistory);
    setGameMoves(m => m - 1);
    if (!isSoundMuted) playMoveSound();
  };

  const handleCellClick = (x: number, y: number) => {
    if (gameState !== 'playing') return;

    // Check if clicked cell contains a ball (to select it)
    if (x === ballPositions.pink.x && y === ballPositions.pink.y) {
      setSelectedBall('pink');
      if (!isSoundMuted) playMoveSound();
      return;
    }
    if (x === ballPositions.cyan.x && y === ballPositions.cyan.y) {
      setSelectedBall('cyan');
      if (!isSoundMuted) playMoveSound();
      return;
    }

    // Move selected ball
    if (selectedBall) {
      const activePos = selectedBall === 'pink' ? ballPositions.pink : ballPositions.cyan;
      const otherPos = selectedBall === 'pink' ? ballPositions.cyan : ballPositions.pink;

      // Validate adjacency
      const dx = x - activePos.x;
      const dy = y - activePos.y;

      if (Math.abs(dx) + Math.abs(dy) === 1) {
        // Check barrier collision
        if (isMoveBlocked(activePos.x, activePos.y, x, y, activeLevel.barriers)) {
          if (!isSoundMuted) playBlockSound();
          setShowInvalidFlash(true);
          setTimeout(() => setShowInvalidFlash(false), 200);
          return;
        }

        // Check ball-on-ball collision
        if (x === otherPos.x && y === otherPos.y) {
          if (!isSoundMuted) playBlockSound();
          setShowInvalidFlash(true);
          setTimeout(() => setShowInvalidFlash(false), 200);
          return;
        }

        // Valid move!
        if (!isSoundMuted) playMoveSound();

        // Push to undo history
        setUndoHistory(prev => [...prev, { pink: { ...ballPositions.pink }, cyan: { ...ballPositions.cyan } }]);

        const newPositions = {
          ...ballPositions,
          [selectedBall]: { x, y }
        };

        setBallPositions(newPositions);
        setGameMoves(m => m + 1);

        if (checkWinCondition(newPositions.pink, newPositions.cyan)) {
          setGameState('won');
          if (!isSoundMuted) playWinSound();

          // Calculate and update score
          const currentScore = Math.max(0, (timeLeft * 10) - ((gameMoves + 1) * 5) + 1000);
          const levelBestKey = `arcadePuzzleBestScore_level_${currentLevel}`;
          const savedBest = localStorage.getItem(levelBestKey);
          if (!savedBest || currentScore > parseInt(savedBest)) {
            localStorage.setItem(levelBestKey, currentScore.toString());
            setBestScores(prev => ({ ...prev, [currentLevel]: currentScore }));
          }
        }
      } else {
        // Deselect if clicking far away
        setSelectedBall(null);
      }
    }
  };

  // Keyboard navigation hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing' || !selectedBall) return;

      let dx = 0;
      let dy = 0;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          dy = -1;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          dy = 1;
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          dx = -1;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          dx = 1;
          break;
        default:
          return;
      }

      e.preventDefault();

      const currentBallPos = selectedBall === 'pink' ? ballPositions.pink : ballPositions.cyan;
      const nextX = currentBallPos.x + dx;
      const nextY = currentBallPos.y + dy;

      if (isMoveBlocked(currentBallPos.x, currentBallPos.y, nextX, nextY, activeLevel.barriers)) {
        if (!isSoundMuted) playBlockSound();
        setShowInvalidFlash(true);
        setTimeout(() => setShowInvalidFlash(false), 200);
        return;
      }

      const otherBallPos = selectedBall === 'pink' ? ballPositions.cyan : ballPositions.pink;
      if (nextX === otherBallPos.x && nextY === otherBallPos.y) {
        if (!isSoundMuted) playBlockSound();
        setShowInvalidFlash(true);
        setTimeout(() => setShowInvalidFlash(false), 200);
        return;
      }

      // Valid move!
      if (!isSoundMuted) playMoveSound();

      setUndoHistory(prev => [...prev, { pink: { ...ballPositions.pink }, cyan: { ...ballPositions.cyan } }]);

      const newPositions = {
        ...ballPositions,
        [selectedBall]: { x: nextX, y: nextY }
      };

      setBallPositions(newPositions);
      setGameMoves(m => m + 1);

      if (checkWinCondition(newPositions.pink, newPositions.cyan)) {
        setGameState('won');
        if (!isSoundMuted) playWinSound();

        const currentScore = Math.max(0, (timeLeft * 10) - ((gameMoves + 1) * 5) + 1000);
        const levelBestKey = `arcadePuzzleBestScore_level_${currentLevel}`;
        const savedBest = localStorage.getItem(levelBestKey);
        if (!savedBest || currentScore > parseInt(savedBest)) {
          localStorage.setItem(levelBestKey, currentScore.toString());
          setBestScores(prev => ({ ...prev, [currentLevel]: currentScore }));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, selectedBall, ballPositions, currentLevel, timeLeft, gameMoves, isSoundMuted, activeLevel]);

  // Touch Swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    if (gameState !== 'playing' || !selectedBall) return;
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (gameState !== 'playing' || !selectedBall || !touchStart) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    
    const minSwipeDistance = 30;
    if (Math.abs(dx) < minSwipeDistance && Math.abs(dy) < minSwipeDistance) return;

    let moveX = 0;
    let moveY = 0;

    if (Math.abs(dx) > Math.abs(dy)) {
      moveX = dx > 0 ? 1 : -1;
    } else {
      moveY = dy > 0 ? 1 : -1;
    }

    const currentBallPos = selectedBall === 'pink' ? ballPositions.pink : ballPositions.cyan;
    const nextX = currentBallPos.x + moveX;
    const nextY = currentBallPos.y + moveY;

    if (isMoveBlocked(currentBallPos.x, currentBallPos.y, nextX, nextY, activeLevel.barriers)) {
      if (!isSoundMuted) playBlockSound();
      setShowInvalidFlash(true);
      setTimeout(() => setShowInvalidFlash(false), 200);
      return;
    }

    const otherBallPos = selectedBall === 'pink' ? ballPositions.cyan : ballPositions.pink;
    if (nextX === otherBallPos.x && nextY === otherBallPos.y) {
      if (!isSoundMuted) playBlockSound();
      setShowInvalidFlash(true);
      setTimeout(() => setShowInvalidFlash(false), 200);
      return;
    }

    // Valid move!
    if (!isSoundMuted) playMoveSound();
    
    setUndoHistory(prev => [...prev, { pink: { ...ballPositions.pink }, cyan: { ...ballPositions.cyan } }]);

    const newPositions = {
      ...ballPositions,
      [selectedBall]: { x: nextX, y: nextY }
    };

    setBallPositions(newPositions);
    setGameMoves(m => m + 1);

    if (checkWinCondition(newPositions.pink, newPositions.cyan)) {
      setGameState('won');
      if (!isSoundMuted) playWinSound();
      
      const currentScore = Math.max(0, (timeLeft * 10) - ((gameMoves + 1) * 5) + 1000);
      const levelBestKey = `arcadePuzzleBestScore_level_${currentLevel}`;
      const savedBest = localStorage.getItem(levelBestKey);
      if (!savedBest || currentScore > parseInt(savedBest)) {
        localStorage.setItem(levelBestKey, currentScore.toString());
        setBestScores(prev => ({ ...prev, [currentLevel]: currentScore }));
      }
    }
    
    setTouchStart(null);
  };

  return (
    <div className="flex min-h-screen bg-gaming-dark text-white select-none">
      
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-[260px] bg-gaming-darker border-r border-gaming-tileBorder p-6 shrink-0 h-screen sticky top-0 justify-between">
        <div className="flex flex-col gap-8">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3.5 px-2">
            <div className="w-10 h-10 rounded-[14px] glossy-purple flex items-center justify-center">
              <Gamepad2 size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none text-white">GAMBIT</h1>
              <span className="text-[10px] text-gaming-blue font-extrabold tracking-widest uppercase">Wallpapers</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setCurrentTab('explore')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                currentTab === 'explore'
                  ? 'glossy-purple text-white'
                  : 'text-slate-400 hover:text-white hover:bg-gaming-tile/45'
              }`}
            >
              <Compass size={18} />
              <span>Explore Wallpapers</span>
            </button>
            <button
              onClick={() => setCurrentTab('game')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                currentTab === 'game'
                  ? 'glossy-purple text-white'
                  : 'text-slate-400 hover:text-white hover:bg-gaming-tile/45'
              }`}
            >
              <Gamepad2 size={18} />
              <span>Pawn Gambit Game</span>
            </button>
            <button
              onClick={() => setCurrentTab('favorites')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                currentTab === 'favorites'
                  ? 'glossy-purple text-white'
                  : 'text-slate-400 hover:text-white hover:bg-gaming-tile/45'
              }`}
            >
              <Heart size={18} />
              <span>Favorites ({favorites.length})</span>
            </button>
            <button
              onClick={() => setCurrentTab('profile')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                currentTab === 'profile'
                  ? 'glossy-purple text-white'
                  : 'text-slate-400 hover:text-white hover:bg-gaming-tile/45'
              }`}
            >
              <User size={18} />
              <span>Gamer Profile</span>
            </button>
          </nav>
        </div>

        {/* Footer info in sidebar */}
        <div className="px-4 py-3 bg-[#110928] border border-gaming-tileBorder rounded-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-300 font-bold">Uptime 99.9%</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">Gambit OS v2.4.2</p>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-h-screen pb-24 md:pb-6 overflow-x-hidden">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-gaming-dark/80 backdrop-blur-md border-b border-gaming-tileBorder/40 px-6 py-4 flex items-center justify-between gap-4">
          
          {/* Brand for mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-8 h-8 rounded-lg glossy-purple flex items-center justify-center">
              <Gamepad2 size={16} />
            </div>
            <span className="font-black text-sm tracking-tight">GAMBIT</span>
          </div>

          {/* Search bar */}
          {currentTab !== 'game' && currentTab !== 'profile' ? (
            <div className="flex-1 max-w-md relative flex items-center">
              <Search size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search wallpapers by title, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gaming-darker border border-gaming-tileBorder rounded-full pl-10 pr-4 py-2 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-gaming-blue/60 transition-colors"
              />
            </div>
          ) : (
            <div className="flex-1" />
          )}

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gaming-tile/50 border border-gaming-tileBorder text-xs font-bold">
              <Sparkles size={13} className="text-gaming-gold" />
              <span>420 XP</span>
            </span>
            <button className="h-9 glossy-blue hover:brightness-105 rounded-xl text-xs font-extrabold px-4 shadow-md select-none transition-all active:translate-y-0.5">
              Sign In
            </button>
          </div>
        </header>

        {/* Content Tabs */}
        <div className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
          
          {/* TAB 1: EXPLORE WALLPAPERS */}
          {currentTab === 'explore' && (
            <div>
              {/* Premium Hero Section */}
              <section className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#2c145c] via-[#090514] to-gaming-darker border-2 border-gaming-tileBorder p-6 md:p-10 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                
                {/* Background design accents */}
                <div className="absolute right-0 top-0 w-80 h-80 bg-gaming-purpleLight/10 rounded-full blur-3xl -z-10" />
                
                <div className="flex-1 max-w-lg text-center md:text-left">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gaming-purple/40 border border-gaming-purpleLight/40 text-xs font-black text-gaming-purpleLight uppercase tracking-wider mb-4">
                    <Flame size={12} className="text-gaming-pink animate-pulse" />
                    Featured Gallery
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white mb-4">
                    Ultra-Vibrant Gaming Wallpapers
                  </h2>
                  <p className="text-slate-400 text-sm font-medium mb-6 leading-relaxed">
                    Personalize your display with premium gradient-art wallpapers inspired by futuristic board games, grid environments, and neon cyber aesthetics.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <button 
                      onClick={() => setSelectedCategory('3D Glossy')}
                      className="h-10 glossy-blue hover:brightness-105 rounded-xl px-5 text-xs font-extrabold flex items-center gap-2 select-none active:translate-y-0.5"
                    >
                      Browse 3D Glossy
                      <ChevronRight size={14} />
                    </button>
                    <button 
                      onClick={() => setCurrentTab('game')}
                      className="h-10 bg-gaming-tile/50 hover:bg-gaming-tile border border-gaming-tileBorder hover:border-gaming-purpleLight/45 rounded-xl px-5 text-xs font-bold flex items-center gap-2 select-none active:translate-y-0.5"
                    >
                      Play Mini-Game
                    </button>
                  </div>
                </div>

                {/* Hero visual: A small preview of the grid board */}
                <div className="w-full max-w-[210px] aspect-[9/16] rounded-2xl bg-gaming-darker border border-gaming-tileBorder p-2.5 flex flex-col justify-between glossy-purple select-none shrink-0 pointer-events-none transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="grid grid-cols-5 gap-1 flex-1">
                    {/* Tiny representation of the game board */}
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div key={i} className="dark-tile rounded-md aspect-square flex items-center justify-center">
                        {i === 6 && <div className="w-3 h-3 rounded-full bg-gaming-pink glossy-pink" />}
                        {i === 18 && <div className="w-3 h-3 rounded-full bg-gaming-blue glossy-blue" />}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Category Filter Tags */}
              <div className="mb-6 flex items-center justify-between gap-4 border-b border-gaming-tileBorder/30 pb-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-150 active:translate-y-0.5 select-none ${
                        selectedCategory === cat
                          ? 'glossy-purple text-white'
                          : 'bg-gaming-tile/40 text-slate-400 hover:text-white border border-gaming-tileBorder/80'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="hidden sm:flex items-center gap-2 text-slate-400 shrink-0">
                  <Sliders size={14} />
                  <span className="text-xs font-bold">{filteredWallpapers.length} items</span>
                </div>
              </div>

              {/* Wallpaper Grid */}
              {filteredWallpapers.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredWallpapers.map(wall => (
                    <WallpaperCard
                      key={wall.id}
                      wallpaper={wall}
                      isFavorite={favorites.includes(wall.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onOpenDetails={(w) => setSelectedWallpaper(w)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gaming-darker rounded-[24px] border border-gaming-tileBorder">
                  <p className="text-slate-400 text-sm font-semibold">No wallpapers found matching your selection.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                    className="mt-4 px-4 py-2 rounded-xl bg-gaming-tile border border-gaming-tileBorder text-xs font-bold text-white hover:bg-gaming-dark"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MINI GAME */}
          {currentTab === 'game' && (
            <div className="flex flex-col items-center justify-center max-w-2xl mx-auto pb-10">
              
              {/* Header Details */}
              <div className="text-center mb-6">
                <span className="text-[10px] tracking-widest font-black uppercase text-gaming-blue bg-gaming-blue/15 px-3 py-1 rounded-full border border-gaming-blue/30">
                  Interactive Game Companion
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white mt-2">Pawn Gambit Board</h2>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  Slide or tap the pink and cyan balls through the grid maze. Get the cyan ball to the cyan top row and the pink ball to the pink bottom row!
                </p>
              </div>

              {/* Level Selector Badges */}
              <div className="w-full flex justify-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin">
                {levels.map((lvl) => {
                  const isCompleted = bestScores[lvl.id] !== undefined;
                  const isActive = currentLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      onClick={() => startLevel(lvl.id)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold select-none transition-all active:translate-y-0.5 whitespace-nowrap ${
                        isActive
                          ? 'glossy-purple text-white border-2 border-gaming-purpleLight'
                          : 'bg-gaming-tile/40 text-slate-400 hover:text-white border border-gaming-tileBorder'
                      }`}
                    >
                      <span>LVL {lvl.id}</span>
                      {isCompleted && <Star size={12} className="text-gaming-gold fill-gaming-gold" />}
                    </button>
                  );
                })}
              </div>

              {/* HUD / Control Panel */}
              <div className="w-full grid grid-cols-3 items-center mb-4 bg-gaming-darker/60 px-5 py-3 rounded-2xl border border-gaming-tileBorder gap-4">
                {/* Stats */}
                <div className="flex gap-4">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Moves</span>
                    <p className="text-base font-black text-white leading-none mt-0.5">
                      {gameMoves} <span className="text-[10px] text-slate-500 font-normal">/ Par {activeLevel.par}</span>
                    </p>
                  </div>
                  <div className="w-px bg-gaming-tileBorder self-stretch" />
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Time</span>
                    <p className={`text-base font-black leading-none mt-0.5 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                      {timeLeft}s
                    </p>
                  </div>
                </div>

                {/* Level Title & Best Score */}
                <div className="text-center">
                  <p className="text-xs font-black text-white truncate">{activeLevel.name}</p>
                  <p className="text-[10px] text-gaming-gold font-bold mt-0.5">
                    {bestScores[currentLevel] ? `Best: ${bestScores[currentLevel]}` : 'Uncleared'}
                  </p>
                </div>

                {/* Quick Controls */}
                <div className="flex justify-end gap-2">
                  {/* Sound Toggle */}
                  <button
                    onClick={() => setIsSoundMuted(prev => !prev)}
                    className="p-2 bg-gaming-tile hover:bg-gaming-tile/80 border border-gaming-tileBorder rounded-xl text-slate-300 hover:text-white transition-colors active:translate-y-0.5"
                    title={isSoundMuted ? 'Unmute Sound' : 'Mute Sound'}
                  >
                    {isSoundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>

                  {/* Undo Button */}
                  <button
                    onClick={handleUndo}
                    disabled={undoHistory.length === 0}
                    className="p-2 bg-gaming-tile hover:bg-gaming-tile/80 border border-gaming-tileBorder rounded-xl text-slate-300 hover:text-white transition-colors disabled:opacity-40 disabled:pointer-events-none active:translate-y-0.5"
                    title="Undo Move"
                  >
                    <Undo2 size={15} />
                  </button>

                  {/* Reset Button */}
                  <button
                    onClick={handleResetGame}
                    className="p-2 bg-gaming-tile hover:bg-gaming-tile/80 border border-gaming-tileBorder rounded-xl text-slate-300 hover:text-white transition-colors active:translate-y-0.5"
                    title="Reset Board"
                  >
                    <RotateCcw size={15} />
                  </button>
                </div>
              </div>

              {/* Main Game Board - Styled exactly like the photo */}
              <div 
                className={`relative w-full max-w-[420px] aspect-square bg-[#3a1d74] border-[12px] border-gaming-purple rounded-[36px] shadow-2xl p-3 md:p-4 transition-all overflow-hidden ${
                  showInvalidFlash ? 'ring-4 ring-red-500/70 scale-[0.99]' : ''
                }`}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* Inner Play Area */}
                <div className="relative w-full h-full bg-[#090416] rounded-xl overflow-hidden border-2 border-gaming-tileBorder">
                  
                  {/* Grid Cells (9x9) */}
                  <div className="absolute inset-0 grid grid-cols-9 grid-rows-9 gap-[2px] p-[2px]">
                    {Array.from({ length: 9 * 9 }).map((_, idx) => {
                      const x = idx % 9;
                      const y = Math.floor(idx / 9);
                      
                      const isTopTarget = y === 0;
                      const isBottomTarget = y === 8;

                      let cellClass = "rounded-[4px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] bg-[#171030] border border-[#231849]";
                      if (isTopTarget) {
                        cellClass = "rounded-[4px] glossy-blue shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]";
                      } else if (isBottomTarget) {
                        cellClass = "rounded-[4px] glossy-pink shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]";
                      }

                      const isSelected = selectedBall && (
                        (selectedBall === 'pink' && ballPositions.pink.x === x && ballPositions.pink.y === y) ||
                        (selectedBall === 'cyan' && ballPositions.cyan.x === x && ballPositions.cyan.y === y)
                      );

                      return (
                        <div
                          key={idx}
                          onClick={() => handleCellClick(x, y)}
                          className={`${cellClass} cursor-pointer relative transition-all duration-150 ${
                            isSelected ? 'ring-2 ring-white scale-[0.92] z-30' : 'hover:bg-gaming-tile/20'
                          }`}
                        >
                          {/* Top row target light indicator */}
                          {isTopTarget && (
                            <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-white/60 pointer-events-none" />
                          )}
                          {/* Bottom row target light indicator */}
                          {isBottomTarget && (
                            <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-white/60 pointer-events-none" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Barriers Layer */}
                  <div className="absolute inset-0 pointer-events-none p-[2px]">
                    {activeLevel.barriers.map((bar, idx) => {
                      const isHorizontal = bar.dir === 'h';
                      const barStyle = isHorizontal ? {
                        left: `${bar.x * 11.11}%`,
                        top: `${bar.y * 11.11}%`,
                        width: `${bar.length * 11.11}%`,
                        height: '8px',
                        marginTop: '-4px',
                        transform: 'scaleX(0.96)'
                      } : {
                        left: `${bar.x * 11.11}%`,
                        top: `${bar.y * 11.11}%`,
                        width: '8px',
                        height: `${bar.length * 11.11}%`,
                        marginLeft: '-4px',
                        transform: 'scaleY(0.96)'
                      };

                      return (
                        <div
                          key={idx}
                          className="absolute z-10 rounded-full glossy-gold shadow-md"
                          style={barStyle}
                        />
                      );
                    })}
                  </div>

                  {/* Balls Layer */}
                  <div className="absolute inset-0 pointer-events-none p-[2px]">
                    {/* Pink Ball */}
                    <div
                      className="absolute z-20 flex items-center justify-center transition-all duration-200 ease-out"
                      style={{
                        left: `${ballPositions.pink.x * 11.11}%`,
                        top: `${ballPositions.pink.y * 11.11}%`,
                        width: '11.11%',
                        height: '11.11%',
                        padding: '10%'
                      }}
                    >
                      <div className={`w-full h-full rounded-full glossy-pink shadow-lg border border-pink-300 transition-all ${selectedBall === 'pink' ? 'scale-110 ring-2 ring-white drop-shadow-[0_0_8px_#ff00cc]' : ''}`} />
                    </div>

                    {/* Cyan Ball */}
                    <div
                      className="absolute z-20 flex items-center justify-center transition-all duration-200 ease-out"
                      style={{
                        left: `${ballPositions.cyan.x * 11.11}%`,
                        top: `${ballPositions.cyan.y * 11.11}%`,
                        width: '11.11%',
                        height: '11.11%',
                        padding: '10%'
                      }}
                    >
                      <div className={`w-full h-full rounded-full glossy-blue shadow-lg border border-sky-300 transition-all ${selectedBall === 'cyan' ? 'scale-110 ring-2 ring-white drop-shadow-[0_0_8px_#00ccff]' : ''}`} />
                    </div>
                  </div>

                  {/* Victory Canvas Confetti */}
                  {gameState === 'won' && <VictoryParticles />}

                  {/* Start Overlay Screen */}
                  {gameState === 'start' && (
                    <div className="absolute inset-0 bg-[#090416]/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gaming-purple/40 border border-gaming-purpleLight/40 text-[10px] font-black text-gaming-purpleLight uppercase tracking-wider mb-2">
                        <Gamepad2 size={12} />
                        Time Attack Mode
                      </span>
                      <h3 className="text-xl font-black text-white mb-2">NEON GRID PUZZLE</h3>
                      <p className="text-xs text-slate-400 mb-6 max-w-[280px]">
                        Guide the <span className="text-gaming-pink font-bold">Pink ball</span> to the bottom row, and the <span className="text-gaming-blue font-bold">Cyan ball</span> to the top row. Avoid the yellow barriers!
                      </p>
                      <button
                        onClick={() => setGameState('playing')}
                        className="h-11 glossy-blue hover:brightness-105 rounded-2xl px-6 text-xs font-extrabold flex items-center gap-2 select-none active:translate-y-0.5"
                      >
                        <Play size={14} className="fill-white" />
                        <span>START RUN (60s)</span>
                      </button>
                    </div>
                  )}

                  {/* Game Over Screen */}
                  {gameState === 'gameover' && (
                    <div className="absolute inset-0 bg-red-950/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center">
                      <h3 className="text-2xl font-black text-red-500 mb-2">TIME'S UP!</h3>
                      <p className="text-xs text-slate-300 mb-6 max-w-[280px]">
                        You ran out of time. Don't give up! Try again to find the solution.
                      </p>
                      <button
                        onClick={handleResetGame}
                        className="h-11 bg-red-600 hover:bg-red-500 border border-red-400 rounded-2xl px-6 text-xs font-extrabold flex items-center gap-2 select-none active:translate-y-0.5 text-white"
                      >
                        <RotateCcw size={14} />
                        <span>TRY AGAIN</span>
                      </button>
                    </div>
                  )}

                  {/* Level Cleared Screen */}
                  {gameState === 'won' && (
                    <div className="absolute inset-0 bg-[#05020c]/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                      <h3 className="text-2xl font-black text-gaming-gold tracking-wider mb-2 animate-bounce">LEVEL CLEARED!</h3>
                      <div className="w-full max-w-[240px] bg-gaming-tile/50 border border-gaming-tileBorder rounded-2xl p-4 mb-6 space-y-2 text-xs font-bold text-slate-300">
                        <div className="flex justify-between border-b border-gaming-tileBorder/40 pb-2">
                          <span>Moves Taken:</span>
                          <span className="text-white">{gameMoves} (Par: {activeLevel.par})</span>
                        </div>
                        <div className="flex justify-between border-b border-gaming-tileBorder/40 pb-2">
                          <span>Time Left:</span>
                          <span className="text-gaming-blue">{timeLeft}s</span>
                        </div>
                        <div className="flex justify-between pt-1 text-sm text-gaming-gold">
                          <span>FINAL SCORE:</span>
                          <span>{Math.max(0, (timeLeft * 10) - (gameMoves * 5) + 1000)}</span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handleResetGame}
                          className="h-10 bg-gaming-tile hover:bg-gaming-tile/80 border border-gaming-tileBorder text-slate-300 hover:text-white rounded-xl px-4 text-xs font-bold select-none active:translate-y-0.5"
                        >
                          Replay
                        </button>
                        {currentLevel < 5 ? (
                          <button
                            onClick={() => startLevel(currentLevel + 1)}
                            className="h-10 glossy-blue hover:brightness-105 rounded-xl px-5 text-xs font-extrabold flex items-center gap-2 select-none active:translate-y-0.5"
                          >
                            <span>Next Level</span>
                            <ChevronRight size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setCurrentTab('explore')}
                            className="h-10 glossy-blue hover:brightness-105 rounded-xl px-5 text-xs font-extrabold select-none active:translate-y-0.5"
                          >
                            Explore Wallpapers
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Instructions / Tips */}
              <div className="w-full mt-6 flex gap-4 p-4 bg-gaming-tile/30 border border-gaming-tileBorder rounded-2xl text-xs text-slate-400">
                <Info size={24} className="text-gaming-blue shrink-0" />
                <div className="space-y-1">
                  <p className="font-bold text-slate-300">How to Play:</p>
                  <p>1. Click or tap either pawn (Pink or Cyan) to select it.</p>
                  <p>2. Tap adjacent tiles, use WASD / Arrow Keys, or swipe to move the selected pawn.</p>
                  <p>3. Guide both pawns to their matching color zones (Cyan on top, Pink on bottom).</p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: FAVORITES GALLERY */}
          {currentTab === 'favorites' && (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-white">Your Saved Gallery</h2>
                  <p className="text-xs text-slate-400 mt-1">Keep track of the gaming backgrounds you love.</p>
                </div>
                <span className="px-3.5 py-1.5 rounded-xl bg-gaming-pink/15 border border-gaming-pink/40 text-xs font-bold text-gaming-pink">
                  {favorites.length} Liked
                </span>
              </div>

              {filteredWallpapers.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredWallpapers.map(wall => (
                    <WallpaperCard
                      key={wall.id}
                      wallpaper={wall}
                      isFavorite={favorites.includes(wall.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onOpenDetails={(w) => setSelectedWallpaper(w)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gaming-darker rounded-[24px] border border-gaming-tileBorder">
                  <p className="text-slate-400 text-sm font-semibold">You haven't liked any wallpapers yet.</p>
                  <button 
                    onClick={() => setCurrentTab('explore')}
                    className="mt-4 h-10 glossy-blue hover:brightness-105 rounded-xl px-5 text-xs font-extrabold transition-all"
                  >
                    Discover Wallpapers
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GAMER PROFILE */}
          {currentTab === 'profile' && (
            <div className="max-w-2xl mx-auto">
              
              {/* Profile Card wrapper */}
              <div className="p-8 rounded-[32px] dark-tile border border-gaming-tileBorder flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-48 h-48 bg-gaming-purpleLight/5 rounded-full blur-2xl" />
                
                {/* Avatar with glossy ring */}
                <div className="relative shrink-0 select-none">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gaming-purple to-gaming-pink flex items-center justify-center p-[4px] glossy-pink shadow-lg">
                    <div className="w-full h-full rounded-full bg-gaming-darker flex items-center justify-center text-3xl font-black text-white">
                      GG
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 px-2 py-0.5 rounded-full bg-gaming-gold text-[10px] font-black text-gaming-darker select-none glossy-gold shadow-md">
                    LVL 12
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-black text-white">Gamer Gambit</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Member since June 2026</p>
                  
                  {/* Gamer badges */}
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-4">
                    <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-md bg-gaming-blue/20 text-gaming-blue border border-gaming-blue/30">
                      🕹️ Arcade Champ
                    </span>
                    <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-md bg-gaming-pink/20 text-gaming-pink border border-gaming-pink/30">
                      🎨 Gradient Collector
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats blocks grid */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-gaming-darker/60 border border-gaming-tileBorder rounded-2xl p-4 text-center">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total Liked</span>
                  <p className="text-2xl font-black text-white mt-1">{favorites.length}</p>
                </div>
                <div className="bg-gaming-darker/60 border border-gaming-tileBorder rounded-2xl p-4 text-center">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">XP Points</span>
                  <p className="text-2xl font-black text-gaming-gold mt-1">420</p>
                </div>
                <div className="bg-gaming-darker/60 border border-gaming-tileBorder rounded-2xl p-4 text-center">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Downloads</span>
                  <p className="text-2xl font-black text-gaming-blue mt-1">15</p>
                </div>
              </div>

              {/* Gambit Level Progress */}
              <div className="bg-gaming-darker/60 border border-gaming-tileBorder rounded-[24px] p-6 mt-6">
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="text-slate-400">Level 12 Progress</span>
                  <span className="text-gaming-purpleLight">800 / 1000 XP</span>
                </div>
                <div className="w-full h-3.5 bg-gaming-dark border border-gaming-tileBorder rounded-full overflow-hidden p-[2px]">
                  <div className="h-full bg-gradient-to-r from-gaming-purple to-gaming-pink glossy-pink rounded-full w-[80%] !shadow-none !border-none relative" />
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Mobile Responsive Navigation Bottom Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-gaming-darker/90 backdrop-blur-md border-t border-gaming-tileBorder/80 p-2 md:hidden flex justify-around items-center">
        <button
          onClick={() => setCurrentTab('explore')}
          className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-150 ${
            currentTab === 'explore' ? 'text-gaming-blue' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass size={18} />
          <span className="text-[9px] font-black uppercase tracking-wider">Explore</span>
        </button>
        <button
          onClick={() => setCurrentTab('game')}
          className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-150 ${
            currentTab === 'game' ? 'text-gaming-purpleLight' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gamepad2 size={18} />
          <span className="text-[9px] font-black uppercase tracking-wider">Gambit</span>
        </button>
        <button
          onClick={() => setCurrentTab('favorites')}
          className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-150 ${
            currentTab === 'favorites' ? 'text-gaming-pink' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart size={18} />
          <span className="text-[9px] font-black uppercase tracking-wider">Likes ({favorites.length})</span>
        </button>
        <button
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-150 ${
            currentTab === 'profile' ? 'text-gaming-gold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User size={18} />
          <span className="text-[9px] font-black uppercase tracking-wider">Profile</span>
        </button>
      </footer>

      {/* Detail Modal Overlay */}
      {selectedWallpaper && (
        <DetailModal
          wallpaper={selectedWallpaper}
          isOpen={!!selectedWallpaper}
          onClose={() => setSelectedWallpaper(null)}
          isFavorite={favorites.includes(selectedWallpaper.id)}
          onToggleFavorite={(id) => handleToggleFavorite(id)}
          onSelectWallpaper={(w) => setSelectedWallpaper(w)}
        />
      )}

    </div>
  );
}
