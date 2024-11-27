import React, { useState, useEffect } from 'react';
import { Bell, Menu, User, LogOut } from 'lucide-react';
import logo from '../../assets/vlu_logo.png';

export const Header = ({ toggleSidebar }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userInfo, setUserInfo] = useState({ email: '', role: '' });

  useEffect(() => {
    const email = sessionStorage.getItem('email');
    const role = sessionStorage.getItem('role');
    setUserInfo({ email, role });
  }, []);

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <Menu size={24} />
          </button>
          <div className="ml-4 flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-16 w-16 rounded"
            />
            <span className="text-2xl font-bold text-red-500 ml-4">ĐẠI HỌC VĂN LANG</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
            >
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">{userInfo.email}</p>
                <p className="text-xs text-gray-500">{userInfo.role}</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                <a href="/logout" className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-100">
                  <LogOut size={16} className="mr-2" />
                  Đăng xuất
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};