import React from 'react';

// Apuntamos al WordPress local de Docker (puerto 8089)
const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'http://localhost:8089/wp-json/fortress/v1/status';

async function getBotStatus() {
  try {
    // El cache: 'no-store' le dice a Next.js que siempre pida los datos frescos (SSR) al servidor
    const res = await fetch(WP_API_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Error al obtener datos');
    return res.json();
  } catch (error) {
    console.error("Error conectando con WP:", error);
    // Devolvemos datos falsos (dummy) si no hay conexión para que veas el diseño
    return {
      balance: 1740.23,
      drawdown: 0.5,
      regime: 'NEUTRAL/GREED',
      fng: 50,
      last_update: new Date().toISOString(),
      mock: true
    };
  }
}

export default async function DashboardPage() {
  const status = await getBotStatus();

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Encabezado */}
        <header className="mb-10 border-b border-gray-800 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-emerald-400">
              Fortress Mode <span className="text-gray-500 font-light text-xl ml-2">v3.0</span>
            </h1>
            <p className="text-gray-400 mt-1 text-sm">Dashboard Institucional de Riesgo</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 mb-1">
              <span className={`h-2 w-2 rounded-full ${status.mock ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`}></span>
              <span className="text-sm font-medium text-gray-300">
                {status.mock ? 'Modo Offline (Datos Simulados)' : 'Sistema Online'}
              </span>
            </div>
            <p className="text-xs text-gray-500">Última act: {new Date(status.last_update).toLocaleString()}</p>
          </div>
        </header>

        {/* Grilla de Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-2xl">💵</div>
            <h3 className="text-gray-400 text-sm font-medium mb-2">Balance Actual</h3>
            <p className="text-3xl font-bold font-mono">${status.balance?.toFixed(2)}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg relative overflow-hidden group hover:border-red-500/30 transition-colors">
             <div className="absolute top-0 right-0 p-4 opacity-10 text-2xl">📉</div>
            <h3 className="text-gray-400 text-sm font-medium mb-2">Max Drawdown</h3>
            <p className="text-3xl font-bold font-mono text-red-400">{status.drawdown}%</p>
            <p className="text-xs text-gray-500 mt-2">Límite CB: 15%</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg relative overflow-hidden group hover:border-blue-500/30 transition-colors">
             <div className="absolute top-0 right-0 p-4 opacity-10 text-2xl">🧠</div>
            <h3 className="text-gray-400 text-sm font-medium mb-2">Régimen Mercado</h3>
            <p className="text-xl font-bold mt-1 text-blue-400">{status.regime}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg relative overflow-hidden group hover:border-purple-500/30 transition-colors">
             <div className="absolute top-0 right-0 p-4 opacity-10 text-2xl">📊</div>
            <h3 className="text-gray-400 text-sm font-medium mb-2">Fear & Greed</h3>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold font-mono">{status.fng}</p>
              <p className="text-sm text-gray-500 mb-1">/100</p>
            </div>
            {/* Barra de progreso visual */}
            <div className="w-full bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
               <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-full" style={{width: `${status.fng}%`}}></div>
            </div>
          </div>

        </div>

        {/* Explicación de la Arquitectura */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-200">¿Cómo funciona esto? (Headless Architecture)</h2>
          <ul className="list-disc pl-5 text-gray-400 space-y-2 text-sm">
             <li>Este componente (React Server Component) le pide los datos a tu <strong>WordPress REST API</strong> en el momento exacto en que alguien carga la página.</li>
             <li>Como ves arriba a la derecha, si WordPress no responde, la UI no se cae; muestra los datos cacheados o simulados con un indicador visual (Puntito naranja).</li>
             <li>Todo el estilo oscuro y premium que ves (bordes dinámicos al hacer hover, gradientes, tipografía) está hecho nativamente con <strong>TailwindCSS</strong> sin tocar ni un archivo `.css`.</li>
          </ul>
        </div>

      </div>
    </main>
  );
}
