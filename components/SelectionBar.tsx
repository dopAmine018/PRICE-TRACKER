
import React from 'react';
import { TranslationStrings } from '../types';

interface SelectionBarProps {
  count: number;
  t: TranslationStrings;
  onView: () => void;
  onClear: () => void;
  theme: 'dark' | 'light';
}

const SelectionBar: React.FC<SelectionBarProps> = ({ count, t, onView, onClear, theme }) => {
  if (count === 0) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 p-4 transition-all animate-in slide-in-from-bottom-full duration-300 ${
      theme === 'dark' ? 'bg-[#161a22] border-t-2 border-cyan-400 shadow-2xl' : 'bg-white border-t-2 border-blue-600 shadow-md'
    }`}>
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-400 text-black font-black w-10 h-10 rounded-full flex items-center justify-center text-xl">
            {count}
          </div>
          <span className="font-bold hidden sm:inline">{t.ui.selectedCount}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onClear}
            className={`px-6 py-2 rounded-full font-bold border-2 transition-all ${
              theme === 'dark' ? 'border-[#273044] hover:bg-red-500/10 hover:border-red-500' : 'border-gray-200 hover:bg-red-50 text-gray-600'
            }`}
          >
            {t.ui.clearAll}
          </button>
          <button
            onClick={onView}
            className="px-8 py-2 rounded-full font-black bg-cyan-400 text-[#161a22] hover:bg-cyan-300 transition-all shadow-lg hover:shadow-cyan-400/20"
          >
            {t.ui.viewSelected}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionBar;
