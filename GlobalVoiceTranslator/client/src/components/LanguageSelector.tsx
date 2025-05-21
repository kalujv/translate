import React from 'react';
import { LanguageOption } from '@shared/types';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export default function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  const languages: LanguageOption[] = [
    { code: 'es', name: 'Spanish', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/flags/4x3/es.svg' },
    { code: 'fr', name: 'French', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/flags/4x3/fr.svg' },
    { code: 'de', name: 'German', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/flags/4x3/de.svg' },
    { code: 'it', name: 'Italian', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/flags/4x3/it.svg' },
    { code: 'pt', name: 'Portuguese', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/flags/4x3/pt.svg' },
    { code: 'ru', name: 'Russian', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/flags/4x3/ru.svg' },
    { code: 'zh', name: 'Chinese (Mandarin)', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/flags/4x3/cn.svg' },
    { code: 'ja', name: 'Japanese', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/flags/4x3/jp.svg' },
    { code: 'ko', name: 'Korean', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/flags/4x3/kr.svg' },
    { code: 'ar', name: 'Arabic', flag: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/flags/4x3/sa.svg' },
  ];
  
  const selectedOption = languages.find(lang => lang.code === selectedLanguage) || languages[0];
  
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <h2 className="font-google-sans text-lg mb-2 sm:mb-0">Translate from:</h2>
        <div className="relative">
          <select 
            className="appearance-none bg-[#F1F3F4] rounded-full pl-12 pr-10 py-2 font-google-sans focus:outline-none focus:ring-2 focus:ring-[#4285F4] text-[#202124]"
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
          >
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.name}
              </option>
            ))}
          </select>
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
            <img 
              src={selectedOption.flag}
              alt={`${selectedOption.name} flag`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <span className="material-icons text-[#202124]">arrow_drop_down</span>
          </div>
        </div>
      </div>
      <div className="bg-[#F1F3F4] rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="material-icons mr-2 text-[#4285F4]">arrow_right_alt</span>
          <span className="font-google-sans">English</span>
        </div>
        <div className="flex items-center">
          <span className="material-icons text-[#4285F4] text-lg">volume_up</span>
        </div>
      </div>
    </div>
  );
}
