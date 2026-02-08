'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase-client';
import { Database, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DBStatusWidget() {
    const [status, setStatus] = useState<{
        stations: number;
        mines: number;
        loading: boolean;
        error: string | null;
    }>({
        stations: 0,
        mines: 0,
        loading: true,
        error: null,
    });

    useEffect(() => {
        const checkDB = async () => {
            try {
                // Fetch all stations to filter by info.korea
                const { data: stations, error: sError } = await supabase
                    .from('stations')
                    .select('*');

                const { count: mCount, error: mError } = await supabase
                    .from('mines')
                    .select('*', { count: 'exact', head: true });

                if (sError || mError) throw new Error('DB 연결 실패');

                // Filter out Korean ports (logistics hubs only)
                const kzHubs = stations?.filter((s: any) => !s.info?.korea).length || 0;

                setStatus({
                    stations: kzHubs,
                    mines: mCount || 0,
                    loading: false,
                    error: null,
                });
            } catch (err: any) {
                setStatus((prev) => ({ ...prev, loading: false, error: err.message }));
            }
        };

        checkDB();
    }, []);

    return (
        <div className="glass p-5 rounded-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Database size={14} className="text-primary" />
                    <span className="text-xs text-gray-400">데이터 연동 상태</span>
                </div>
                {!status.loading && !status.error ? (
                    <CheckCircle2 size={12} className="text-green-500" />
                ) : status.error ? (
                    <AlertCircle size={12} className="text-red-500" />
                ) : null}
            </div>

            {status.loading ? (
                <div className="text-sm text-gray-500 italic">연결 확인 중...</div>
            ) : status.error ? (
                <div className="text-sm text-red-400">{status.error}</div>
            ) : (
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-sm font-medium text-white">
                        <span>주요 물류 거점</span>
                        <span className="text-primary">{status.stations}개</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium text-white">
                        <span>희토류 광산</span>
                        <span className="text-primary">{status.mines}개</span>
                    </div>
                </div>
            )}
        </div>
    );
}
