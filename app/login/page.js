// app/login/page.js
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
      // Redirigir al área de clientes / referidos
      router.push('/referidos'); 
    }
    setLoading(false);
  };

  // Maneja el registro (Sign Up)
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Supabase envía un correo de confirmación al usuario antes de permitir el login
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(`Error de Registro: ${error.message}`);
    } else {
      setMessage('¡Registro exitoso! Por favor, revisa tu correo para confirmar tu cuenta.');
    }
    setLoading(false);
  };


  // Estructura básica de la página con Tailwind CSS (el que instalamos)
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