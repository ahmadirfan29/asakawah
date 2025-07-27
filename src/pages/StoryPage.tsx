import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { generateIllustration } from '../../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeftIcon, SpeakerWaveIcon, StarIcon, BookOpenIcon } from '../components/icons/Icons';
import type { Story } from '../../types';

const StoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile, stories, updateStory, addPoints, toggleFavorite, favorites, currentStory } = useAppContext();
  const [localStory, setLocalStory] = useState<Story | null | undefined>(undefined);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const storyData = stories.find(s => s.id === id) ?? (currentStory?.id === id ? currentStory : null);

    if (storyData) {
      if (storyData.imageUrl) {
        setLocalStory(storyData);
      } else {
        setLocalStory({ ...storyData }); // Set story without image first to show text
        generateIllustration(storyData.illustrationPrompt)
          .then(imageUrl => {
            const storyWithImage = { ...storyData, imageUrl };
            setLocalStory(storyWithImage);
            // Cache the generated image URL in the context for this session
            updateStory(storyData.id, { imageUrl }); 
          })
          .catch(err => {
            console.error("Failed to load illustration:", err);
            // Fallback image
            setLocalStory({ ...storyData, imageUrl: "https://picsum.photos/800/600?random=3" });
          });
      }
    } else {
      setLocalStory(null);
    }
  }, [id, stories, currentStory, updateStory]);


  const stopSpeech = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  useEffect(() => {
    // Cleanup speech synthesis on component unmount or navigation
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);
  
  if (localStory === undefined) {
    return (
      <div className="flex flex-col items-center justify-center h-screen -mt-20">
        <LoadingSpinner message="Memuat cerita..." />
      </div>
    );
  }
  
  if (localStory === null) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold">Cerita tidak ditemukan!</h2>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-[#1E90FF] text-white rounded-lg">Kembali</button>
      </div>
    );
  }

  const story = localStory;
  const isFavorite = story ? favorites.includes(story.id) : false;
  const contentFontSizeClass =
    profile.classLevel <= 2
      ? 'text-xl md:text-2xl' // Font lebih besar untuk kelas 1-2
      : 'text-lg md:text-xl';  // Font standar untuk kelas 3-6


  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeech();
      return;
    }
    stopSpeech(); // Stop any previous speech
    const utterance = new SpeechSynthesisUtterance(`${story.title}. ${story.content}`);
    utterance.lang = 'id-ID';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleMarkAsRead = () => {
    if (!story.isRead) {
      updateStory(story.id, { isRead: true });
      addPoints(50); // More points for finishing a story
    }
  };

  return (
    <div className="space-y-6">
       <header className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-cyan-100 transition-colors">
              <ArrowLeftIcon className="w-6 h-6 text-slate-700" />
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => toggleFavorite(story.id)} className="p-2 rounded-full hover:bg-yellow-100 transition-colors">
                <StarIcon className={`w-7 h-7 ${isFavorite ? 'text-yellow-400 fill-current' : 'text-yellow-400'}`} />
            </button>
            <button onClick={handleReadAloud} className={`p-2 rounded-full transition-colors ${isSpeaking ? 'bg-cyan-500' : 'hover:bg-cyan-100'}`}>
                <SpeakerWaveIcon className={`w-7 h-7 ${isSpeaking ? 'text-white animate-pulse' : 'text-cyan-600'}`} />
            </button>
          </div>
       </header>

      <article>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 text-center mb-4">{story.title}</h1>
        {!story.imageUrl ? (
            <div className="w-full aspect-[4/3] bg-slate-200 rounded-2xl shadow-lg mb-6 border-4 border-white flex items-center justify-center">
                <LoadingSpinner message="Menggambar ilustrasi..."/>
            </div>
        ) : (
            <img src={story.imageUrl} alt={story.title} className="w-full h-auto object-cover rounded-2xl shadow-lg mb-6 border-4 border-white" />
        )}
        <p className={`${contentFontSizeClass} text-justify leading-relaxed text-gray-800 whitespace-pre-line`}>
          {story.content}
        </p>
      </article>

      {!story.isRead && (
        <div className="text-center pt-6">
          <button
            onClick={handleMarkAsRead}
            className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 text-white font-bold text-lg rounded-full shadow-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300"
          >
            <BookOpenIcon className="w-7 h-7" />
            Selesai Membaca (+50 Poin)
          </button>
        </div>
      )}
    </div>
  );
};

export default StoryPage;