import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Service role key — bypasses Row Level Security. Only ever imported by
// server-side code (API routes), never by a "use client" component.
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);