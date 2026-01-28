
import React from 'react';
import { Category } from '../types';

interface FilterTabsProps {
  activeCategory: Category;
  setActiveCategory: (c: Category) => void;
  categories: Record<Category, string>;
  theme: 'dark' | 'light';
}

const FilterTabs: React.FC<FilterTabsProps> = ({ activeCategory, setActiveCategory, categories, theme }) => {
  return (
    <div className="w-full flex justify-start sm:justify-center overflow-x-auto pb-4 gap-2 custom-scrollbar">
      {Object.entries(categories).map(([id, label]) => (
        <button
          key={id}
          onClick={() => setActiveCategory(id as Category)}
          className={`whitespace-nowrap px-6 py-2 rounded-full font-bold border-2 transition-all duration-200 transform active:scale-95 ${
            activeCategory === id
              ? 'bg-cyan-400 border-cyan-400 text-[#161a22]'
              : theme === 'dark'
                ? 'bg-[#1c2230] border-[#273044] text-[#9aa8c1] hover:border-cyan-400'
                : 'bg-white border-gray-200 text-gray-500 hover:border-blue-600'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
