
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dotbglejjetbcbyalyat.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3jBvXYBdok6aTbxDf7eAlw_ygxiQwFm';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
