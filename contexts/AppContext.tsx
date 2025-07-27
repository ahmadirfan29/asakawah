
import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Profile, Story, Reward, QAndA } from '../types';
import { ReadingLevel } from '../types';
import { INITIAL_REWARDS } from '../constants';
import useLocalStorage from '../hooks/useLocalStorage';

interface AppContextType {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  points: number;
  addPoints: (amount: number) => void;
  spendPoints: (amount: number) => boolean;
  stories: Story[];
  addStory: (story: Story) => void;
  updateStory: (id: string, updates: Partial<Story>) => void;
  favorites: string[];
  toggleFavorite: (storyId: string) => void;
  rewards: Reward[];
  unlockReward: (rewardId: string) => void;
  questions: QAndA[];
  addQuestion: (qanda: QAndA) => void;
  currentStory: Story | null;
  setCurrentStory: (story: Story | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useLocalStorage<Profile>('profile', {
    name: 'Kawan ASA',
    age: 8,
    classLevel: 1,
    level: ReadingLevel.Pemula,
    interests: [],
  });
  const [points, setPoints] = useLocalStorage<number>('points', 0);
  const [stories, setStories] = useLocalStorage<Story[]>('stories', []);
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);
  const [rewards, setRewards] = useLocalStorage<Reward[]>('rewards', INITIAL_REWARDS);
  const [questions, setQuestions] = useLocalStorage<QAndA[]>('questions', []);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);

  const addPoints = (amount: number) => setPoints(p => p + amount);

  const spendPoints = (amount: number) => {
    if (points >= amount) {
      setPoints(p => p - amount);
      return true;
    }
    return false;
  };

  const addStory = (story: Story) => {
      setStories(s => [story, ...s]);
      setCurrentStory(story);
  };

  const updateStory = (id: string, updates: Partial<Story>) => {
    setStories(s => s.map(story => story.id === id ? { ...story, ...updates } : story));
  };
  
  const toggleFavorite = (storyId: string) => {
    setFavorites(favs => 
      favs.includes(storyId) ? favs.filter(id => id !== storyId) : [...favs, storyId]
    );
  };
  
  const unlockReward = (rewardId: string) => {
    setRewards(r => r.map(reward => reward.id === rewardId ? { ...reward, unlocked: true } : reward));
  };

  const addQuestion = (qanda: QAndA) => {
    setQuestions(q => [qanda, ...q]);
  };

  const value = {
    profile,
    setProfile,
    points,
    addPoints,
    spendPoints,
    stories,
    addStory,
    updateStory,
    favorites,
    toggleFavorite,
    rewards,
    unlockReward,
    questions,
    addQuestion,
    currentStory,
    setCurrentStory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};