
import React from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { AppProvider, useAppContext } from '../contexts/AppContext';
import HomePage from './pages/HomePage';
import GenerateStoryPage from './pages/GenerateStoryPage';
import StoryPage from './pages/StoryPage';
import AskPage from './pages/AskPage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';

import { HomeIcon, BookOpenIcon, QuestionMarkCircleIcon, ChartBarIcon, UserCircleIcon, StarIcon } from './components/icons/Icons';

const NavLinks = () => {
  const { profile } = useAppContext();

  const commonLinkClass = "flex flex-col items-center justify-center gap-1 p-2 transition-colors duration-200";
  const activeLinkClass = "text-cyan-600";
  const inactiveLinkClass = "text-slate-500 hover:text-cyan-500";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 shadow-lg z-50">
      <div className="flex justify-around max-w-2xl mx-auto py-1">
        <NavLink to="/" className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
          <HomeIcon className="w-7 h-7" />
          <span className="text-xs font-bold">Beranda</span>
        </NavLink>
        <NavLink to="/ask" className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
          <QuestionMarkCircleIcon className="w-7 h-7" />
          <span className="text-xs font-bold">Tanya</span>
        </NavLink>
        <a 
          href="https://buku.kemdikbud.go.id/katalog/buku-non-teks" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`${commonLinkClass} ${inactiveLinkClass}`}
        >
          <BookOpenIcon className="w-7 h-7" />
          <span className="text-xs font-bold">Buku</span>
        </a>
        <NavLink to="/progress" className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
          <ChartBarIcon className="w-7 h-7" />
          <span className="text-xs font-bold">Progres</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
          <UserCircleIcon className="w-7 h-7" />
          <span className="text-xs font-bold">{profile.name || "Profil"}</span>
        </NavLink>
      </div>
    </nav>
  );
};


const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <div className="min-h-screen bg-sky-50 text-slate-800 pb-24">
          <main className="max-w-2xl mx-auto p-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/generate-story" element={<GenerateStoryPage />} />
              <Route path="/story/:id" element={<StoryPage />} />
              <Route path="/ask" element={<AskPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
          <NavLinks />
        </div>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
