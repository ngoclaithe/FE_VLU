import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Slider = ({ items, renderItem, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((current) => 
      current === items.length - 1 ? 0 : current + 1
    );
  };

  const prev = () => {
    setCurrentIndex((current) => 
      current === 0 ? items.length - 1 : current - 1
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0">
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>
      
      <button 
        className="slide-arrow prev"
        onClick={prev}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button 
        className="slide-arrow next"
        onClick={next}
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};