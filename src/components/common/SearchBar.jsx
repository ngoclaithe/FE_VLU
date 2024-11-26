import React from 'react';
import { SearchIcon } from 'lucide-react';
import Button from './Button';
export const SearchBar = ({ placeholder = "Tìm kiếm...", onSearch }) => {
  return (
    <div className="bg-white rounded-full flex items-center p-2 w-full max-w-xl">
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 px-4 py-2 outline-none text-gray-700 bg-transparent"
      />
      <Button 
        className="bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600"
        onClick={onSearch}
      >
        <SearchIcon className="w-6 h-6" />
      </Button>
    </div>
  );
};