
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const stations = [
    // --- Kazakhstan Stations ---
    {
        name: '도스틱 (Dostyk)',
        lat: 45.25,
        lng: 82.4833,
        capacity: 'High (China Border)',
        info: { border: true },
    },
    {
        name: '알마티 (Almaty)',
        lat: 43.2389,
        lng: 76.8897,
        capacity: 'Very High',
        info: { hub: true },
    },
    {
        name: '아스타나 (Astana)',
        lat: 51.1694,
        lng: 71.4491,
        capacity: 'High',
        info: { capital: true },
    },
    {
        name: '악타우 (Aktau)',
        lat: 43.65,
        lng: 51.15,
        capacity: 'Port (Caspian Sea)',
        info: { titr: true },
    },
    {
        name: '오랄 (Oral)',
        lat: 51.2333,
        lng: 51.3667,
        capacity: 'Western Hub',
        info: { tcr: true },
    },
    
    // --- Feeder Stations (for Mine Transport) ---
    {
        name: '장기즈-토베 (Zhangiz-Tobe)',
        lat: 49.2085,
        lng: 81.1632,
        capacity: 'Feeder for Bakeno (Battery)',
        info: { feeder: true, mine_connection: 'Bakeno', transport_type: 'Truck', distance: '40km', cost: '$10/ton' },
    },
    {
        name: '세메이 (Semey)',
        lat: 50.4117,
        lng: 80.2676,
        capacity: 'Eastern Hub',
        info: { hub: true, region: 'East' },
    },
    {
        name: '아야고즈 (Ayagoz)',
        lat: 47.9644,
        lng: 80.4344,
        capacity: 'Feeder for Verkhne-Espe (Magnet)',
        info: { junction: true, feeder: true, mine_connection: 'Verkhne-Espe', transport_type: 'Truck', distance: '80km', cost: '$20/ton' },
    },
    {
        name: '아르칼리크 (Arkalyk)',
        lat: 50.2486,
        lng: 66.9114,
        capacity: 'Feeder for Kuyrekti-Kol (Battery)',
        info: { feeder: true, mine_connection: 'Kuyrekti-Kol', transport_type: 'Truck', distance: '120km', cost: '$25/ton' },
    },
    {
        name: '에실 (Esil)',
        lat: 51.9592,
        lng: 66.3056,
        capacity: 'Feeder for Kundybai (Magnet)',
        info: { hub: true, region: 'North', feeder: true, mine_connection: 'Kundybai', transport_type: 'Truck', distance: '150km', cost: '$30/ton' },
    },
    {
        name: '키질로르다 (Kyzylorda)',
        lat: 44.8479,
        lng: 65.5002,
        capacity: 'Feeder for Akbulak (Magnet)',
        info: { feeder: true, mine_connection: 'Akbulak', transport_type: 'Truck', distance: '200km', cost: '$40/ton' },
    },
    {
        name: '제즈카즈간 (Jezkazgan)',
        lat: 47.7833,
        lng: 67.7167,
        capacity: 'Central Hub',
        info: { hub: true, region: 'Central' },
    },

    // --- South Korea Ports ---
    {
        name: '부산항 (Port of Busan)',
        lat: 35.1035,
        lng: 129.0423,
        capacity: '국내 최대 항구 / 글로벌 허브',
        info: { port: true, korea: true },
    },
    {
        name: '포항국제컨테이너터미널',
        lat: 36.1102,
        lng: 129.4338,
        capacity: '대구/경북 거점 (성림첨단산업 등)',
        info: { port: true, korea: true },
    },
    {
        name: '평택·당진항',
        lat: 36.9890,
        lng: 126.8320,
        capacity: '현대차/기아차/수도권 부품사 허브',
        info: { port: true, korea: true },
    },
    {
        name: '광양항',
        lat: 34.9080,
        lng: 127.7010,
        capacity: '포스코퓨처엠 / 리튬 가공 클러스터',
        info: { port: true, korea: true },
    }
];

export const mines = [
    // 1. 자석 및 모터용 (Magnet / Rare Earths) - 성림첨단산업 타겟
    {
        name: '베르크네-에스페 (Verkhne-Espe)',
        lat: 48.1000,
        lng: 81.4500,
        mineral_type: '중희토류 (Dy, Tb)',
        reserve_amount: 0,
        production_capacity: 0,
        info: { type: 'Magnet', business_point: '영구자석 필수재, 성림첨단산업 최우선 타겟' }
    },
    {
        name: '아크불락 (Akbulak)',
        lat: 48.3333,
        lng: 64.8333,
        mineral_type: '희토류 (Nd, Pr)',
        reserve_amount: 0,
        production_capacity: 0,
        info: { type: 'Magnet', business_point: '남부 위치, 경희토류 풍부' }
    },
    {
        name: '쿤디바이 (Kundybai)',
        lat: 51.2667,
        lng: 61.5000,
        mineral_type: '희토류 (Y, Ce)',
        reserve_amount: 0,
        production_capacity: 0,
        info: { type: 'Magnet', business_point: '북서부 위치, 이트륨 풍부' }
    },

    // 2. 이차전지 및 배터리용 (Battery / Lithium) - 현대차, 배터리 3사 타겟
    {
        name: '바케노 (Bakeno)',
        lat: 49.0833,
        lng: 81.5000,
        mineral_type: '리튬 (Li), 탄탈륨',
        reserve_amount: 25000,
        production_capacity: 0,
        info: { type: 'Battery', business_point: '동부 핵심 리튬 광산 (KIGAM 협력)' }
    },
    {
        name: '쿠이레크티콜 (Kuyrekti-Kol)',
        lat: 51.5000,
        lng: 71.5000, // Approximate near Astana/North
        mineral_type: '리튬 (Li)',
        reserve_amount: 15000,
        production_capacity: 0,
        info: { type: 'Battery', business_point: '북부 리튬 거점, 신규 유망 광산' }
    }
];

async function seed() {
    console.log('🚀 데이터 시딩 시작...');

    // 1. Stations (Ports included)
    console.log('🔄 Stations 데이터 갱신 중...');
    // 기존 데이터 삭제 (name이 placeholder가 아닌 모든 데이터 삭제 - 전체 삭제 효과)
    const { error: deleteError } = await supabase.from('stations').delete().neq('name', 'placeholder_for_delete_all');
    if (deleteError) console.error('❌ 기존 Stations 삭제 실패:', deleteError);
    
    for (const s of stations) {
        const { error } = await supabase.from('stations').insert({
            name: s.name,
            location: `POINT(${s.lng} ${s.lat})`,
            capacity: s.capacity,
            info: s.info
        });
        if (error) console.error(`❌ ${s.name} 추가 실패:`, error);
        else console.log(`✅ ${s.name} 추가됨`);
    }

    // 2. Mines
    console.log('🔄 Mines 데이터 갱신 중...');
    // 기존 데이터 삭제
    const { error: deleteMineError } = await supabase.from('mines').delete().neq('name', 'placeholder_for_delete_all');
    if (deleteMineError) console.error('❌ 기존 Mines 삭제 실패:', deleteMineError);

    for (const m of mines) {
        const { error } = await supabase.from('mines').insert({
            name: m.name,
            location: `POINT(${m.lng} ${m.lat})`,
            mineral_type: m.mineral_type
        });
        if (error) console.error(`❌ ${m.name} 추가 실패:`, error);
        else console.log(`✅ ${m.name} 추가됨`);
    }

    console.log('✨ 모든 데이터 시딩 완료!');
}

seed();
