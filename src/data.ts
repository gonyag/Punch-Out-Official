import { Step, Feature, Battlefield, Fighter, FAQItem } from "./types";

export const gameSteps: Step[] = [
  {
    number: "01",
    title: "CHOOSE YOUR BATTLEFIELD",
    description: "Select from 6 highly volatile arenas, each featuring unique hazards, layout elevations, and physics weights designed for tactical spacing.",
    icon: "🗺️",
  },
  {
    number: "02",
    title: "PUNCH EVERYONE",
    description: "Zero cooldown slides, dash combos, and high-impact physical knockback physics. Read your opponent's timing, duck, and send them flying.",
    icon: "🥊",
  },
  {
    number: "03",
    title: "THE LAST ONE STANDING",
    description: "Outlast up to 20 combatants. Accumulate double punch power with every successful KO and rule the daily lobby leaderboard.",
    icon: "🏆",
  },
];

export const gameFeatures: Feature[] = [
  {
    id: "skill",
    title: "PURE SKILL",
    description: "No lock-on assistance, no pay-to-win gear, and no auto-dodges. Your victory relies 100% on split-second mouse timing, hitboxes, and spacing.",
    icon: "🎯",
  },
  {
    id: "speed",
    title: "FAST COMBAT",
    description: "Cancel attack recovery frames with rapid dodges. Chain forward slide tackles directly into heavy fist thrusts for momentum-filled strikes.",
    icon: "⚡",
  },
  {
    id: "comp",
    title: "COMPETITIVE RANKS",
    description: "Climb from 'Challenger' to 'Undisputed Champion'. Trade ranking points in high-stakes lobbies where every KO steals points from your enemy.",
    icon: "🏅",
  },
  {
    id: "friends",
    title: "PLAY WITH FRIENDS",
    description: "Launch smooth custom training gyms or setup standard free-for-all lobbies with custom gravity, knockback multipliers, and score rules.",
    icon: "👥",
  },
  {
    id: "maps",
    title: "MULTIPLE MAPS",
    description: "Fight at high altitudes on sky scrapers, avoid construction wrecking balls, or trigger sandstorms in custom interactive arenas.",
    icon: "🌐",
  },
  {
    id: "action",
    title: "CONSTANT ACTION",
    description: "Instantly respawn into chaos. Dynamic point multipliers activate randomly to crown any trailing fighters with triple power boosts.",
    icon: "🔥",
  },
];

export const battlefields: Battlefield[] = [
  {
    id: "classic",
    name: "Classic Arena",
    description: "The classic gladiator ring with elevated neon step borders and a central hot zone. Perfect for absolute beginners and raw physical spacing drills.",
    imageUrl: "https://images.unsplash.com/photo-1544045560-7297dd6a44a5?auto=format&fit=crop&q=80&w=600",
    mechanics: "Standard Physics • Hot Zone Multipliers",
    dangerLevel: "LOW",
  },
  {
    id: "rooftop",
    name: "Metropolitan Rooftop",
    description: "Battle high above the skyscrapers where strong wind currents affect slide drag, and there are absolutely no wall safety nets to prevent falls.",
    imageUrl: "GEN_HERO_BANNER", // Handled by mapped assets
    mechanics: "Extreme Depths • High Winds • Shattering Glass",
    dangerLevel: "CRITICAL",
  },
  {
    id: "warehouse",
    name: "Abandoned Warehouse",
    description: "A dark industrial environment packed with tight hallway corridors, explosive rust barrels, and high scaffolding platforms for tactical vertical drops.",
    imageUrl: "GEN_UNDERGROUND_RING", // Handled by mapped assets
    mechanics: "Dynamic Exploding Barrels • Scaffolding",
    dangerLevel: "HIGH",
  },
  {
    id: "construction",
    name: "Construction Site",
    description: "Dodge heavy swinging steel girders and dynamic crane wrecking balls while fighting across high wooden framing beams and toxic dust pipes.",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600",
    mechanics: "Swing Crushes • Decaying Planks",
    dangerLevel: "HIGH",
  },
  {
    id: "underground",
    name: "Underground Ring",
    description: "A cage lockbox with absolute solid brick walls. No falling deaths are possible here—your only path to victory is grinding your opponent to dust.",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=600",
    mechanics: "Cage Bounce • Chain Whipping Hazards",
    dangerLevel: "MEDIUM",
  },
  {
    id: "desert",
    name: "Canyon Oasis",
    description: "Fight across unstable sand columns and crumbling red sandstone arches during dynamic sandstorms that reduce visibility to near-zero.",
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5edd0cd9?auto=format&fit=crop&q=80&w=600",
    mechanics: "Sinking Sand • Crumbling Pillars",
    dangerLevel: "MEDIUM",
  },
];

export const topFighters: Fighter[] = [
  {
    rank: 1,
    username: "RobloxPunchGod",
    title: "🥊 UNDISPUTED CHAMPION",
    punches: 842100,
    winRate: "92.4%",
    avatarSeed: "roblox1",
  },
  {
    rank: 2,
    username: "FistSpeedrunner",
    title: "⚡ LIGHTNING ELITE",
    punches: 721590,
    winRate: "88.1%",
    avatarSeed: "roblox2",
  },
  {
    rank: 3,
    username: "NoCooldowner",
    title: "🔥 LOBBY ANNIHILATOR",
    punches: 689400,
    winRate: "84.9%",
    avatarSeed: "roblox3",
  },
  {
    rank: 4,
    username: "BlockyMcPunch",
    title: "RANK #4 WORLDWIDE",
    punches: 512000,
    winRate: "79.2%",
    avatarSeed: "roblox4",
  },
  {
    rank: 5,
    username: "GunsAreForWeak",
    title: "PURE STEEL SPECIALIST",
    punches: 498300,
    winRate: "78.4%",
    avatarSeed: "roblox5",
  },
  {
    rank: 6,
    username: "WreckingBallDodger",
    title: "REFLEX LEGEND",
    punches: 472100,
    winRate: "75.0%",
    avatarSeed: "roblox6",
  },
  {
    rank: 7,
    username: "SilentStrikerX",
    title: "SHADOW FIGHTER",
    punches: 441090,
    winRate: "74.1%",
    avatarSeed: "roblox7",
  },
];

export const faqs: FAQItem[] = [
  {
    question: "Is PUNCH OUT completely free to play?",
    answer: "Yes! PUNCH OUT is 100% free to access on Roblox. You can unlock arenas, win cosmetics, and earn daily rewards solely through combat skill and climbing the ranks. No microtransactions will buy punch damage multipliers.",
  },
  {
    question: "Can I host private lobby gyms with my friends?",
    answer: "Absolutely. PUNCH OUT features seamless Free Custom Lobbies where you can toggle sandbox parameters like 2x heavy gravity, instant dash cooldowns, giant fist scale models, and custom maps to training drills.",
  },
  {
    question: "How do I win and collect double rewards?",
    answer: "Knock other players off safe zones or deplete their health meters via fist damage. Every KO expands your punch size and increases knockback impact for the current round, building massive advantage.",
  },
  {
    question: "Which battlefields are currently available?",
    answer: "We currently offer 6 battle maps, including open sky-high metropolitan rooftops, abandoned industrial warehouses with scaffolding corridors, moving construction swinging beams, and cage underground combat cages.",
  },
];
