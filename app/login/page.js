'use client'; 
import { useState } from 'react';
import { supabase } from '../../src/lib/supabase'; // Ruta corregida
import { useRouter } from 'next/navigation';

// Componente de la página de Login
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  // Maneja el inicio de sesión (Login)
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`Error de Acceso: ${error.message}`);
    } else {
      setMessage('¡Acceso exitoso! Redireccionando...');
      // Nota: El archivo /panel/page.tsx que creamos se encargará de verificar la autorización aquí.
      router.push('/panel'); 
    }
    setLoading(false);
  };

  // ------------------------------------------------------------------
  // 🟢 FUNCIÓN DE REGISTRO CORREGIDA (Insertando estado PENDIENTE)
  // ------------------------------------------------------------------
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // 1. Registrar usuario en Supabase Auth (esto envía el email de confirmación)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Opción para que Next.js maneje el callback después de la confirmación
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(`Error de Registro: ${error.message}`);
      setLoading(false);
      return;
    }

    if (data.user) {
      // 2. Insertar el perfil en la tabla 'clients' con estado PENDIENTE
      // Esto solo se ejecuta si el registro en auth fue exitoso.
      const { error: profileError } = await supabase
        .from('clients') // <-- USANDO TU NOMBRE DE TABLA CORRECTO: 'clients'
        .insert([
          { 
            id: data.user.id, 
            email: data.user.email,
            estado_cliente: 'PENDIENTE' // Estado inicial para requerir autorización manual
          }
        ]);

      if (profileError) {
        console.error("Error al crear perfil en 'clients':", profileError);
        setMessage('Registro de usuario exitoso, pero hubo un error al crear el perfil. Contacta a soporte.');
        setLoading(false);
        return;
      }

      // 3. Mensaje final indicando que debe esperar autorización
      setMessage('✅ ¡Registro exitoso! Por favor, revisa tu correo electrónico para confirmar tu cuenta. Una vez confirmada, tu acceso quedará en estado PENDIENTE. Un asesor te autorizará pronto.');
    }
    
    setLoading(false);
  };
  // ------------------------------------------------------------------


  // Estructura básica de la página con Tailwind CSS
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
          Área de Clientes Grupo Alfa
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Ingresa o regístrate para acceder al Programa de Referidos.
        </p>

        {message && (
          <p className={`p-3 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </p>
        )}

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm text-black"
              placeholder="ejemplo@cliente.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm text-black"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 disabled:opacity-50"
            >
              {loading ? 'Cargando...' : 'Registrarse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
