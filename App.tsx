import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Category, Currency, Language, ItemData } from './types';
import { CURRENCIES, I18N, parseAllRows, INITIAL_ITEMS } from './constants';
import Header from './components/Header';
import FilterTabs from './components/FilterTabs';
import ItemCard from './components/ItemCard';
import SelectionBar from './components/SelectionBar';
import ComparisonModal from './components/ComparisonModal';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('lang');
    return (saved === 'en' || saved === 'ar') ? saved : 'en';
  });
  
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'dark';
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('currency');
    return saved && CURRENCIES[saved] ? CURRENCIES[saved] : CURRENCIES.USD;
  });

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>(Category.ALL);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize from global window data if already loaded
  const [items, setItems] = useState<ItemData[]>(() => {
    const win = window as any;
    if (win.ALL_ROWS && win.ALL_ROWS.length > 0) {
      return parseAllRows(win.ALL_ROWS);
    }
    return INITIAL_ITEMS;
  });
  
  const lastRowsCount = useRef<number>((window as any).ALL_ROWS?.length || 0);

  useEffect(() => {
    const syncData = () => {
      const win = window as any;
      const rawData = win.ALL_ROWS;
      
      if (Array.isArray(rawData) && rawData.length > 0) {
        setIsLoading(false);
        if (rawData.length !== lastRowsCount.current) {
          console.log(`Syncing ${rawData.length} items...`);
          setItems(parseAllRows(rawData));
          lastRowsCount.current = rawData.length;
        }
      }
    };

    // Immediate check
    syncData();

    // Event listener for real-time updates from scripts
    window.addEventListener('rows_updated', syncData);

    // Frequent polling for the first few seconds to catch delayed script execution
    const fastInterval = setInterval(syncData, 200);
    
    // Failsafe: stop loading spinner after 5 seconds
    const timeout = setTimeout(() => setIsLoading(false), 5000);

    return () => {
      window.removeEventListener('rows_updated', syncData);
      clearInterval(fastInterval);
      clearTimeout(timeout);
    };
  }, []);

  const t = I18N[lang];
  const isRtl = lang === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
  }, [lang, isRtl]);

  useEffect(() => {
    if (theme === 'light') {
      document.body.className = 'bg-gray-50 text-gray-900';
    } else {
      document.body.className = 'bg-[#0f1115] text-[#f2f5f9]';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const filteredItems = useMemo(() => {
    const query = search.toLowerCase().trim();
    return items.filter(item => {
      const name = String(item.name || '').toLowerCase();
      const matchesSearch = query === '' || name.includes(query);
      const matchesCategory = activeCategory === Category.ALL || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, activeCategory]);

  const handleToggleSelect = (id: string) => {
    setSelectedItemIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= 3) {
          alert(t.ui.maxItems);
          return prev;
        }
        next.add(id);
      }
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedItemIds(new Set());
  };

  const selectedItems = useMemo(() => {
    return items.filter(item => selectedItemIds.has(item.id));
  }, [items, selectedItemIds]);

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
      <Header
        title={t.ui.title}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        currency={currency}
        setCurrency={(c) => {
          setCurrency(c);
          localStorage.setItem('currency', c.code);
        }}
        currencies={Object.values(CURRENCIES)}
        isRtl={isRtl}
        t={t}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col items-center gap-6">
          <div className="w-full max-w-2xl">
            <input
              type="text"
              placeholder={t.ui.search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full px-6 py-4 rounded-full border-2 focus:ring-4 focus:ring-cyan-400/30 outline-none font-bold text-lg transition-all ${
                theme === 'dark' 
                  ? 'bg-[#1a1f2e] border-[#374151] text-[#f2f5f9] placeholder-gray-500' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>

          <FilterTabs
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            categories={t.categories}
            theme={theme}
          />
        </div>

        {isLoading && items.length === 0 ? (
          <div className="mt-20 flex flex-col items-center gap-4 opacity-50 animate-pulse-slow">
            <div className="text-6xl">📥</div>
            <div className="text-xl font-bold">Synchronizing Data...</div>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
            {filteredItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                currency={currency}
                theme={theme}
                isRtl={isRtl}
                t={t}
                isSelected={selectedItemIds.has(item.id)}
                onToggleSelect={() => handleToggleSelect(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-20 text-center flex flex-col items-center justify-center gap-4 opacity-50">
            <div className="text-6xl">🔍</div>
            <div className="text-xl font-bold">{t.ui.noResults}</div>
          </div>
        )}
      </main>

      <SelectionBar
        count={selectedItemIds.size}
        t={t}
        onView={() => setIsModalOpen(true)}
        onClear={handleClearSelection}
        theme={theme}
      />

      <ComparisonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={selectedItems}
        currency={currency}
        theme={theme}
        t={t}
        isRtl={isRtl}
      />

      <footer className={`mt-20 py-10 border-t text-center ${
        theme === 'dark' ? 'bg-[#161a22] border-[#273044]' : 'bg-gray-100 border-gray-200'
      }`}>
        <div className="opacity-60 text-sm mt-1">Made by <strong>ASN1/1628</strong></div>
      </footer>
    </div>
  );
};

export default App;