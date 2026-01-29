import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Category, Currency, Language, ItemData } from './types';
import { CURRENCIES, I18N, parseAllRows, INITIAL_ITEMS, fetchLiveRates } from './constants';
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

  const [activeCurrencies, setActiveCurrencies] = useState<Record<string, Currency>>(CURRENCIES);
  const [currencyCode, setCurrencyCode] = useState<string>(() => {
    return localStorage.getItem('currencyCode') || 'USD';
  });
  const [isRateSynced, setIsRateSynced] = useState(false);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>(Category.ALL);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [items, setItems] = useState<ItemData[]>(() => {
    const win = window as any;
    if (win.ALL_ROWS && win.ALL_ROWS.length > 0) {
      return parseAllRows(win.ALL_ROWS);
    }
    return INITIAL_ITEMS;
  });
  
  const lastRowsCount = useRef<number>((window as any).ALL_ROWS?.length || 0);

  useEffect(() => {
    const updateRates = async () => {
      const rates = await fetchLiveRates();
      if (Object.keys(rates).length > 0) {
        const nextCurrencies = { ...CURRENCIES };
        Object.keys(nextCurrencies).forEach(code => {
          if (rates[code]) {
            nextCurrencies[code] = { ...nextCurrencies[code], rate: rates[code] };
          }
        });
        setActiveCurrencies(nextCurrencies);
        setIsRateSynced(true);
      }
    };
    updateRates();
    const rateInterval = setInterval(updateRates, 1000 * 60 * 60);
    return () => clearInterval(rateInterval);
  }, []);

  useEffect(() => {
    const syncData = () => {
      const win = window as any;
      const rawData = win.ALL_ROWS;
      if (Array.isArray(rawData) && rawData.length > 0) {
        setIsLoading(false);
        if (rawData.length !== lastRowsCount.current) {
          setItems(parseAllRows(rawData));
          lastRowsCount.current = rawData.length;
        }
      }
    };
    syncData();
    window.addEventListener('rows_updated', syncData);
    const interval = setInterval(syncData, 500);
    const timeout = setTimeout(() => setIsLoading(false), 5000);
    return () => {
      window.removeEventListener('rows_updated', syncData);
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const t = I18N[lang];
  const isRtl = lang === 'ar';
  const currency = activeCurrencies[currencyCode] || activeCurrencies.USD;
  const isDark = theme === 'dark';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
  }, [lang, isRtl]);

  useEffect(() => {
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

  return (
    <div className={`min-h-screen pb-40 transition-colors duration-1000 ${isDark ? 'bg-[#05070a] text-[#e2e8f0]' : 'bg-gray-50 text-slate-900'}`}>
      <Header
        title={t.ui.title}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        currency={currency}
        setCurrency={(c) => {
          setCurrencyCode(c.code);
          localStorage.setItem('currencyCode', c.code);
        }}
        currencies={Object.values(activeCurrencies)}
        isRtl={isRtl}
        t={t}
        isRateSynced={isRateSynced}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex flex-col items-center gap-12">
          <div className="w-full max-w-3xl text-center space-y-6">
            <div className="relative group">
              <input
                type="text"
                placeholder={t.ui.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full px-10 py-6 rounded-[2rem] border-2 outline-none font-bold text-xl transition-all shadow-2xl ${
                  isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-cyan-400 focus:bg-white/10 focus:shadow-cyan-400/20' 
                    : 'bg-white border-black/10 text-black placeholder-black/30 focus:border-blue-600 focus:shadow-blue-600/10'
                }`}
              />
              <div className={`absolute right-6 top-1/2 -translate-y-1/2 text-2xl opacity-40 group-focus-within:opacity-100 group-focus-within:text-cyan-400 transition-all`}>🔍</div>
            </div>

            <FilterTabs
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              categories={t.categories}
              theme={theme}
            />
          </div>

          {isLoading && items.length === 0 ? (
            <div className="mt-32 flex flex-col items-center gap-6 animate-pulse-slow">
              <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <div className="text-sm font-black uppercase tracking-[0.3em] opacity-40">Decrypting Server Data...</div>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
              {filteredItems.map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  currency={currency}
                  theme={theme}
                  isRtl={isRtl}
                  t={t}
                  isSelected={selectedItemIds.has(item.id)}
                  onToggleSelect={() => setSelectedItemIds(prev => {
                    const next = new Set(prev);
                    if (next.has(item.id)) next.delete(item.id);
                    else if (next.size < 3) next.add(item.id);
                    else alert(t.ui.maxItems);
                    return next;
                  })}
                />
              ))}
            </div>
          ) : (
            <div className="mt-32 text-center flex flex-col items-center gap-6 opacity-30">
              <div className="text-8xl">⚔️</div>
              <div className="text-xl font-black uppercase tracking-widest">{t.ui.noResults}</div>
            </div>
          )}
        </div>
      </main>

      <SelectionBar
        count={selectedItemIds.size}
        t={t}
        onView={() => setIsModalOpen(true)}
        onClear={() => setSelectedItemIds(new Set())}
        theme={theme}
      />

      <ComparisonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={items.filter(i => selectedItemIds.has(i.id))}
        currency={currency}
        theme={theme}
        t={t}
        isRtl={isRtl}
      />

      <footer className={`mt-32 py-16 border-t text-center transition-colors ${
        isDark ? 'bg-black/40 border-white/5' : 'bg-white border-black/5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-6">
          <div className="opacity-60 text-sm font-bold tracking-tight">Made by ASN1 1628</div>
        </div>
      </footer>
    </div>
  );
};

export default App;