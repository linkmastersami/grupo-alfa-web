import Link from 'next/link';
import React from 'react';

// El tipo 'React.ReactNode' es necesario para la propiedad 'icon'
interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

// Componente para las tarjetas de características (USA EMOJIS EN LUGAR DE ÍCONOS)
function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out">
            <div className="flex items-center space-x-4">
                <span className="text-2xl">{icon}</span> 
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            </div>
            <p className="mt-4 text-gray-500">{description}</p>
        </div>
    );
}

// Componente principal de la página
export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50">
            
            {/* 1. SECCIÓN HERO (Principal) */}
            <header className="py-20 bg-gray-900 text-white shadow-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                        Invierte en tu Futuro con Terrenos de Alta Plusvalía
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-300">
                        Descubre las mejores oportunidades de inversión en terrenos y lotes. Planes de pago flexibles y ubicaciones estratégicas para hacer crecer tu patrimonio.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        
                        {/* CTA principal: Área de Clientes/Login */}
                        <Link href="/login" legacyBehavior>
                            <a className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 shadow-lg transition duration-150 ease-in-out">
                                Área de Clientes
                            </a>
                        </Link>

                        {/* CTA secundario: Terrenos en Venta */}
                        <a href="https://sites.google.com/view/grupoalfaterrenos/terrenos-en-venta" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-gray-100 shadow-lg transition duration-150 ease-in-out">
                            Ver Terrenos en Venta
                        </a>
                    </div>
                </div>
            </header>

            {/* 2. SECCIÓN DE BENEFICIOS */}
            <section className="py-16 sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            ¿Por Qué Invertir con Grupo Alfa?
                        </h2>
                        <p className="mt-4 text-xl text-gray-500">
                            Somos tu mejor opción para invertir con seguridad, confianza y las mejores condiciones.
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Inversión Segura */}
                        <FeatureCard 
                            icon="🛡️" 
                            title="Inversión Segura" 
                            description="Todos nuestros terrenos cuentan con documentación legal completa y revisada."
                        />
                        {/* Planes de Pago Flexibles */}
                        <FeatureCard 
                            icon="💰" 
                            title="Planes de Pago Flexibles" 
                            description="Ofrecemos opciones de financiamiento adaptadas a tu presupuesto con enganches accesibles."
                        />
                        {/* Alta Plusvalía */}
                        <FeatureCard 
                            icon="📈" 
                            title="Alta Plusvalía" 
                            description="Invierte en áreas con proyección de crecimiento garantizado y aumenta el valor de tu patrimonio."
                        />
                    </div>
                </div>
            </section>

            {/* 3. SECCIÓN DEL PROGRAMA DE LEALTAD (Referidos) */}
            <section className="py-16 bg-green-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Gana Comisiones Recomendando Terrenos
                    </h2>
                    <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
                        ¿Eres cliente de Grupo Alfa? Participa en nuestro Programa de Lealtad y obtén atractivas comisiones por cada venta que recomiendes.
                    </p>
                    <div className="mt-8">
                        <Link href="/login" legacyBehavior>
                            <a className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 shadow-lg transition duration-150 ease-in-out">
                                Entrar al Programa de Lealtad
                            </a>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 4. Footer simple */}
            <footer className="bg-gray-800">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-400">© 2025 GRUPO ALFA. Todos los derechos reservados.</p>
                    <div className="mt-4 space-x-4">
                        {/* Enlaces rápidos a páginas existentes */}
                        <Link href="/login" className="text-gray-400 hover:text-white">Área de Clientes</Link>
                        {/* Enlace de contacto de Google Sites */}
                        <a href="https://wa.me/5215551549030?text=Hola%20Grupo%20Alfa," target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">Contacto</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
