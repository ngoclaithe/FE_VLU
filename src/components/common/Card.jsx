import React from 'react';

export const Card = ({ image, title, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>

      <img 
        src={image} 
        alt={title} 
        className="w-64 h-48 object-cover mx-auto" 
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
      </div>
    </div>
  );
};
