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
                        광산에서 항구까지의 최적 운송 경로를 산출합니다.
                    </p>
                </div>
            </div>

            {/* Controls Placeholder */}
            <div className="glass p-6 rounded-2xl border border-white/10 space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">출발지 (Origin: Mine/Hub)</label>
                        <select className="w-full bg-[#1a1a1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors">
                            <option value="">출발지를 선택하세요</option>
                            <optgroup label="🧲 자석/모터용 (Magnet: Rare Earths)">
                                <option value="Verkhne-Espe">베르크네-에스페 (Verkhne-Espe) - 중희토류</option>
                                <option value="Akbulak">아크불락 (Akbulak) - 경희토류</option>
                                <option value="Kundybai">쿤디바이 (Kundybai) - 희토류</option>
                            </optgroup>
                            <optgroup label="🔋 배터리용 (Battery: Lithium)">
                                <option value="Bakeno">바케노 (Bakeno) - 리튬/탄탈륨</option>
                                <option value="Kuyrekti-Kol">쿠이레크티콜 (Kuyrekti-Kol) - 리튬</option>
                            </optgroup>
                            <optgroup label="🇰🇿 주요 거점 (Logistics Hubs)">
                                <option value="Almaty">알마티 (Almaty)</option>
                                <option value="Astana">아스타나 (Astana)</option>
                                <option value="Dostyk">도스틱 (Dostyk)</option>
                            </optgroup>
                        </select>
                    </div>

                    {/* Connection Info Display (Visual Only for now) */}
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                            <span>예상 연결 경로 (First Mile)</span>
                        </div>
                        <p className="text-sm text-gray-300 pl-3.5 border-l border-white/10 ml-0.5">
                            광산을 선택하면 로컬 거점역이 자동 지정됩니다.<br/>
                            <span className="text-gray-500 text-xs">(예: 바케노 → 장기즈-토베, 40km 트럭)</span>
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <div className="w-0.5 h-6 bg-gradient-to-b from-white/10 to-white/5 mx-auto"></div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">도착지 (Destination)</label>
                        <select 
                            defaultValue="Busan"
                            className="w-full bg-[#1a1a1e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                        >
                            <option value="">도착지를 선택하세요</option>
                            <optgroup label="🇰🇷 대한민국 주요 항구">
                                <option value="Busan">부산항 (Busan Port)</option>
                                <option value="Incheon">인천항 (Incheon Port)</option>
                                <option value="Pyeongtaek">평택·당진항</option>
                                <option value="Gwangyang">광양항</option>
                                <option value="Pohang">포항영일만항</option>
                            </optgroup>
                        </select>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20 active:scale-95">
                        <Play size={18} fill="currentColor" />
                        <span>루트 분석 및 시뮬레이션</span>
                    </button>
                </div>
            </div>

            {/* Recent History Placeholder */}
            <div className="glass p-4 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-400">추천 루트 (AI Recommendation)</span>
                    <Clock size={12} className="text-gray-500" />
                </div>
                <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-orange-500/30 group">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-200 group-hover:text-orange-400 transition-colors">바케노 → 부산항 (TCR)</span>
                            <span className="text-[10px] text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded">BEST</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                            <span>Truck(40km)</span>
                            <span>→</span>
                            <span>Rail(4,500km)</span>
                            <span>→</span>
                            <span>Ship</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
