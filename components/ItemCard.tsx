import React, { useState, useEffect } from 'react';
import { ItemData, Currency, TranslationStrings } from '../types';
import { getItemImageSrc, DEFAULT_IMAGE, slugify } from '../constants';

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

  const handleImgError = () => {
    const name = item.name;
    const slugWithParens = slugify(name, true);
    const slugWithoutParens = slugify(name, false);

    switch(errorCount) {
      case 0:
        // Try JPG instead of PNG (literal name)
        setImgSrc(`images/${name}.jpg`);
        break;
      case 1:
        // Try Slug with parens PNG
        setImgSrc(`images/${slugWithParens}.png`);
        break;
      case 2:
        // Try Slug without parens PNG
        setImgSrc(`images/${slugWithoutParens}.png`);
        break;
      case 3:
        // Try simple lowercase with dashes
        setImgSrc(`images/${name.toLowerCase().replace(/\s+/g, '-')}.png`);
        break;
      case 4:
        // Try literal name lowercase
        setImgSrc(`images/${name.toLowerCase()}.png`);
        break;
      default:
        setImgSrc(DEFAULT_IMAGE);
        return;
    }
    setErrorCount(prev => prev + 1);
  };

  return (
    <div 
      className="relative h-[420px] w-full group cursor-pointer perspective-1000" 
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front Side */}
        <div 
          className={`absolute inset-0 backface-hidden rounded-2xl border-2 p-6 flex flex-col items-center justify-between shadow-lg overflow-hidden ${
            theme === 'dark' ? 'bg-[#1c2230] border-[#273044]' : 'bg-white border-gray-200'
          }`}
        >
          <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
            <input 
              type="checkbox" 
              checked={isSelected}
              onChange={onToggleSelect}
              className="w-7 h-7 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500 cursor-pointer accent-cyan-400"
            />
          </div>

          <div className="w-full h-48 rounded-xl overflow-hidden bg-black/10 flex items-center justify-center p-2 relative group-hover:bg-black/20 transition-colors">
            <img 
              src={imgSrc} 
              alt={item.name} 
              onError={handleImgError}
              className="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          </div>
          
          <div className="text-center mt-auto w-full">
            <h3 className="font-black text-xl line-clamp-2 leading-tight h-14 flex items-center justify-center">{item.name}</h3>
            <div className="mt-4 inline-block px-4 py-1.5 rounded-full bg-cyan-400/10 text-cyan-400 text-xs font-black uppercase tracking-widest border border-cyan-400/20">
              {t.ui.viewPrices}
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div 
          className={`absolute inset-0 backface-hidden rounded-2xl border-2 p-6 shadow-xl flex flex-col rotate-y-180 ${
            theme === 'dark' ? 'bg-[#161c26] border-cyan-500/50' : 'bg-blue-50 border-blue-500/50'
          }`}
        >
          <div className="flex justify-between items-start mb-4 gap-2">
            <h3 className="font-black text-lg leading-tight line-clamp-2">{item.name}</h3>
            <div onClick={(e) => e.stopPropagation()}>
              <input 
                type="checkbox" 
                checked={isSelected}
                onChange={onToggleSelect}
                className="w-6 h-6 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500 cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pr-1">
            {sortedPrices.map((p, idx) => (
              <div 
                key={`${p.market}-${idx}`} 
                className={`p-3 rounded-xl border-2 transition-all ${
                  idx === 0 
                    ? theme === 'dark' 
                      ? 'bg-cyan-500/10 border-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
                      : 'bg-green-500/10 border-green-500/60'
                    : theme === 'dark'
                      ? 'bg-black/20 border-white/5'
                      : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {idx === 0 && <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-cyan-400 text-black leading-none">{t.ui.cheapest}</span>}
                  <span className="text-[11px] font-bold opacity-60 line-clamp-1">{p.market}</span>
                </div>
                <div className={`text-lg font-black ${idx === 0 ? 'text-cyan-400' : 'opacity-90'}`}>
                  {formatPrice(p.price)}
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 py-2 w-full text-xs font-black uppercase opacity-40 hover:opacity-100 transition-opacity bg-black/10 rounded-lg">
            {t.ui.back}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;