import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { generateStory, generateIllustration } from '../../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Story } from '../../types';

const GenerateStoryPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { profile, addStory, addPoints } = useAppContext();
  const [loadingMessage, setLoadingMessage] = useState('Mencari ide cerita...');
  const [error, setError] = useState<string | null>(null);
  const generationStarted = useRef(false);

  const interest = state?.interest === 'Kejutan' 
    ? 'sebuah petualangan tak terduga' 
    : state?.interest || 'petualangan seru';

  useEffect(() => {
    // Prevent double execution in React.StrictMode which causes duplicate stories and points.
    if (generationStarted.current) {
        return;
    }
    generationStarted.current = true;

    const createStory = async () => {
      if (!interest) {
        navigate('/');
        return;
      }

      try {
        const { title, content, illustrationPrompt } = await generateStory(profile, interest);
        
        setLoadingMessage('Menggambar ilustrasi...');
        const imageUrl = await generateIllustration(illustrationPrompt);

        const newStory: Story = {
          id: `story-${Date.now()}`,
          title,
          content,
          imageUrl,
          illustrationPrompt,
          interest,
          level: profile.level,
          isRead: false,
          timestamp: Date.now(),
        };

        addStory(newStory);
        addPoints(10); // Points for generating a story
        
        navigate(`/story/${newStory.id}`, { replace: true });

      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("Terjadi kesalahan yang tidak diketahui.");
        }
        setLoadingMessage('Gagal membuat cerita.');
      }
    };

    createStory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interest, profile, navigate, addStory, addPoints]);

  if (error) {
      return (
          <div className="flex flex-col items-center justify-center h-screen -mt-20 text-center">
              <h2 className="text-2xl font-bold text-red-500">Oops!</h2>
              <p className="mt-2 text-slate-700">{error}</p>
              <button
                  onClick={() => navigate('/')}
                  className="mt-6 px-6 py-2 bg-[#1E90FF] text-white font-bold rounded-full shadow-lg hover:bg-[#187de6] transition-colors"
              >
                  Kembali ke Beranda
              </button>
          </div>
      );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen -mt-20">
      <LoadingSpinner message={loadingMessage} />
      <p className="mt-4 text-slate-600 text-center">Harap tunggu, keajaiban sedang dibuat!</p>
    </div>
  );
};

export default GenerateStoryPage;