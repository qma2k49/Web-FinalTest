import React, { useState } from 'react';
import {
    BarChart3,
    BookOpen,
    Users,
    UserSquare2,
    Database,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

const AdminSidebar = ({ currentTab, setCurrentTab }) => {
    const [expandedMenus, setExpandedMenus] = useState({
        duLieu: true
    });

    const toggleSubmenu = (menu) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    const navItems = [
        {
            id: 'thongKe',
            label: 'Thống kê',
            icon: BarChart3,
            interactive: false
        },
        {
            id: 'lopHoc',
            label: 'Lớp học',
            icon: BookOpen,
            interactive: false
        },
        {
            id: 'hocSinh',
            label: 'Học sinh',
            icon: Users,
            interactive: false
        },
        {
            id: 'giaoVien',
            label: 'Giáo viên',
            icon: UserSquare2,
            interactive: true,
            hasSubmenu: false
        },
        {
            id: 'duLieu',
            label: 'Dữ liệu',
            icon: Database,
            interactive: true,
            hasSubmenu: true,
            submenuItems: [
                { id: 'viTriCongTac', label: 'Vị trí công tác' }
            ]
        }
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-100 min-h-[calc(100vh-4rem)] flex flex-col justify-between py-6 select-none shrink-0">
            <div className="flex flex-col gap-1 px-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isSelected = currentTab === item.id;
                    const isExpanded = expandedMenus[item.id];

                    return (
                        <div key={item.id} className="flex flex-col">
                            <button
                                onClick={() => {
                                    if (!item.interactive) return;
                                    if (item.hasSubmenu) {
                                        toggleSubmenu(item.id);
                                    } else {
                                        setCurrentTab(item.id);
                                    }
                                }}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${item.interactive
                                        ? isSelected && !item.hasSubmenu
                                            ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50 cursor-pointer'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600 cursor-pointer'
                                        : 'text-gray-400 cursor-default'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`w-5 h-5 ${item.interactive && isSelected && !item.hasSubmenu ? 'text-indigo-600' : 'text-gray-400'}`} />
                                    <span>{item.label}</span>
                                </div>
                                {item.interactive && item.hasSubmenu && (
                                    isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />
                                )}
                            </button>

                            {item.interactive && item.hasSubmenu && isExpanded && (
                                <div className="mt-1 ml-6 pl-3 border-l-2 border-indigo-50 flex flex-col gap-1">
                                    {item.submenuItems.map((subItem) => {
                                        const isSubSelected = currentTab === subItem.id;
                                        return (
                                            <button
                                                key={subItem.id}
                                                onClick={() => setCurrentTab(subItem.id)}
                                                className={`w-full text-left px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${isSubSelected
                                                        ? 'bg-indigo-50 text-indigo-600 font-bold'
                                                        : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50/50'
                                                    }`}
                                            >
                                                {subItem.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="px-6 py-4 border-t border-gray-50 text-center">
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Học kỳ I • 2026-2027</p>
            </div>
        </aside>
    );
};

export default AdminSidebar;
