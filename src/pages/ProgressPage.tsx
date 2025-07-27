import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { ChartBarIcon, BookOpenIcon, StarIcon } from '../components/icons/Icons';
import type { Reward } from '../../types';

const RewardItem: React.FC<{ reward: Reward }> = ({ reward }) => {
    const { points, spendPoints, unlockReward } = useAppContext();
    const canAfford = points >= reward.cost;

    const handleUnlock = () => {
        if (canAfford && spendPoints(reward.cost)) {
            unlockReward(reward.id);
        }
    };

    return (
        <div className={`p-4 rounded-xl text-center transition-all duration-300 ${reward.unlocked ? 'bg-green-100' : 'bg-white shadow-md'}`}>
            <span className="text-5xl">{reward.emoji}</span>
            <p className="font-bold mt-2 text-slate-800">{reward.name}</p>
            {reward.unlocked ? (
                <p className="text-sm font-bold text-green-600">Terbuka!</p>
            ) : (
                <button 
                    onClick={handleUnlock}
                    disabled={!canAfford}
                    className="mt-2 w-full px-2 py-1 bg-[#1E90FF] text-white text-sm font-bold rounded-full shadow hover:bg-[#187de6] disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                    {reward.cost} Poin
                </button>
            )}
        </div>
    );
}

const ProgressPage: React.FC = () => {
  const { profile, points, stories, rewards } = useAppContext();
  const navigate = useNavigate();
  const readStories = stories.filter(s => s.isRead);

  return (
    <div className="space-y-8">
      <header className="text-center space-y-2">
        <ChartBarIcon className="w-16 h-16 mx-auto text-cyan-500" />
        <h1 className="text-3xl font-extrabold text-slate-800">Progres Belajarku</h1>
        <p className="text-slate-600">Lihat pencapaian hebatmu, {profile.name}!</p>
      </header>
      
      <section className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-white p-4 rounded-xl shadow-lg">
            <p className="text-4xl font-extrabold text-cyan-600">{readStories.length}</p>
            <p className="text-sm font-bold text-slate-700">Cerita Dibaca</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-lg">
            <p className="text-4xl font-extrabold text-yellow-500">{points}</p>
            <p className="text-sm font-bold text-slate-700">Total Poin</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <StarIcon className="w-7 h-7 text-yellow-500"/>
            Poin & Hadiah
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {rewards.map(reward => <RewardItem key={reward.id} reward={reward} />)}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BookOpenIcon className="w-7 h-7" />
            Riwayat Cerita
        </h2>
        {readStories.length > 0 ? (
            <ul className="space-y-3">
                {readStories.map(story => (
                    <li key={story.id} 
                        onClick={() => navigate(`/story/${story.id}`)}
                        className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between cursor-pointer hover:bg-cyan-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <img src={story.imageUrl} alt={story.title} className="w-12 h-12 rounded-md object-cover" />
                            <div>
                                <h3 className="font-bold text-slate-800">{story.title}</h3>
                                <p className="text-sm text-slate-600">{story.interest} - {story.level}</p>
                            </div>
                        </div>
                        <span className="text-cyan-500 font-bold">&#x276F;</span>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-center text-slate-600 bg-sky-100 p-6 rounded-lg">Kamu belum menyelesaikan cerita apapun. Ayo mulai membaca!</p>
        )}
      </section>
    </div>
  );
};

export default ProgressPage;