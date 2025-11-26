// src/lib/supabase.js

import { createClient } from '@supabase/supabase-js';

// Obtener las claves del archivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Crear la instancia del cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);