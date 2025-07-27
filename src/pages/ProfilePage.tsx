import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { INTERESTS, READING_LEVELS } from '../../constants';
import type { ReadingLevel } from '../../types';
import { UserCircleIcon } from '../components/icons/Icons';

const ProfilePage: React.FC = () => {
  const { profile, setProfile } = useAppContext();
  const [formData, setFormData] = useState(profile);
  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Special handling for numeric fields to ensure they are stored as numbers
    if (name === "age" || name === "classLevel") {
        setFormData({ ...formData, [name]: parseInt(value, 10) || 0 });
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleInterestToggle = (interestName: string) => {
    const interests = formData.interests.includes(interestName)
      ? formData.interests.filter(i => i !== interestName)
      : [...formData.interests, interestName];
    setFormData({ ...formData, interests });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      <header className="text-center space-y-2">
        <UserCircleIcon className="w-20 h-20 mx-auto text-cyan-400" />
        <h1 className="text-3xl font-extrabold text-slate-800">Profil Anak</h1>
        <p className="text-slate-600">Atur profilmu agar cerita lebih pas untukmu.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-lg">
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-1">Nama Panggilan</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="age" className="block text-sm font-bold text-slate-700 mb-1">Usia</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full p-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="classLevel" className="block text-sm font-bold text-slate-700 mb-1">Kelas</label>
            <select
              id="classLevel"
              name="classLevel"
              value={formData.classLevel}
              onChange={handleInputChange}
              className="w-full p-3 border-2 border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map(level => (
                  <option key={level} value={level}>Kelas {level}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
            <label htmlFor="level" className="block text-sm font-bold text-slate-700 mb-1">Level Membaca</label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              className="w-full p-3 border-2 border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              {READING_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
        </div>


        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Minat Baca</label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(interest => (
              <button
                type="button"
                key={interest.name}
                onClick={() => handleInterestToggle(interest.name)}
                className={`px-3 py-2 rounded-full font-bold transition-colors flex items-center gap-2 ${
                  formData.interests.includes(interest.name)
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                <interest.icon className="w-5 h-5" />
                <span>{interest.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center pt-4">
            <button
                type="submit"
                className="w-full sm:w-auto px-10 py-3 bg-[#1E90FF] text-white font-bold text-lg rounded-full shadow-lg hover:bg-[#187de6] transition-colors"
            >
                Simpan Perubahan
            </button>
            {isSaved && <p className="text-green-600 mt-4 font-bold animate-pulse">Profil berhasil disimpan!</p>}
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;