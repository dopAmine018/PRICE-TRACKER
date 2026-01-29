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
  isRateSynced: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title, lang, setLang, theme, setTheme, currency, setCurrency, currencies, isRtl, t, isRateSynced
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

  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-500 ${
      isDark ? 'bg-black/60 border-white/10 backdrop-blur-2xl' : 'bg-white/80 border-black/5 backdrop-blur-2xl shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-lg transition-transform hover:scale-105 ${
              isDark ? 'bg-cyan-500 text-black shadow-cyan-500/20' : 'bg-blue-600 text-white'
            }`}>LW</div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tighter uppercase italic">{title}</h1>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsCurrOpen(!isCurrOpen)}
              className={`px-4 py-2.5 rounded-xl font-bold border transition-all flex items-center gap-3 group ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-white hover:border-white/30' 
                  : 'bg-black/5 border-black/10 text-black'
              }`}
            >
              {isRateSynced && (
                <span className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-green-500'}`} />
              )}
              <span className="opacity-60">{currency.symbol}</span>
              <span className="text-sm tracking-tight">{currency.code}</span>
              <span className="text-[10px] transition-transform group-hover:translate-y-0.5">▼</span>
            </button>
            {isCurrOpen && (
              <div className={`absolute top-full mt-2 w-64 rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 ${
                isRtl ? 'left-0' : 'right-0'
              } ${
                isDark ? 'bg-[#0a0c10]/95 border-white/10 backdrop-blur-3xl' : 'bg-white border-black/10'
              }`}>
                {isRateSynced && (
                  <div className={`px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] border-b ${
                    isDark ? 'text-cyan-400 border-white/5 bg-cyan-400/5' : 'text-green-600 border-black/5 bg-green-50'
                  }`}>
                    Live Exchange Sync Active
                  </div>
                )}
                <div className="max-h-80 overflow-y-auto custom-scrollbar p-2 space-y-1">
                  {currencies.map(c => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c);
                        setIsCurrOpen(false);
                      }}
                      className={`w-full text-start px-4 py-3 rounded-xl flex items-center justify-between transition-all ${
                        currency.code === c.code 
                          ? isDark ? 'bg-cyan-400 text-black font-black' : 'bg-blue-600 text-white'
                          : isDark ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">{c.label}</span>
                        <span className="text-[10px] opacity-60 uppercase">{c.code}</span>
                      </div>
                      <span className="font-black opacity-80">{c.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={`flex rounded-xl p-1 border ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
          }`}>
            <button
              onClick={() => setLang('en')}
              className={`px-4 py-1.5 rounded-lg font-black text-[11px] transition-all uppercase tracking-tighter ${
                lang === 'en' 
                  ? isDark ? 'bg-white text-black' : 'bg-blue-600 text-white' 
                  : 'opacity-40 hover:opacity-100'
              }`}
            >EN</button>
            <button
              onClick={() => setLang('ar')}
              className={`px-4 py-1.5 rounded-lg font-black text-[11px] transition-all uppercase tracking-tighter ${
                lang === 'ar' 
                  ? isDark ? 'bg-white text-black' : 'bg-blue-600 text-white' 
                  : 'opacity-40 hover:opacity-100'
              }`}
            >AR</button>
          </div>

          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${
              isDark ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10' : 'bg-black/5 border-black/10 text-gray-600 hover:bg-black/10'
            }`}
          >
            {isDark ? '☀' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
