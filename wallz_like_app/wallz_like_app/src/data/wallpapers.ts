export interface Wallpaper {
  id: string;
  title: string;
  category: string;
  gradient: string;
  tags: string[];
  resolution: string;
  fileSize: string;
  downloads: number;
  likes: number;
  views: number;
  featured: boolean;
  author: string;
  createdAt: string;
  aspectRatio?: string; // e.g. "9:16" or "16:9"
}

export const wallpapers: Wallpaper[] = [
  {
    id: "wall-1",
    title: "Glossy Spheres & Grid",
    category: "3D Glossy",
    gradient: "from-[#251c47] via-[#581ca6] to-[#00a2ff]",
    tags: ["Glossy", "3D", "Geometric", "Vibrant"],
    resolution: "3840 x 2160",
    fileSize: "8.4 MB",
    downloads: 1420,
    likes: 428,
    views: 3500,
    featured: true,
    author: "PawnGambitArt",
    createdAt: "2026-06-18",
    aspectRatio: "9:16"
  },
  {
    id: "wall-2",
    title: "Cyber Street 2099",
    category: "Cyberpunk",
    gradient: "from-cyan-900 via-[#0d1220] to-[#e231a6]",
    tags: ["Cyberpunk", "Neon", "City", "Futuristic"],
    resolution: "2160 x 3845",
    fileSize: "6.2 MB",
    downloads: 980,
    likes: 310,
    views: 2400,
    featured: true,
    author: "NeonPulse",
    createdAt: "2026-06-15",
    aspectRatio: "9:16"
  },
  {
    id: "wall-3",
    title: "Synthwave Sunset",
    category: "Retro Neon",
    gradient: "from-orange-500 via-pink-600 to-indigo-850",
    tags: ["Synthwave", "Retro", "Outrun", "Sunset"],
    resolution: "1440 x 2560",
    fileSize: "4.1 MB",
    downloads: 2450,
    likes: 890,
    views: 6100,
    featured: false,
    author: "RetroVibe",
    createdAt: "2026-06-10",
    aspectRatio: "9:16"
  },
  {
    id: "wall-4",
    title: "Quantum Drift",
    category: "Futuristic",
    gradient: "from-[#00a2ff] via-[#1f153a] to-indigo-900",
    tags: ["Sci-Fi", "Abstract", "Glow", "Quantum"],
    resolution: "3840 x 2160",
    fileSize: "9.1 MB",
    downloads: 720,
    likes: 215,
    views: 1800,
    featured: false,
    author: "HyperDrive",
    createdAt: "2026-06-19",
    aspectRatio: "16:9"
  },
  {
    id: "wall-5",
    title: "Vivid Capsule Maze",
    category: "3D Glossy",
    gradient: "from-[#fbbf24] via-[#581ca6] to-[#e231a6]",
    tags: ["3D", "Pipes", "Glassy", "Gold"],
    resolution: "2160 x 3840",
    fileSize: "7.8 MB",
    downloads: 1100,
    likes: 395,
    views: 2900,
    featured: true,
    author: "PawnGambitArt",
    createdAt: "2026-06-17",
    aspectRatio: "9:16"
  },
  {
    id: "wall-6",
    title: "Zen Mountain Range",
    category: "Minimalist",
    gradient: "from-slate-900 via-zinc-800 to-slate-950",
    tags: ["Minimalist", "Dark", "Nature", "Calm"],
    resolution: "3840 x 2160",
    fileSize: "3.2 MB",
    downloads: 1890,
    likes: 640,
    views: 4200,
    featured: false,
    author: "ZenStudio",
    createdAt: "2026-06-12",
    aspectRatio: "16:9"
  },
  {
    id: "wall-7",
    title: "Aetheria Sky Vibe",
    category: "Anime",
    gradient: "from-sky-300 via-rose-300 to-violet-400",
    tags: ["Anime", "Dreamy", "Sky", "Pastel"],
    resolution: "1080 x 2400",
    fileSize: "5.5 MB",
    downloads: 3200,
    likes: 1240,
    views: 8900,
    featured: true,
    author: "DreamerArt",
    createdAt: "2026-06-14",
    aspectRatio: "9:16"
  },
  {
    id: "wall-8",
    title: "Overdrive Hack",
    category: "Cyberpunk",
    gradient: "from-green-500 via-emerald-950 to-gaming-dark",
    tags: ["Matrix", "Terminal", "Hacker", "Green"],
    resolution: "1440 x 3200",
    fileSize: "4.8 MB",
    downloads: 650,
    likes: 180,
    views: 1500,
    featured: false,
    author: "HexOperator",
    createdAt: "2026-06-11",
    aspectRatio: "9:16"
  },
  {
    id: "wall-9",
    title: "Bubble Pop Grid",
    category: "3D Glossy",
    gradient: "from-[#00a2ff] via-[#e231a6] to-[#1f153a]",
    tags: ["Bubble", "Glossy", "Grid", "Pop"],
    resolution: "2160 x 3840",
    fileSize: "8.0 MB",
    downloads: 1550,
    likes: 580,
    views: 3900,
    featured: true,
    author: "PawnGambitArt",
    createdAt: "2026-06-19",
    aspectRatio: "9:16"
  },
  {
    id: "wall-10",
    title: "Nebula Core",
    category: "Futuristic",
    gradient: "from-[#8b5cf6] via-[#e231a6] to-[#090416]",
    tags: ["Space", "Galaxy", "Star", "Vivid"],
    resolution: "3840 x 2160",
    fileSize: "10.2 MB",
    downloads: 2100,
    likes: 740,
    views: 5300,
    featured: false,
    author: "CosmoLens",
    createdAt: "2026-06-08",
    aspectRatio: "16:9"
  },
  {
    id: "wall-11",
    title: "Cyberpunk Cybernetic",
    category: "Cyberpunk",
    gradient: "from-red-500 via-[#1f153a] to-blue-600",
    tags: ["Cyberpunk", "Mech", "Android", "Glow"],
    resolution: "1080 x 2400",
    fileSize: "5.1 MB",
    downloads: 1320,
    likes: 470,
    views: 3100,
    featured: false,
    author: "NeonPulse",
    createdAt: "2026-06-16",
    aspectRatio: "9:16"
  },
  {
    id: "wall-12",
    title: "Dark Minimalist Dunes",
    category: "Minimalist",
    gradient: "from-zinc-900 via-neutral-800 to-stone-900",
    tags: ["Desert", "Minimalist", "Dark", "Smooth"],
    resolution: "3840 x 2160",
    fileSize: "2.9 MB",
    downloads: 870,
    likes: 290,
    views: 2000,
    featured: false,
    author: "ZenStudio",
    createdAt: "2026-06-05",
    aspectRatio: "16:9"
  }
];
