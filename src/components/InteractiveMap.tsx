'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/utils/supabase-client';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

// WKB(Hex) to coordinates converter for PostGIS EWKB (Point & LineString)
const parseWKB = (hex: string) => {
    if (!hex) return null;
    try {
        const bytes = new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
        const view = new DataView(bytes.buffer);
        const isLittleEndian = view.getUint8(0) === 1;

        let offset = 1;
        const type = view.getUint32(offset, isLittleEndian);
        offset += 4;
        const hasSRID = (type & 0x20000000) !== 0;
        const geometryType = type & 0xffff;

        if (hasSRID) offset += 4; // Skip SRID

        if (geometryType === 1) {
            // POINT
            const lng = view.getFloat64(offset, isLittleEndian);
            const lat = view.getFloat64(offset + 8, isLittleEndian);
            return { type: 'Point', coordinates: [lng, lat] as [number, number] };
        } else if (geometryType === 2) {
            // LINESTRING
            const numPoints = view.getUint32(offset, isLittleEndian);
            offset += 4;
            const points = [];
            for (let i = 0; i < numPoints; i++) {
                const lng = view.getFloat64(offset, isLittleEndian);
                const lat = view.getFloat64(offset + 8, isLittleEndian);
                points.push([lng, lat]);
                offset += 16;
            }
            return { type: 'LineString', coordinates: points as [number, number][] };
        }
        return null;
    } catch (e) {
        console.error('WKB parse error:', e);
        return null;
    }
};

