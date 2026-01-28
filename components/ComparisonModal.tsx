
import React from 'react';
import { ItemData, Currency, TranslationStrings } from '../types';
import { getItemImageSrc, DEFAULT_IMAGE } from '../constants';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ItemData[];
  currency: Currency;
  theme: 'dark' | 'light';
  t: TranslationStrings;
  isRtl: boolean;
}

const ComparisonItem: React.FC<{
  item: ItemData;
  currency: Currency;
  theme: 'dark' | 'light';
  t: TranslationStrings;
}> = ({ item, currency, theme, t }) => {
  const [imgSrc, setImgSrc] = React.useState(getItemImageSrc(item.name));

  const handleImgError = () => {
    if (imgSrc.endsWith('.png')) {
      setImgSrc(imgSrc.replace('.png', '.jpg'));
    } else if (imgSrc !== DEFAULT_IMAGE) {
      setImgSrc(DEFAULT_IMAGE);
    }
  };

  const formatPrice = (p: number) => {
    const val = (p * currency.rate).toFixed(currency.prec);
    return currency.pos === 'prefix' ? `${currency.symbol}${val}` : `${val} ${currency.symbol}`;
  };

  const sortedPrices = [...item.prices].sort((a, b) => a.price - b.price);

  return (
    <div className={`p-6 rounded-2xl border min-w-[300px] flex flex-col ${
      theme === 'dark' ? 'bg-[#1c2230] border-[#273044]' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-xl bg-black/10 p-2 flex items-center justify-center overflow-hidden">
          <img 
            src={imgSrc} 
            alt={item.name} 
            onError={handleImgError}
            className="max-w-full max-h-full object-contain" 
          />
        </div>
        <h3 className="font-black text-xl leading-tight line-clamp-2">{item.name}</h3>
      </div>

      <div className="space-y-3">
        {sortedPrices.map((p, idx) => (
          <div key={`${p.market}-${idx}`} className={`flex flex-col p-3 rounded-lg border ${
            idx === 0 
            ? theme === 'dark' ? 'bg-cyan-500/10 border-cyan-400' : 'bg-green-50 border-green-200'
            : theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase opacity-60 line-clamp-1">{p.market}</span>
              {idx === 0 && <span className="text-[10px] font-black uppercase text-cyan-400">{t.ui.cheapest}</span>}
            </div>
            <span className={`text-lg font-black ${idx === 0 ? 'text-cyan-400' : ''}`}>
              {formatPrice(p.price)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose, items, currency, theme, t, isRtl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl border-2 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col ${
        theme === 'dark' ? 'bg-[#161a22] border-[#273044]' : 'bg-white border-gray-200'
      }`}>
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-2xl font-black">{t.ui.selectedItems}</h2>
          <button 
            onClick={onClose}
            className="p-2 px-4 rounded-full hover:bg-gray-500/10 transition-all font-bold flex items-center gap-2"
          >
            <span>✕</span>
            <span>{t.ui.close}</span>
          </button>
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-auto p-6 custom-scrollbar">
          <div className="flex gap-6 min-w-full lg:grid lg:grid-cols-3">
            {items.map(item => (
              <ComparisonItem 
                key={item.id} 
                item={item} 
                currency={currency} 
                theme={theme} 
                t={t} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;
