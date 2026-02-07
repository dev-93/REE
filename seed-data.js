import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jjitawfnyhffzhxqjpgb.supabase.co';
const supabaseAnonKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqaXRhd2ZueWhmZnpoeHFqcGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NTM5ODAsImV4cCI6MjA4NjAyOTk4MH0.oZDoJqjcmZXP_ncj06SgJ1YpYaQnOvX470N-hMAwgLU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const stations = [
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
];

const mines = [
    { name: '쿠무스탁 (Kumustak - Lithium)', mineral_type: 'Lithium', lat: 42.5, lng: 70.0 },
    { name: '아크불락 (Akbulak - Rare Earth)', mineral_type: 'Neodymium', lat: 48.0, lng: 65.0 },
];

async function seed() {
    console.log('🚀 카자흐스탄 샘플 데이터 삽입 시작...');

    for (const s of stations) {
        const { error } = await supabase.from('stations').insert({
            name: s.name,
            location: `POINT(${s.lng} ${s.lat})`,
            capacity: s.capacity,
            info: s.info,
        });
        if (error) console.error(`Error ${s.name}:`, error);
    }

    for (const m of mines) {
        const { error } = await supabase.from('mines').insert({
            name: m.name,
            mineral_type: m.mineral_type,
            location: `POINT(${m.lng} ${m.lat})`,
        });
        if (error) console.error(`Error ${m.name}:`, error);
    }

    console.log('✅ 데이터 삽입 완료!');
}

seed();
