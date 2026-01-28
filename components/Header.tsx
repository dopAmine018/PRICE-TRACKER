
import React, { useState, useRef, useEffect } from 'react';
import { Currency, Language, TranslationStrings } from '../types';

interface HeaderProps {
  title: string;
  lang: Language;
  setLang: (l: Language) => void;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  currencies: Currency[];
  isRtl: boolean;
  t: TranslationStrings;
}

const Header: React.FC<HeaderProps> = ({
  title, lang, setLang, theme, setTheme, currency, setCurrency, currencies, isRtl, t
}) => {
  const [isCurrOpen, setIsCurrOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCurrOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`sticky top-0 z-50 border-b-4 transition-colors ${
      theme === 'dark' ? 'bg-[#161a22] border-cyan-400 shadow-xl' : 'bg-white border-blue-600 shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{title}</h1>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Currency Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsCurrOpen(!isCurrOpen)}
              className={`px-4 py-2 rounded-full font-bold border-2 transition-all flex items-center gap-2 ${
                theme === 'dark' 
                  ? 'bg-[#1c2230] border-cyan-400 text-cyan-400' 
                  : 'bg-white border-blue-600 text-blue-600'
              }`}
            >
              <span>{currency.code}</span>
              <span className="text-xs">▼</span>
            </button>
            {isCurrOpen && (
              <div className={`absolute top-full mt-2 w-56 rounded-xl border-2 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${
                isRtl ? 'left-0' : 'right-0'
              } ${
                theme === 'dark' ? 'bg-[#161a22] border-[#273044]' : 'bg-white border-gray-200'
              }`}>
                <div className="max-h-72 overflow-y-auto custom-scrollbar">
                  {currencies.map(c => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c);
                        setIsCurrOpen(false);
                      }}
                      className={`w-full text-start px-4 py-3 flex items-center justify-between hover:bg-opacity-10 ${
                        currency.code === c.code 
                          ? 'bg-cyan-500 bg-opacity-20 text-cyan-400 font-bold' 
                          : 'hover:bg-gray-500'
                      }`}
                    >
                      <span>{c.label}</span>
                      <span className="opacity-60">{c.code}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`px-4 py-2 rounded-full font-bold border-2 transition-all ${
              theme === 'dark' ? 'bg-[#1c2230] border-[#273044]' : 'bg-white border-gray-200'
            }`}
          >
            {theme === 'dark' ? t.ui.light : t.ui.dark}
          </button>

          {/* Lang Toggle */}
          <div className={`flex rounded-full overflow-hidden border-2 ${
            theme === 'dark' ? 'bg-[#1c2230] border-[#273044]' : 'bg-white border-gray-200'
          }`}>
            <button
              onClick={() => setLang('en')}
              className={`px-4 py-2 font-black transition-all ${
                lang === 'en' ? 'bg-cyan-400 text-[#161a22]' : ''
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('ar')}
              className={`px-4 py-2 font-black transition-all ${
                lang === 'ar' ? 'bg-cyan-400 text-[#161a22]' : ''
              }`}
            >
              AR
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