export default function InteractiveMap() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        console.log('🗺️ InteractiveMap useEffect 시작');
        console.log('Mapbox Token:', mapboxgl.accessToken ? '✅ 존재함' : '❌ 없음');
        console.log('Map Container:', mapContainer.current ? '✅ 존재함' : '❌ 없음');
        
        if (map.current || !mapContainer.current) {
            console.log('⏭️ 이미 초기화됨 또는 컨테이너 없음');
            return;
        }

        console.log('🎨 Mapbox 인스턴스 생성 중...');

        try {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12', // 더 명확한 스타일로 변경
                center: [67.8, 48.0],
                zoom: 4,
                pitch: 0, // pitch를 0으로 설정하여 2D로 확인
                trackResize: true,
            });

            console.log('✅ Mapbox 인스턴스 생성 완료');

            map.current.on('load', async () => {
                console.log('🎉 Mapbox 로드 완료!');
                map.current?.resize();
                
                // 카자흐스탄 국경 하이라이트 추가
                try {
                    const response = await fetch('/kazakhstan-border.json');
                    const kazakhstanGeoJSON = await response.json();
                    
                    map.current?.addSource('kazakhstan-border', {
                        type: 'geojson',
                        data: kazakhstanGeoJSON
                    });
                    
                    // 굵은 테두리만 표시
                    map.current?.addLayer({
                        id: 'kazakhstan-outline',
                        type: 'line',
                        source: 'kazakhstan-border',
                        paint: {
                            'line-color': '#3b82f6',
                            'line-width': 3,
                            'line-opacity': 0.8
                        }
                    });
                    
                    console.log('✅ 카자흐스탄 국경 레이어 추가 완료');
                } catch (error) {
                    console.error('❌ 국경 데이터 로드 실패:', error);
                }
                
                loadData();
            });

            map.current.on('error', (e) => {
                console.error('❌ Mapbox 오류:', e);
            });

            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        } catch (error) {
            console.error('❌ Mapbox 초기화 실패:', error);
        }

        const loadData = async () => {
            console.log('📊 데이터 로딩 시작...');
            if (!map.current) return;

            // 1. 역 & 광산 데이터 (Markers)
            const [{ data: stations }, { data: mines }] = await Promise.all([
                supabase.from('stations').select('*'),
                supabase.from('mines').select('*'),
            ]);

            console.log('Stations:', stations?.length, 'Mines:', mines?.length);

            stations?.forEach((s: any) => {
                const geo = parseWKB(s.location);
                if (geo?.type === 'Point') {
                    new mapboxgl.Marker({ color: '#3b82f6' })
                        .setLngLat(geo.coordinates as [number, number])
                        .setPopup(
                            new mapboxgl.Popup().setHTML(`
                                <div class="p-2 text-black">
                                    <h3 class="font-bold text-sm text-blue-600">${s.name}</h3>
                                    <p class="text-[10px] mt-1 text-gray-600">처리 능력: ${s.capacity}</p>
                                </div>
                            `)
                        )
                        .addTo(map.current!);
                }
            });

            mines?.forEach((m: any) => {
                const geo = parseWKB(m.location);
                if (geo?.type === 'Point') {
                    // 커스텀 마커 엘리먼트 생성
                    const el = document.createElement('div');
                    el.className = 'custom-marker';
                    el.innerHTML = `
                        <div class="flex flex-col items-center">
                            <span class="text-[10px] font-bold text-white bg-red-600/80 px-1.5 py-0.5 rounded-full mb-1 whitespace-nowrap border border-red-400/50 shadow-sm backdrop-blur-sm">
                                ${m.name}
                            </span>
                            <div class="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-md animate-pulse"></div>
                        </div>
                    `;

                    new mapboxgl.Marker({ element: el, anchor: 'bottom' })
                        .setLngLat(geo.coordinates as [number, number])
                        .setPopup(
                            new mapboxgl.Popup({ offset: 25 }).setHTML(`
                                <div class="p-2 text-black">
                                    <h3 class="font-bold text-sm text-red-600">${m.name}</h3>
                                    <p class="text-[10px] mt-1 text-gray-600">자원: ${m.mineral_type}</p>
                                </div>
                            `)
                        )
                        .addTo(map.current!);
                }
            });

            // 2. 철도 노선 데이터 (Layers)
            const { data: rails } = await supabase.from('rail_lines').select('*');
            console.log('Rail lines:', rails?.length);
            
            rails?.forEach((r: any, idx: number) => {
                const geo = parseWKB(r.route);
                if (geo?.type === 'LineString') {
                    const sourceId = `rail-${idx}`;
                    const isTCR = r.name.includes('TCR');
                    
                    if (map.current?.getSource(sourceId)) return;

                    map.current?.addSource(sourceId, {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            properties: { name: r.name },
                            geometry: {
                                type: 'LineString',
                                coordinates: geo.coordinates as any,
                            },
                        },
                    });

                    map.current?.addLayer({
                        id: `${sourceId}-layer`,
                        type: 'line',
                        source: sourceId,
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round',
                        },
                        paint: {
                            'line-color': isTCR ? '#60a5fa' : '#fb923c',
                            'line-width': 3,
                            'line-opacity': 0.8,
                        },
                    });
                }
            });

            console.log('✅ 데이터 로딩 완료');
        };

        return () => {
            console.log('🧹 Mapbox 정리 중...');
            map.current?.remove();
        };
    }, []);

    return (
        <div className="absolute inset-0">
            <div ref={mapContainer} className="absolute inset-0 z-0" />

            <div className="absolute bottom-6 left-6 glass p-4 rounded-xl z-10 border border-white/10">
                <h3 className="text-sm font-semibold text-white mb-1">카자흐스탄-한국 공급망</h3>
                <p className="text-xs text-gray-400">실시간 광산 및 물류 거점 데이터</p>
                <div className="mt-3 flex flex-col gap-2 text-[10px]">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span className="text-gray-300">물류 거점 (Station)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            <span className="text-gray-300">희토류 광산 (Mine)</span>
                        </div>
                    </div>
                    <div className="w-full h-px bg-white/10 my-1"></div>
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                            <span className="w-4 h-0.5 bg-blue-400"></span>
                            <span className="text-blue-200">중국 횡단 철도 (TCR)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-4 h-0.5 bg-orange-400"></span>
                            <span className="text-orange-200">중간 회랑 (TITR)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
