import type { Reward } from './types';
import { ReadingLevel } from './types';
import { 
    HomeIcon, 
    BookOpenIcon, 
    SparklesIcon, 
    FriendshipIcon, 
    FamilyIcon, 
    EnvironmentIcon,
    KoalaIcon, 
    StoryBookIcon, 
    HappyGirlIcon, 
    EducationIcon, 
    ScienceBeakersIcon, 
    SportsIcon,
    TreasureMapIcon,
    FantasyBookIcon,
    HistoryIcon
} from './src/components/icons/Icons';

export const INTERESTS = [
  { name: 'Petualangan', icon: TreasureMapIcon },
  { name: 'Fantasi', icon: FantasyBookIcon },
  { name: 'Persahabatan', icon: FriendshipIcon },
  { name: 'Keluarga', icon: FamilyIcon },
  { name: 'Lingkungan', icon: EnvironmentIcon },
  { name: 'Binatang', icon: KoalaIcon },
  { name: 'Cerita Rakyat', icon: StoryBookIcon },
  { name: 'Sejarah', icon: HistoryIcon },
  { name: 'Lucu / Jenaka', icon: HappyGirlIcon },
  { name: 'Pendidikan', icon: EducationIcon },
  { name: 'Sains', icon: ScienceBeakersIcon },
  { name: 'Olahraga', icon: SportsIcon },
];

export const READING_LEVELS = [ReadingLevel.Pemula, ReadingLevel.Menengah, ReadingLevel.Mahir];

export const INITIAL_REWARDS: Reward[] = [
  { id: 'sticker-1', name: 'Bintang Ceria', type: 'sticker', cost: 100, unlocked: false, emoji: '🌟' },
  { id: 'sticker-2', name: 'Roket Luar Angkasa', type: 'sticker', cost: 150, unlocked: false, emoji: '🚀' },
  { id: 'sticker-3', name: 'Kucing Pintar', type: 'sticker', cost: 200, unlocked: false, emoji: '🐱' },
  { id: 'avatar-1', name: 'Avatar Astronot', type: 'avatar', cost: 300, unlocked: false, emoji: '🧑‍🚀' },
  { id: 'avatar-2', name: 'Avatar Detektif', type: 'avatar', cost: 300, unlocked: false, emoji: '🕵️' },
  { id: 'badge-1', name: 'Pembaca Pemula', type: 'badge', cost: 500, unlocked: false, emoji: '🥉' },
  { id: 'badge-2', name: 'Kutu Buku', type: 'badge', cost: 1000, unlocked: false, emoji: '🥈' },
  { id: 'badge-3', name: 'Master Cerita', type: 'badge', cost: 2000, unlocked: false, emoji: '🥇' },
];