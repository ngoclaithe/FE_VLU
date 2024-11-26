import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(''); 
  useEffect(() => {
    const role = sessionStorage.getItem('role'); 
    if (role) {
      setUserRole(role);
    } else {
      setUserRole('teacher'); 
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <Sidebar isOpen={sidebarOpen} role={userRole} />
      
      <main className="flex-1 ml-0 lg:ml-64 pt-16 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};
