'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function LeftMenu() {
  const pathname = usePathname();
  
  const menuItems = [
    { name: 'Homepage', path: '/', icon: '🏠' },
    { name: 'Study Groups', path: '/groups', icon: '👥' },
    { name: 'Notes', path: '/notes', icon: '📝' },
    { name: 'Statistics', path: '/stats', icon: '📈' },
    { name: 'Marketplace', path: '/marketplace', icon: '🛍️' },
    { name: 'Profile', path: '/profile', icon: '🏅' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <div className="bg-white border-r border-gray-100 min-h-screen p-4 flex flex-col w-56">
      <div className="mb-10 mt-2">
        <div className="h-1 w-12 bg-green-500 rounded-full mb-1"></div>
        <div className="h-1 w-8 bg-green-300 rounded-full"></div>
      </div>
      
      <nav className="w-full">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                href={item.path}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-all ${
                  pathname === item.path 
                    ? 'bg-green-50 text-green-700 font-medium shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <span className="text-lg w-7">{item.icon}</span>
                <span className="ml-3">{item.name}</span>
                {pathname === item.path && (
                  <div className="ml-auto w-1.5 h-5 bg-green-500 rounded-full"></div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto pt-6 pb-4">
        <div className="px-3 py-2 bg-green-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              🔥
            </div>
            <div className="ml-3">
              <p className="text-xs text-green-800 font-medium">Study streak</p>
              <p className="text-sm text-green-700 font-bold">5 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
)}