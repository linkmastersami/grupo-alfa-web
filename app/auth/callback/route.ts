import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Esta ruta procesa el enlace de confirmación que Supabase envía por correo.

// El Next.js App Router usa la función GET para manejar peticiones.
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    // 1. Inicializa el cliente Supabase usando las cookies del servidor
    const supabase = createRouteHandlerClient({ cookies });
    
    // 2. Intercambia el código de autorización por una sesión de usuario válida
    // Esto es lo que confirma la cuenta y establece la sesión.
    await supabase.auth.exchangeCodeForSession(code);
  }

  // 3. Redirige al usuario al panel después de confirmar la sesión
  // IMPORTANTE: Asegúrate de que tu servidor (localhost:3000) esté corriendo
  // cuando hagas clic en el enlace del correo.
  return NextResponse.redirect(requestUrl.origin + '/panel');
}