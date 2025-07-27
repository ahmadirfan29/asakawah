import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { INTERESTS } from '../../constants';
import { BookOpenIcon, StarIcon, SparklesIcon } from '../components/icons/Icons';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, points, stories, favorites } = useAppContext();

  const handleInterestClick = (interest: string) => {
    navigate('/generate-story', { state: { interest } });
  };
  
  const favoriteStories = stories.filter(s => favorites.includes(s.id));

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold text-cyan-500">ASA' KAWAH</h1>
        <p className="text-lg text-slate-700 mt-2">Selamat datang, {profile.name}!</p>
        <div className="mt-4 inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded-full shadow-md">
            <StarIcon className="w-6 h-6"/>
            <span>{points} Poin</span>
        </div>
      </header>
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className="bg-gradient-to-br from-[#1E90FF] to-[#187de6] p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between cursor-pointer transform hover:scale-105 transition-transform duration-300"
            onClick={() => handleInterestClick('Kejutan')}
          >
              <div>
                <h2 className="text-2xl font-bold">Cerita Hari Ini</h2>
                <p className="mt-1">Dapatkan cerita baru yang seru!</p>
              </div>
              <SparklesIcon className="w-16 h-16 self-end opacity-50"/>
          </div>
          <div 
            className="bg-white p-6 rounded-2xl shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300"
            onClick={() => navigate('/progress')}
          >
             <div>
                <h2 className="text-2xl font-bold text-slate-800">Favorit Saya</h2>
                <p className="mt-1 text-slate-600">{favoriteStories.length} cerita disimpan</p>
              </div>
              <StarIcon className="w-16 h-16 self-end text-yellow-400 opacity-80"/>
          </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BookOpenIcon className="w-7 h-7" />
          Pilih Minat Cerita
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {INTERESTS.map(interest => (
            <button
              key={interest.name}
              onClick={() => handleInterestClick(interest.name)}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-white text-slate-800 font-bold rounded-xl shadow-md hover:shadow-lg hover:bg-cyan-50 transition-all duration-300 transform hover:-translate-y-1"
            >
              <interest.icon className="w-10 h-10 text-[#1E90FF]" />
              <span className="text-center">{interest.name}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;