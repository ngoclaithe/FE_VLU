import React from 'react';
import { Link } from 'react-router-dom';

export const Navigation = ({ items, className = '' }) => {
  return (
    <nav className={`flex space-x-6 ${className}`}>
      {items.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className="text-gray-600 hover:text-teal-500 transition-colors duration-200"
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};