import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Env variables missing');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const routes = [
    {
        name: 'TCR (Trans-China Railway)',
        // Dostyk -> Almaty -> Astana -> Western Border
        points: [
            [82.4833, 45.25],    // Dostyk
            [76.8897, 43.2389],   // Almaty
            [71.4491, 51.1694],   // Astana
            [51.3667, 51.2333]    // Oral (Uralsk) - Accurate Coordinates
        ],
        type: 'TCR'
    },
    {
        name: 'TITR (Middle Corridor)',
        // Almaty -> Zhezkazgan (Near Mines) -> Aktau
        points: [
            [76.8897, 43.2389],   // Almaty
            [67.7144, 47.7964],   // Zhezkazgan
            [51.15, 43.65]        // Aktau Port
        ],
        type: 'TITR'
    }
];

async function seed() {
    console.log('🚀 철도 노선 데이터 삽입 시작...');

    for (const r of routes) {
        const lineString = `LINESTRING(${r.points.map(p => `${p[0]} ${p[1]}`).join(', ')})`;
        
        const { error } = await supabase.from('rail_lines').insert({
            name: r.name,
            route: lineString,
            // info 필드가 있다면 메타데이터 추가 가능
        });

        if (error) {
            console.error(`Error inserting ${r.name}:`, error);
        } else {
            console.log(`✅ ${r.name} 삽입 완료`);
        }
    }

    console.log('✨ 모든 노선 데이터 삽입 프로세스 종료');
}

seed();
