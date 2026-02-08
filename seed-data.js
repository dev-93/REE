
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
    {
        name: '바케노 (Bakeno)',
        lat: 49.70567,
        lng: 82.93569,
        mineral_type: '리튬, 탄탈륨',
        reserve_amount: 25000, // 톤 (from image)
        production_capacity: 0
    },
    {
        name: '쿠이레크티콜 (Kuyrekti-Kol)',
        lat: 51.50000, // Approximate (Akmola region)
        lng: 71.50000, // Approximate (Akmola region)
        mineral_type: '네오디뮴, 희토류',
        reserve_amount: 0,
        production_capacity: 0
    },
    {
        name: '베르크네-에스페 (Verkhne-Espe)',
        lat: 48.10000,
        lng: 81.45000,
        mineral_type: '리튬, 베릴륨',
        reserve_amount: 0,
        production_capacity: 0
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
