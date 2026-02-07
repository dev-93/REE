'use client';

import { useState } from 'react';
import {
    LayoutDashboard,
    Map as MapIcon,
    Database,
    TrendingUp,
    Ship,
    Settings,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

const menuItems = [
    { icon: LayoutDashboard, label: '개요', active: true },
    { icon: MapIcon, label: '공급망 지도', active: false },
    { icon: Ship, label: '물류 루트 시뮬레이터', active: false },
    { icon: TrendingUp, label: '희토류 시세 분석', active: false },
    { icon: Database, label: '광산 데이터베이스', active: false },
];

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <aside 
            className={`${
                isOpen ? 'w-64' : 'w-20'
            } h-screen glass border-r border-white/10 flex flex-col p-4 z-20 transition-all duration-300 relative`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -right-3 top-9 bg-[#1a1a1e] border border-white/20 rounded-full p-1 text-gray-400 hover:text-white transition-colors z-50 shadow-md"
            >
                {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>

            <div className={`flex items-center gap-3 mb-10 ${isOpen ? 'px-2' : 'justify-center'}`}>
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                    <Ship className="text-white w-5 h-5" />
                </div>
                {isOpen && (
                    <span className="font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden animate-in fade-in duration-300">
                        REE Chain
                    </span>
                )}
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.label}
                        className={`w-full flex items-center ${
                            isOpen ? 'gap-3 px-4' : 'justify-center px-0'
                        } py-3 rounded-lg transition-all ${
                            item.active
                                ? 'bg-primary/20 text-primary border border-primary/30'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                        title={!isOpen ? item.label : ''}
                    >
                        <item.icon size={20} className="shrink-0" />
                        {isOpen && (
                            <span className="text-sm font-medium whitespace-nowrap overflow-hidden animate-in fade-in duration-300">
                                {item.label}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/10">
                <button 
                    className={`w-full flex items-center ${
                        isOpen ? 'gap-3 px-4' : 'justify-center px-0'
                    } py-3 text-sm text-gray-400 hover:text-white transition-colors`}
                    title={!isOpen ? '환경 설정' : ''}
                >
                    <Settings size={20} className="shrink-0" />
                    {isOpen && (
                        <span className="whitespace-nowrap overflow-hidden animate-in fade-in duration-300">
                            환경 설정
                        </span>
                    )}
                </button>
            </div>
        </aside>
    );
}
