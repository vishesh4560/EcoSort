
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tvkbwiomncgkineltyfl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_pAHUIsrW530kQ27FkF-Olw_UkUBhuiW';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
