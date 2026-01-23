
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lnojioohgkqjznvfzrfi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_gtpuxGJW2JXCFGkp0R6IPQ_xtomruty';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
