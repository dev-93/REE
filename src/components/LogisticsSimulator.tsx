'use client';

import { Truck, Navigation, Clock, Save, Play } from 'lucide-react';

export default function LogisticsSimulator() {
    return (
        <div className="absolute top-6 left-24 z-10 w-[400px] flex flex-col gap-4 animate-in slide-in-from-left-4 duration-500">
            {/* Header */}
            <div className="glass p-5 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Truck size={80} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                            <Navigation className="w-5 h-5 text-orange-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">물류 루트 시뮬레이터</h2>
                    </div>
                    <p className="text-sm text-gray-400">
                        최적의 운송 경로를 시뮬레이션하고 비용과 시간을 분석합니다.
                    </p>
                </div>
            </div>

            {/* Controls Placeholder */}
            <div className="glass p-6 rounded-2xl border border-white/10 space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">출발지 (Origin)</label>
                        <select className="w-full bg-[#1a1a1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors">
                            <option>알마티 (Almaty)</option>
                            <option>아스타나 (Astana)</option>
                            <option>쉼켄트 (Shymkent)</option>
                        </select>
                    </div>

                    <div className="flex justify-center">
                        <div className="w-0.5 h-8 bg-gradient-to-b from-white/10 to-white/5 mx-auto"></div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">도착지 (Destination)</label>
                        <select className="w-full bg-[#1a1a1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors">
                            <option>부산항 (Busan Port)</option>
                            <option>인천항 (Incheon Port)</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20 active:scale-95">
                        <Play size={18} fill="currentColor" />
                        <span>시뮬레이션 시작</span>
                    </button>
                </div>
            </div>

            {/* Recent History Placeholder */}
            <div className="glass p-4 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-400">최근 시뮬레이션 이력</span>
                    <Clock size={12} className="text-gray-500" />
                </div>
                <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/10 group">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-200 group-hover:text-orange-400 transition-colors">알마티 → 부산항</span>
                            <span className="text-[10px] text-gray-500">2시간 전</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-gray-400">
                            <span>TCR 노선</span>
                            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                            <span>$4,200/ton</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
