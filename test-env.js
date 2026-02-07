import { supabase } from '@/utils/supabase-client';

async function testMapboxAndData() {
    console.log('=== 환경 변수 확인 ===');
    console.log('Mapbox Token:', process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN);
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    
    console.log('\n=== Supabase 데이터 확인 ===');
    const { data: stations, error: stationsError } = await supabase.from('stations').select('*');
    console.log('Stations:', stations?.length, 'rows');
    if (stationsError) console.error('Stations Error:', stationsError);
    
    const { data: mines, error: minesError } = await supabase.from('mines').select('*');
    console.log('Mines:', mines?.length, 'rows');
    if (minesError) console.error('Mines Error:', minesError);
    
    const { data: rails, error: railsError } = await supabase.from('rail_lines').select('*');
    console.log('Rail Lines:', rails?.length, 'rows');
    if (railsError) console.error('Rail Lines Error:', railsError);
}

testMapboxAndData();
