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

  // Sync Currency Rates
  useEffect(() => {
    const updateRates = async () => {
      const rates = await fetchLiveRates();

      if (rates && Object.keys(rates).length > 0) {
        const nextCurrencies: Record<string, Currency> = { ...CURRENCIES };

        Object.keys(nextCurrencies).forEach((code) => {
          const r = rates[code];
          if (typeof r === 'number') {
            nextCurrencies[code] = { ...nextCurrencies[code], rate: r };
          }
        });

        setActiveCurrencies(nextCurrencies);
        setIsRateSynced(true);
      }
    };

    updateRates();
    const rateInterval = setInterval(updateRates, 1000 * 60 * 60); // hourly
    return () => clearInterval(rateInterval);
  }, []);

  // Sync Item Data
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
    return items.filter((item) => {
      const name = String(item.name || '').toLowerCase();
      const matchesSearch = query === '' || name.includes(query);
      const matchesCategory = activeCategory === Category.ALL || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, activeCategory]);

  const handleToggleSelect = (id: string) => {
    setSelectedItemIds((prev) => {
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
          setCurrencyCode(c.code);
          localStorage.setItem('currencyCode', c.code);
        }}
        currencies={Object.values(activeCurrencies)}
        isRtl={isRtl}
        t={t}
        // LiveAssistant removed:
        onOpenLive={undefined as any}
        isRateSynced={isRateSynced}
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
                  ? 'bg-[#1a1f2e] border-[#374151] text-[#f2f5f9] placeholder-gray-500 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 shadow-lg'
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
            <div className="text-xl font-bold uppercase tracking-widest">
              Synchronizing Store Database...
            </div>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
            {filteredItems.map((item) => (
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
            <div className="text-xl font-bold uppercase tracking-widest">{t.ui.noResults}</div>
          </div>
        )}
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
        items={items.filter((i) => selectedItemIds.has(i.id))}
        currency={currency}
        theme={theme}
        t={t}
        isRtl={isRtl}
      />

      <footer
        className={`mt-20 py-12 border-t text-center ${
          theme === 'dark' ? 'bg-[#161a22] border-[#273044]' : 'bg-gray-100 border-gray-200'
        }`}
      >
        <div className="opacity-40 text-xs font-black uppercase tracking-tighter">
          Powered by Real-Time Currency Exchange
        </div>
        <div className="opacity-60 text-sm mt-2">
          Made by <strong>ASN1/1628</strong>
        </div>
      </footer>
    </div>
  );
};

export default App;
