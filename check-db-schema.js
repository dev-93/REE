
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    const { data, error } = await supabase.from('mines').select('*').limit(1);
    if (error) {
        console.error('Error fetching mines:', error);
    } else {
        console.log('Mines table columns:', data && data.length > 0 ? Object.keys(data[0]) : 'No data found');
        if (data && data.length > 0) {
            console.log('Example row:', data[0]);
        }
    }
}

checkSchema();
