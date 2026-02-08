'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/utils/supabase-client';
import RouteMetrics from './RouteMetrics';

// Haversine formula to calculate distance between two points in km
const haversine = (c1: [number, number], c2: [number, number]) => {
    const R = 6371; // Earth radius in km
    const dLat = (c2[1] - c1[1]) * Math.PI / 180;
    const dLon = (c2[0] - c1[0]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(c1[1] * Math.PI / 180) * Math.cos(c2[1] * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

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

interface InteractiveMapProps {
    activeTab?: string;
}

export default function InteractiveMap({ activeTab }: InteractiveMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const stationMarkers = useRef<mapboxgl.Marker[]>([]);
    const mineMarkers = useRef<mapboxgl.Marker[]>([]);
    const [metrics, setMetrics] = useState<{ dist: number; time: number } | null>(null);

    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        try {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [67.8, 48.0],
                zoom: 4,
                trackResize: true,
            });

            map.current.on('load', async () => {
                map.current?.resize();
                
                // Add Country Borders
                const addBorder = async (url: string, id: string) => {
                    try {
                        const response = await fetch(url);
                        const data = await response.json();
                        map.current?.addSource(`${id}-border`, { type: 'geojson', data });
                        map.current?.addLayer({
                            id: `${id}-outline`,
                            type: 'line',
                            source: `${id}-border`,
                            paint: { 'line-color': '#3b82f6', 'line-width': 3, 'line-opacity': 0.8 }
                        });
                    } catch (e) {
                        console.error(`Failed to load border: ${id}`, e);
                    }
                };
                addBorder('/kazakhstan-border.json', 'kazakhstan');
                addBorder('/south-korea-border.json', 'korea');

                loadData();
            });

            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        } catch (error) {
            console.error('Mapbox initialization failed:', error);
        }

        const loadData = async () => {
            if (!map.current) return;

            const [{ data: stations }, { data: mines }] = await Promise.all([
                supabase.from('stations').select('*'),
                supabase.from('mines').select('*'),
            ]);

            // Clear markers
            stationMarkers.current.forEach(m => m.remove());
            mineMarkers.current.forEach(m => m.remove());
            stationMarkers.current = [];
            mineMarkers.current = [];

            // Add Station Markers
            stations?.forEach((s: any) => {
                const geo = parseWKB(s.location);
                if (geo?.type === 'Point' && !s.info?.waypoint) {
                    const isKorea = s.info?.korea;
                    const markerColor = isKorea ? '#6366f1' : '#3b82f6';
                    const m = new mapboxgl.Marker({ color: markerColor })
                        .setLngLat(geo.coordinates as [number, number])
                        .setPopup(new mapboxgl.Popup().setHTML(`<div class="p-2 text-black"><h3 class="font-bold text-sm text-blue-600">${isKorea ? '🇰🇷 ' : '🇰🇿 '}${s.name}</h3><p class="text-[10px] mt-1 text-gray-600">처리 능력: ${s.capacity}</p></div>`))
                        .addTo(map.current!);
                    stationMarkers.current.push(m);
                }
            });

            // Add Mine Markers
            mines?.forEach((m: any) => {
                const geo = parseWKB(m.location);
                if (geo?.type === 'Point') {
                    const el = document.createElement('div');
                    el.className = 'custom-marker group cursor-pointer';
                    el.innerHTML = `
                        <div class="flex flex-col items-center transition-transform hover:scale-110">
                            <span class="text-[11px] font-bold text-white bg-red-600 px-2 py-0.5 rounded-full mb-1 whitespace-nowrap border border-red-400 shadow-sm z-10">
                                ${m.name}
                            </span>
                            <div class="relative w-4 h-4">
                                <div class="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                                <div class="relative w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-md"></div>
                            </div>
                        </div>
                    `;
                    const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
                        .setLngLat(geo.coordinates as [number, number])
                        .setPopup(new mapboxgl.Popup({ offset: 25, maxWidth: '300px' }).setHTML(`<div class="p-3 text-sm bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-100 font-sans"><h3 class="font-bold text-base text-gray-900 border-b pb-2 mb-2 flex items-center justify-between">${m.name}<span class="text-xs font-normal text-white bg-red-500 px-1.5 py-0.5 rounded">${m.mineral_type}</span></h3></div>`))
                        .addTo(map.current!);
                    mineMarkers.current.push(marker);
                }
            });

            // Route Visualization (Visible only in Simulator mode)
            const showRoute = activeTab === 'simulator';
            const visibility = showRoute ? 'visible' : 'none';

            const bakenoMine = mines?.find((m: any) => m.name.includes('Bakeno'));
            const kzRailNames = ['Zhangiz-Tobe', 'Almaty', 'Kyzylorda', 'Beyneu', 'Mangystau', 'Aktau'];
            const internationalNames = ['Baku', 'Tbilisi', 'Poti', 'Bosphorus Strait', 'Dardanelles Strait', 'Aegean Sea', 'Mediterranean Sea', 'Suez Canal', 'Bab el-Mandeb', 'Sri Lanka', 'Singapore', 'Busan'];
            
            const kzRailNodes = kzRailNames.map(name => stations?.find((s: any) => s.name?.toUpperCase().includes(name.toUpperCase()))).filter(Boolean);
            const maritimeNodes = internationalNames.map(name => stations?.find((s: any) => s.name?.toUpperCase().includes(name.toUpperCase()))).filter(Boolean);

            if (bakenoMine && kzRailNodes.length > 0) {
                let totalD = 0;
                let totalT = 0;

                // 1. Truck
                const minePos = (parseWKB(bakenoMine.location)?.coordinates || [bakenoMine.lng, bakenoMine.lat]) as [number, number];
                const firstStationPos = (parseWKB(kzRailNodes[0].location)?.coordinates || [kzRailNodes[0].lng, kzRailNodes[0].lat]) as [number, number];
                
                map.current?.addSource('truck-route', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [minePos, firstStationPos] } } });
                map.current?.addLayer({ id: 'truck-layer', type: 'line', source: 'truck-route', layout: { visibility }, paint: { 'line-color': '#9ca3af', 'line-width': 4, 'line-dasharray': [2, 2] } });
                
                const dT = haversine(minePos, firstStationPos);
                totalD += dT; totalT += dT / 60;

                // 2. KZ Rail
                const railCoords = kzRailNodes.map(s => (parseWKB(s.location)?.coordinates || [s.lng, s.lat]) as [number, number]);
                map.current?.addSource('rail-route', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: railCoords } } });
                map.current?.addLayer({ id: 'rail-layer', type: 'line', source: 'rail-route', layout: { visibility }, paint: { 'line-color': '#3b82f6', 'line-width': 6 } });
                
                for (let i = 0; i < railCoords.length - 1; i++) {
                    const d = haversine(railCoords[i], railCoords[i+1]);
                    totalD += d; totalT += d / 50;
                }

                // 3. Ferry (Aktau -> Baku)
                const aktau = kzRailNodes[kzRailNodes.length-1];
                const bakuNode = maritimeNodes[0];
                if (aktau && bakuNode) {
                    const aktauPos = (parseWKB(aktau.location)?.coordinates || [aktau.lng, aktau.lat]) as [number, number];
                    const bakuPos = (parseWKB(bakuNode.location)?.coordinates || [bakuNode.lng, bakuNode.lat]) as [number, number];
                    map.current?.addSource('ferry-route', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [aktauPos, bakuPos] } } });
                    map.current?.addLayer({ id: 'ferry-layer', type: 'line', source: 'ferry-route', layout: { visibility }, paint: { 'line-color': '#6366f1', 'line-width': 3, 'line-dasharray': [2, 2] } });
                    const dF = haversine(aktauPos, bakuPos);
                    totalD += dF; totalT += dF / 25;
                }

                // 4. International
                const intNodeCoords = maritimeNodes.map(s => (parseWKB(s?.location)?.coordinates || [s?.lng, s?.lat]) as [number, number]);
                map.current?.addSource('maritime-route', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: intNodeCoords } } });
                map.current?.addLayer({ id: 'maritime-layer', type: 'line', source: 'maritime-route', layout: { visibility }, paint: { 'line-color': '#6366f1', 'line-width': 3, 'line-dasharray': [4, 4], 'line-opacity': 0.7 } });
                
                for (let i = 0; i < intNodeCoords.length - 1; i++) {
                    const d = haversine(intNodeCoords[i], intNodeCoords[i+1]);
                    totalD += d; totalT += d / 35;
                }

                setMetrics({ dist: Math.round(totalD), time: totalT });
            }
        };

        return () => {
            map.current?.remove();
        };
    }, []);

    useEffect(() => {
        if (!map.current || !map.current.isStyleLoaded()) return;
        const layers = ['truck-layer', 'rail-layer', 'ferry-layer', 'maritime-layer'];
        const visibility = activeTab === 'simulator' ? 'visible' : 'none';
        layers.forEach(id => { if (map.current?.getLayer(id)) map.current.setLayoutProperty(id, 'visibility', visibility); });
        map.current.resize();
    }, [activeTab]);

    return (
        <div className="absolute inset-0">
            <div ref={mapContainer} className="absolute inset-0 z-0" />
            {metrics && activeTab === 'simulator' && <RouteMetrics totalDistance={metrics.dist} estimatedTime={metrics.time} />}
            <div className="absolute bottom-6 left-6 glass p-4 rounded-xl z-10 border border-white/10 w-[240px]">
                <h3 className="text-sm font-semibold text-white mb-1">카자흐스탄-한국 공급망</h3>
                <p className="text-xs text-gray-400 mb-3">실시간 광산 및 물류 거점 현황</p>
                <div className="flex flex-col gap-3 text-[11px]">
                    <div className="space-y-1.5">
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">거점 (Nodes)</div>
                        <div className="flex items-center justify-between"><span className="text-gray-300">물류 거점 (Station)</span><span className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white/20"></span></div>
                        <div className="flex items-center justify-between"><span className="text-gray-300">희토류 광산 (Mine)</span><span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-white/20"></span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
