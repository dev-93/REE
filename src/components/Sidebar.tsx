import {
    LayoutDashboard,
    Map as MapIcon,
    Database,
    TrendingUp,
    Ship,
    Settings,
} from 'lucide-react';

const menuItems = [
    { icon: LayoutDashboard, label: '개요', active: true },
    { icon: MapIcon, label: '공급망 지도', active: false },
    { icon: Ship, label: '물류 루트 시뮬레이터', active: false },
    { icon: TrendingUp, label: '희토류 시세 분석', active: false },
    { icon: Database, label: '광산 데이터베이스', active: false },
];

export default function Sidebar() {
    return (
        <aside className="w-64 h-screen glass border-r border-white/10 flex flex-col p-6 z-20">
            <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                    <Ship className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-lg tracking-tight">REE Chain</span>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.label}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                            item.active
                                ? 'bg-primary/20 text-primary border border-primary/30'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <item.icon size={20} />
                        <span className="text-sm font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/10">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white transition-colors">
                    <Settings size={20} />
                    <span>환경 설정</span>
                </button>
            </div>
        </aside>
    );
}
