'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/utils/supabase-client';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export default function InteractiveMap() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/navigation-night-v1',
            center: [67.8, 48.0], // Kazakhstan center tweaked
            zoom: 4,
            pitch: 45,
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // DB에서 데이터 가져오기 및 마커 표시
        const loadMarkers = async () => {
            // 1. 역(Stations) 데이터
            const { data: stations } = await supabase.from('stations').select('*');
            stations?.forEach((s: any) => {
                // location is a WKB or text depending on setting, but Supabase geography usually returns as GeoJSON or lat/lng
                // Since we used geography(point), it might need parsing if returned as string
                const coords = s.location.match(/\((.*)\)/)[1].split(' ');
                const lng = parseFloat(coords[0]);
                const lat = parseFloat(coords[1]);

                new mapboxgl.Marker({ color: '#3b82f6' })
                    .setLngLat([lng, lat])
                    .setPopup(
                        new mapboxgl.Popup().setHTML(`
            <div class="p-2 text-black">
              <h3 class="font-bold text-sm text-blue-600">${s.name}</h3>
              <p class="text-[10px] mt-1">처리 능력: ${s.capacity}</p>
            </div>
          `)
                    )
                    .addTo(map.current!);
            });

            // 2. 광산(Mines) 데이터
            const { data: mines } = await supabase.from('mines').select('*');
            mines?.forEach((m: any) => {
                const coords = m.location.match(/\((.*)\)/)[1].split(' ');
                const lng = parseFloat(coords[0]);
                const lat = parseFloat(coords[1]);

                new mapboxgl.Marker({ color: '#ef4444' })
                    .setLngLat([lng, lat])
                    .setPopup(
                        new mapboxgl.Popup().setHTML(`
            <div class="p-2 text-black">
              <h3 class="font-bold text-sm text-red-600">${m.name}</h3>
              <p class="text-[10px] mt-1">자원 종류: ${m.mineral_type}</p>
            </div>
          `)
                    )
                    .addTo(map.current!);
            });
        };

        map.current.on('style.load', loadMarkers);

        return () => {
            map.current?.remove();
        };
    }, []);

    return (
        <div className="relative w-full h-full">
            <div ref={mapContainer} className="absolute inset-0" />
            <div className="absolute bottom-6 left-6 glass p-4 rounded-xl z-10 border border-white/10">
                <h3 className="text-sm font-semibold text-white mb-1">카자흐스탄-한국 공급망</h3>
                <p className="text-xs text-gray-400">실시간 광산 및 물류 거점 데이터</p>
                <div className="mt-3 flex gap-4 text-[10px]">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span className="text-gray-300">물류 거점(Station)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span className="text-gray-300">희토류 광산(Mine)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
