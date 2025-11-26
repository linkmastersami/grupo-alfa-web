// app/referidos/page.js
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../src/lib/supabase'; // Usa la ruta relativa corregida
import { useRouter } from 'next/navigation';

export default function ReferidosPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Efecto que se ejecuta al cargar la página para verificar la sesión
  useEffect(() => {
    async function checkUser() {
      // 1. Obtener la sesión actual de Supabase
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Si no hay usuario, redirigir al login
        router.push('/login');
      } else {
        // Si hay usuario, guardar su info y mostrar el contenido
        setUser(user);
        setLoading(false);
      }
    }
    checkUser();

    // Escucha cambios en la autenticación (ej: cuando el usuario cierra sesión)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          router.push('/login');
        }
      }
    );
    return () => {
        if (authListener) authListener.subscription.unsubscribe();
    };
  }, [router]);

  // Muestra un mensaje de carga mientras se verifica la sesión
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-green-700">Verificando acceso al Área de Referidos...</p>
      </div>
    );
  }

  // Si el usuario está autenticado, muestra el contenido del área segura
  if (user) {
    return (
      <div className="p-10 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-bold text-green-700 mb-6">
          ¡Bienvenido al Área de Referidos, Cliente de Grupo Alfa!
        </h1>
        <p className="text-gray-600 mb-8">
          Tu correo de acceso es: <strong>{user.email}</strong>
        </p>

        {/* Aquí iría tu formulario de referidos avanzado con acceso a tu base de datos */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
                📢 Registra a tus Prospectos
            </h2>
            <p className="text-gray-500">
                Puedes empezar a programar la lógica para guardar los referidos directamente en la tabla de Supabase.
            </p>
            <button
                onClick={() => supabase.auth.signOut()}
                className="mt-6 py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
                Cerrar Sesión
            </button>
        </div>
      </div>
    );
  }

  // Fallback: Si el loading termina y no hay usuario, redirige al login (aunque ya se hizo antes)
  return null;
}