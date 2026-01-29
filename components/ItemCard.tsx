
import React, { useState, useEffect } from 'react';
import { ItemData, Currency, TranslationStrings } from '../types';
import { getItemImageSrc, DEFAULT_IMAGE } from '../constants';

interface ItemCardProps {
  item: ItemData;
  currency: Currency;
  theme: 'dark' | 'light';
  isRtl: boolean;
  t: TranslationStrings;
  isSelected: boolean;
  onToggleSelect: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, currency, theme, isRtl, t, isSelected, onToggleSelect }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imgSrc, setImgSrc] = useState(getItemImageSrc(item.name));
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    setImgSrc(getItemImageSrc(item.name));
    setErrorCount(0);
  }, [item.name]);

  const formatPrice = (p: number) => {
    const val = (p * currency.rate).toFixed(currency.prec);
    return currency.pos === 'prefix' ? `${currency.symbol}${val}` : `${val} ${currency.symbol}`;
  };

  const sortedPrices = [...item.prices].sort((a, b) => a.price - b.price);
  const isDark = theme === 'dark';

  const handleImgError = () => {
    if (errorCount === 0) {
      setImgSrc(`images/${item.name}.jpg`);
    } else {
      setImgSrc(DEFAULT_IMAGE);
    }
    setErrorCount(prev => prev + 1);
  };

  const localizedName = t.items[item.name] || item.name;

  return (
    <div 
      className="relative h-[460px] w-full group cursor-pointer perspective-2000" 
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative w-full h-full transition-all duration-700 preserve-3d shadow-2xl ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* FRONT SIDE */}
        <div className={`absolute inset-0 backface-hidden rounded-[2.5rem] border-2 p-8 flex flex-col transition-all duration-500 overflow-hidden ${
          isDark 
            ? 'bg-[#0e121a] border-white/5 hover:border-cyan-500/30' 
            : 'bg-white border-black/5'
        }`}>
          {isDark && (
            <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 blur-[100px] pointer-events-none" />
          )}

          <div className="flex justify-between items-start mb-6">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg border ${
              isDark ? 'bg-white/5 border-white/10 text-white/50' : 'bg-black/5 border-black/10 text-black/50'
            }`}>
              {t.categories[item.category] || item.category}
            </span>
            <div onClick={(e) => e.stopPropagation()} className="z-10">
              <input 
                type="checkbox" 
                checked={isSelected}
                onChange={onToggleSelect}
                className="w-6 h-6 rounded-lg border-2 cursor-pointer accent-cyan-400 transition-transform hover:scale-110"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            <div className="relative w-56 h-56 flex items-center justify-center transition-all duration-700 group-hover:scale-110">
              <div className="absolute inset-0 bg-black/5 rounded-full blur-2xl transform scale-75 group-hover:scale-100 transition-transform opacity-50" />
              <img 
                src={imgSrc} 
                alt={item.name} 
                onError={handleImgError}
                className="max-w-full max-h-full object-contain relative z-10"
                loading="lazy"
              />
            </div>
            
            <div className="text-center">
              <h3 className="font-black text-2xl tracking-tight leading-tight mb-2 uppercase line-clamp-2 min-h-[3rem] flex items-center justify-center">
                {localizedName}
              </h3>
              <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                isDark ? 'bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-400 group-hover:text-black' : 'bg-blue-600/10 text-blue-700 group-hover:bg-blue-600 group-hover:text-white'
              }`}>
                {t.ui.viewPrices}
                <span className="text-sm">→</span>
              </div>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className={`absolute inset-0 backface-hidden rounded-[2.5rem] border-2 p-8 shadow-2xl flex flex-col rotate-y-180 overflow-hidden ${
          isDark 
            ? 'bg-[#0a0d14] border-cyan-500/20' 
            : 'bg-blue-50 border-blue-600/20'
        }`}>
          <div className="flex justify-between items-start mb-8">
            <h3 className="font-black text-xl leading-tight uppercase tracking-tight line-clamp-2 flex-1 mr-4">{localizedName}</h3>
            <div onClick={(e) => e.stopPropagation()}>
              <input 
                type="checkbox" 
                checked={isSelected}
                onChange={onToggleSelect}
                className="w-6 h-6 rounded-lg cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
            {sortedPrices.map((p, idx) => (
              <div 
                key={`${p.market}-${idx}`} 
                className={`p-4 rounded-[1.5rem] border transition-all relative overflow-hidden group/price ${
                  idx === 0 
                    ? isDark 
                      ? 'bg-cyan-400/10 border-cyan-400/50 cyber-border' 
                      : 'bg-white border-blue-600/50 shadow-lg'
                    : isDark
                      ? 'bg-white/5 border-white/5 hover:border-white/10'
                      : 'bg-white border-black/5 hover:border-black/10'
                }`}
              >
                {idx === 0 && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/10 blur-2xl" />
                )}
                <div className="flex items-center justify-between mb-1 relative z-10">
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-40">
                    {t.markets[p.market] || p.market}
                  </span>
                  {idx === 0 && (
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${
                      isDark ? 'bg-cyan-400 text-black' : 'bg-blue-600 text-white'
                    }`}>{t.ui.cheapest}</span>
                  )}
                </div>
                <div className={`text-2xl font-black tracking-tighter relative z-10 ${
                  idx === 0 ? isDark ? 'text-cyan-400' : 'text-blue-700' : 'opacity-80'
                }`}>
                  {formatPrice(p.price)}
                </div>
              </div>
            ))}
          </div>

          <button className={`mt-8 py-3 w-full text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all ${
            isDark ? 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white' : 'bg-black/5 text-black/40'
          }`}>
            ← {t.ui.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
