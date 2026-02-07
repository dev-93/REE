import Sidebar from '@/components/Sidebar';
import InteractiveMap from '@/components/InteractiveMap';
import DBStatusWidget from '@/components/DBStatusWidget';

export default function Home() {
    return (
        <main className="flex h-screen overflow-hidden bg-[#0a0a0c]">
            <Sidebar />
            <div className="flex-1 relative">
                <InteractiveMap />

                {/* Real-time Stats Overlay */}
                <div className="absolute top-6 right-6 flex flex-col gap-4 z-10 min-w-[280px]">
                    <DBStatusWidget />
                    <div className="glass p-5 rounded-2xl flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">희토류(Nd) 실시간 시세</span>
                            <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                                +1.2%
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                            $75,420 <span className="text-sm font-normal text-gray-500">/ton</span>
                        </div>
                    </div>

                    <div className="glass p-5 rounded-2xl flex flex-col gap-3">
                        <span className="text-xs text-gray-400">비중국산 공급망 안정성 점수</span>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-primary">8.5</span>
                            <span className="text-sm text-gray-500 mb-1">/ 10</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-[85%]" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
