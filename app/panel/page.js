'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Inicialización del cliente Supabase
// **IMPORTANTE**: Si no usas auth-helpers-nextjs, cambia esta línea a:
// import { supabase } from '../../src/lib/supabase';
// const supabase = supabase; 
const supabase = createClientComponentClient();

// ----------------------------------------------------------------------
// COMPONENTE PRINCIPAL DE LOGIN/REGISTRO
// ----------------------------------------------------------------------

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [view, setView] = useState('sign-in'); // 'sign-in' o 'sign-up'
    const [statusMessage, setStatusMessage] = useState('');
    const router = useRouter();

    // 1. Hook para manejar la redirección si el usuario ya está logueado
    useEffect(() => {
        const checkUser = async () => {
            // Intenta obtener la sesión activa
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                // Si hay un usuario, redirigir inmediatamente al panel
                router.push('/panel');
            }
        };
        
        checkUser();
    }, [router, supabase]);

    // 2. Función de Inicio de Sesión
    const handleSignIn = async (e) => {
        e.preventDefault();
        setStatusMessage('Iniciando sesión...');
        
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setStatusMessage(`Error: ${error.message}`);
        } else {
            // Si es exitoso, el useEffect detectará el cambio y redirigirá.
            setStatusMessage('Acceso exitoso. Redirigiendo...');
            router.push('/panel'); 
        }
    };

    // 3. Función de Registro (Incluye creación de perfil PENDIENTE)
    const handleSignUp = async (e) => {
        e.preventDefault();
        setStatusMessage('Registrando...');

        // 3a. Registrar usuario en Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // Dirección de redirección después de la confirmación por correo
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            setStatusMessage(`Error de Registro: ${error.message}`);
            return;
        }

        if (data && data.user) {
            // 3b. Insertar el perfil en la tabla 'clients' con estado PENDIENTE
            const { error: profileError } = await supabase
                .from('clients') // Usa tu tabla de perfiles 'clients'
                .insert([
                    { 
                        id: data.user.id, 
                        email: data.user.email,
                        estado_cliente: 'PENDIENTE' 
                    }
                ]);

            if (profileError) {
                console.error("Error al crear perfil en 'clients':", profileError);
                setStatusMessage('Registro de usuario exitoso, pero hubo un error al crear el perfil. Contacta a soporte.');
                return;
            }

            // 3c. Mensaje final e ir a la vista de inicio de sesión
            setStatusMessage('✅ ¡Registro exitoso! Por favor, revisa tu correo para confirmar tu cuenta. Una vez confirmada, tu acceso será PENDIENTE hasta que un asesor lo apruebe.');
            setEmail('');
            setPassword('');
            setView('sign-in');
        } else {
            // Caso donde solo se envía el correo y Supabase espera la confirmación
            setStatusMessage('¡Registro exitoso! Revisa tu correo electrónico para el enlace de confirmación.');
            setView('sign-in');
        }
    };

    const renderForm = () => (
        <form onSubmit={view === 'sign-in' ? handleSignIn : handleSignUp} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border text-black"
                    placeholder="ejemplo@cliente.com"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border text-black"
                    placeholder="Mínimo 6 caracteres"
                />
            </div>

            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
            >
                {view === 'sign-in' ? 'Iniciar Sesión' : 'Registrarme'}
            </button>
        </form>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
                    {view === 'sign-in' ? 'Área de Clientes' : 'Crear Cuenta'}
                </h1>
                
                {renderForm()}
                
                {statusMessage && (
                    <p className={`mt-4 text-center text-sm ${statusMessage.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                        {statusMessage}
                    </p>
                )}

                <div className="mt-6 text-center">
                    {view === 'sign-in' ? (
                        <p className="text-sm text-gray-600">
                            ¿No tienes cuenta?{' '}
                            <button 
                                onClick={() => { setView('sign-up'); setStatusMessage(''); setEmail(''); setPassword(''); }} 
                                className="font-medium text-green-600 hover:text-green-500 transition"
                            >
                                Regístrate aquí
                            </button>
                        </p>
                    ) : (
                        <p className="text-sm text-gray-600">
                            ¿Ya tienes cuenta?{' '}
                            <button 
                                onClick={() => { setView('sign-in'); setStatusMessage(''); setEmail(''); setPassword(''); }} 
                                className="font-medium text-green-600 hover:text-green-500 transition"
                            >
                                Inicia Sesión
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}