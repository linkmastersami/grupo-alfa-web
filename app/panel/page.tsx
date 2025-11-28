// Inicializa el cliente Supabase
const supabase = createClientComponentClient();

// ----------------------------------------------------------------------
// PANEL PRINCIPAL (Control de Acceso y Tabs)
// ----------------------------------------------------------------------
export default function PanelPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    
    // Estado para saber qué acción quiere realizar el usuario (cobro o referido)
    const [activeTab, setActiveTab] = useState<'cobro' | 'referido'>('referido');
    
    // Hook para verificar la autorización al cargar la página
    useEffect(() => {
        const checkAuthorization = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                // Si no hay usuario, enviar al login
                router.push('/login');
                return;
            }

            // 1. Buscar el estado del cliente en la tabla CORRECTA: 'clients'
            const { data: profile, error } = await supabase
                .from('clients') 
                .select('estado_cliente')
                .eq('id', user.id)
                .single();

            if (error || !profile) {
                console.error("Error al obtener perfil:", error);
                setLoading(false);
                setIsAuthorized(false); 
                return;
            }

            // 2. Verificar el estado
            if (profile.estado_cliente === 'AUTORIZADO') {
                setIsAuthorized(true);
            } else {
                // Si es PENDIENTE o cualquier otro estado, bloquear el acceso
                setIsAuthorized(false);
            }
            
            setLoading(false);
        };
        
        checkAuthorization();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    // --- RENDERING CONDICIONAL (Manejo de estados) ---

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Cargando y verificando tu acceso...</div>;
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-lg mx-auto">
                    <h2 className="text-3xl font-bold text-yellow-600 mb-4">¡Cuenta Pendiente de Autorización! 🟡</h2>
                    <p className="text-gray-700 mb-6">
                        Tu registro fue exitoso. Estamos verificando tus datos. 
                        Un asesor de Grupo Alfa te contactará pronto para finalizar la activación de tu cuenta y darte acceso al panel de referidos.
                    </p>
                    <button 
                        onClick={handleLogout}
                        className="px-6 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition"
                    >
                        Salir
                    </button>
                </div>
            </div>
        );
    }
    
    // Si isAuthorized es TRUE, muestra el panel normal
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <header className="flex justify-between items-center max-w-4xl mx-auto mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Bienvenido a tu Área de Lealtad</h1>
                <button 
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition"
                >
                    Cerrar Sesión
                </button>
            </header>

            <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
                
                {/* Selector de Acción (Tabs) */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setActiveTab('referido')}
                        className={`py-2 px-4 text-lg font-medium transition-colors ${
                            activeTab === 'referido' 
                            ? 'text-green-600 border-b-2 border-green-600' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Registrar Referido 🤝
                    </button>
                    <button
                        onClick={() => setActiveTab('cobro')}
                        className={`py-2 px-4 text-lg font-medium transition-colors ${
                            activeTab === 'cobro' 
                            ? 'text-green-600 border-b-2 border-green-600' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Solicitar Cobro a Domicilio 🗓️
                    </button>
                </div>
                
                {/* Contenido del Tab Activo */}
                {activeTab === 'referido' ? <ReferidoForm /> : <CobroForm />}
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// FORMULARIO DE REFERIDOS
// ----------------------------------------------------------------------
function ReferidoForm() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState(''); 
    
    const getUserId = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        return user?.id;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Registrando...');

        const user_id = await getUserId();
        if (!user_id) {
            setStatus('Error: Debes iniciar sesión para registrar referidos.');
            return;
        }

        const { error } = await supabase
            .from('referidos') 
            .insert({ 
                referente_id: user_id, 
                nombre_referido: name, 
                telefono_referido: phone 
            });

        if (error) {
            console.error(error);
            setStatus(`Error al registrar: ${error.message}`);
        } else {
            setStatus('✅ ¡Referido registrado con éxito! Gracias por tu apoyo.');
            setName('');
            setPhone('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Registro de Nuevo Prospecto</h2>
            <p className="text-gray-600">Ingresa los datos de la persona que nos recomiendas para iniciar el proceso de venta y asegurar tu comisión.</p>
            
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nombre Completo del Referido
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                />
            </div>
            
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Teléfono del Referido
                </label>
                <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                />
            </div>
            
            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
            >
                Registrar Referido
            </button>
            {status && <p className="mt-4 text-center text-sm">{status}</p>}
        </form>
    );
}

// ----------------------------------------------------------------------
// FORMULARIO DE COBRO A DOMICILIO
// ----------------------------------------------------------------------
function CobroForm() {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState(''); 
    
    const getUserId = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        return user?.id;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Solicitando cobro...');
        
        const user_id = await getUserId();
        if (!user_id) {
            setStatus('Error: Debes iniciar sesión para solicitar cobros.');
            return;
        }

        const { error } = await supabase
            .from('solicitudes_cobro') 
            .insert({ 
                cliente_id: user_id, 
                fecha_solicitada: date,
                hora_solicitada: time,
                direccion: address
            });

        if (error) {
            console.error(error);
            setStatus(`Error al solicitar: ${error.message}`);
        } else {
            setStatus('✅ ¡Solicitud de cobro enviada con éxito! Te contactaremos para confirmar la visita.');
            setDate('');
            setTime('');
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Solicitar Cobro a Domicilio</h2>
            <p className="text-gray-600">Selecciona la fecha, hora y confirma tu dirección para que un asesor te visite a domicilio.</p>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Fecha
                    </label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                    />
                </div>
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                        Hora
                    </label>
                    <input
                        type="time"
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                    />
                </div>
            </div>
            
            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Dirección de Cobro
                </label>
                <textarea
                    id="address"
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder='Calle, número, colonia y referencias.'
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                />
            </div>
            
            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
            >
                Confirmar Solicitud de Cobro
            </button>
            {status && <p className="mt-4 text-center text-sm">{status}</p>}
        </form>
    );

}
