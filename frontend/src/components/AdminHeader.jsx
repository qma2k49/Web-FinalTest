import React, { useState, useEffect } from 'react';
import { User, Bell, LogOut, Settings } from 'lucide-react';

const AdminHeader = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    const pad = (num) => String(num).padStart(2, '0');
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <header className="h-16 border-b border-gray-100 bg-white px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-indigo-50 rounded-xl shadow-inner text-indigo-600">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M12 8v8" />
            <path d="M8 11h8" />
            <path d="M6 9l6-3 6 3-6 3-6-3z" fill="currentColor" fillOpacity="0.2" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-indigo-900">
            School <span className="text-indigo-600">System</span>
          </span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3 text-sm text-gray-500 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
        <span className="font-mono text-indigo-600 font-semibold">
          {formatDateTime(time)}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-xs text-gray-400 font-medium">Hệ thống đang hoạt động</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-gray-100 group cursor-pointer relative">
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-500 leading-none">Admin</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-black tracking-wider text-white bg-rose-600 rounded-md shadow-sm">
              ADMIN
            </span>
          </div>

          <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-200">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
