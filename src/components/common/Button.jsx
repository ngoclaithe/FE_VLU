import React from 'react';

export const Button = ({ children, className, ...props }) => {
  return (
    <button 
      className={`px-4 py-2 rounded-full transition-colors duration-200 ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;