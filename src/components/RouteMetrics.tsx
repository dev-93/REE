'use client';

import { MapPin, Clock, TrendingUp } from 'lucide-react';

interface RouteMetricsProps {
    totalDistance: number;
    estimatedTime: number; // in hours
}

export default function RouteMetrics({ totalDistance, estimatedTime }: RouteMetricsProps) {
    const days = Math.floor(estimatedTime / 24);
    const hours = Math.round(estimatedTime % 24);

    return (
        <div className="absolute bottom-6 right-6 z-20 w-[300px] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="glass p-5 rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative">
                {/* Background Decor */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">물류 경로 분석 결과</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
                                <MapPin size={12} />
                                <span>총 운송 거리</span>
                            </div>
                            <div className="flex items-end gap-1">
                                <span className="text-xl font-bold text-white">{totalDistance.toLocaleString()}</span>
                                <span className="text-xs text-gray-400 mb-1">km</span>
                            </div>
                        </div>

                        <div className="space-y-1 text-right">
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium justify-end">
                                <Clock size={12} />
                                <span>예상 소요 시간</span>
                            </div>
                            <div className="flex items-end gap-1 justify-end">
                                <span className="text-xl font-bold text-primary">
                                    {days > 0 ? `${days}d ${hours}h` : `${hours}h`}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <p className="text-[10px] text-gray-400 leading-relaxed italic">
                            * Haversine 공식을 이용한 직선 거리 기준이며, 평균 속도(60km/h 트럭, 50km/h 철도)를 적용한 추정치입니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
