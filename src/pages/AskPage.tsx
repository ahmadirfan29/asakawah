import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { getAnswer } from '../../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { SparklesIcon, QuestionMarkCircleIcon, CheckCircleIcon, SendIcon } from '../components/icons/Icons';

interface ConversationTurn {
  question: string;
  answer: string;
}

const AskPage: React.FC = () => {
  const { profile, addPoints } = useAppContext();
  const [questionInput, setQuestionInput] = useState('');
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (completionMessage) {
      const timer = setTimeout(() => setCompletionMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [completionMessage]);

  useEffect(() => {
    // Scroll to bottom when new message appears
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation, isLoading]);

  const handleAskQuestion = async (questionText: string) => {
    if (!questionText.trim()) return;

    setIsLoading(true);
    setError(null);
    setFollowUpQuestions(null);
    setQuestionInput(''); // Clear input immediately

    try {
      const result = await getAnswer(profile, questionText);
      setConversation(prev => [...prev, { question: questionText, answer: result.answer }]);
      setFollowUpQuestions(result.followUpQuestions);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAskQuestion(questionInput);
  };

  const handleEndConversation = () => {
    const totalLength = conversation.reduce((sum, turn) => sum + turn.answer.length, 0);
    const pointsAwarded = Math.max(10, Math.min(50, Math.floor(totalLength / 25)));
    addPoints(pointsAwarded);
    
    setCompletionMessage(`Hebat! Kamu mendapatkan ${pointsAwarded} poin karena rasa ingin tahumu!`);
    setConversation([]);
    setFollowUpQuestions(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] bg-sky-50">
      <header className="text-center p-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-800">Apa yang Ingin Kamu Tahu?</h1>
      </header>

      <div ref={chatContainerRef} className="flex-grow overflow-y-auto space-y-6 p-4">
        {completionMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg flex items-center gap-3 animate-fade-in">
            <CheckCircleIcon className="w-6 h-6" />
            <p className="font-bold">{completionMessage}</p>
          </div>
        )}

        {conversation.map((turn, index) => (
          <div key={index} className="space-y-4 animate-fade-in">
            <div className="flex justify-end">
              <p className="bg-cyan-500 text-white rounded-t-xl rounded-l-xl p-3 max-w-xs sm:max-w-md shadow">
                {turn.question}
              </p>
            </div>
            <div className="flex justify-start">
               <div className="bg-white text-gray-800 rounded-t-xl rounded-r-xl p-4 max-w-xs sm:max-w-md shadow flex gap-3">
                 <SparklesIcon className="w-8 h-8 text-[#1E90FF] flex-shrink-0" />
                 <p className="whitespace-pre-line">{turn.answer}</p>
               </div>
            </div>
          </div>
        ))}
        
        {isLoading && <LoadingSpinner message="Mencari jawaban..." />}
        {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}
        
        {followUpQuestions && followUpQuestions.length > 0 && !isLoading && (
            <div className="space-y-3 animate-fade-in pt-4">
                <p className="text-center text-sm font-semibold text-slate-600">Ingin tahu lebih lanjut?</p>
                {followUpQuestions.map((q, index) => (
                    <button
                        key={index}
                        onClick={() => handleAskQuestion(q)}
                        className="w-full text-left p-3 bg-white/70 border-2 border-cyan-300 text-cyan-800 font-semibold rounded-lg shadow-sm hover:bg-cyan-50 transition-colors"
                    >
                        {q}
                    </button>
                ))}
            </div>
        )}

        {conversation.length === 0 && !isLoading && !completionMessage && (
            <div className="text-center text-slate-600 bg-sky-100 p-6 rounded-2xl h-full flex flex-col justify-center items-center">
                <QuestionMarkCircleIcon className="w-12 h-12 mb-2" />
                <p>Tanyakan apa saja, ASA' KAWAH akan bantu menjawab!</p>
                <p className="text-sm mt-2">Contoh: Kenapa pelangi bisa muncul?</p>
            </div>
        )}
      </div>
      
      {conversation.length > 0 && !isLoading && (
        <div className="p-4 text-center">
          <button
            onClick={handleEndConversation}
            className="inline-flex items-center gap-2 px-6 py-2 bg-green-500 text-white font-bold text-sm rounded-full shadow-lg hover:bg-green-600 transition-all duration-300"
          >
            <CheckCircleIcon className="w-5 h-5" />
            Saya Sudah Paham!
          </button>
        </div>
      )}
      
      <form onSubmit={handleFormSubmit} className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={questionInput}
          onChange={(e) => setQuestionInput(e.target.value)}
          placeholder="Ketik pertanyaanmu di sini..."
          className="flex-grow p-3 border-2 border-slate-300 rounded-full focus:ring-2 focus:ring-cyan-500 focus:outline-none shadow-sm"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !questionInput.trim()}
          className="p-3 bg-cyan-500 text-white rounded-full shadow-lg hover:bg-cyan-600 disabled:bg-cyan-200 disabled:cursor-not-allowed transition-colors"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default AskPage;