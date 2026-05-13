"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ChartWidget({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <div className="text-gray-500 text-sm mt-4">No hay datos históricos aún.</div>;
  }

  // Calculate monthly growth mock
  const firstBalance = data[0].balance;
  const lastBalance = data[data.length - 1].balance;
  const growth = (((lastBalance - firstBalance) / firstBalance) * 100).toFixed(2);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg mb-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-200">Evolución del Capital</h2>
          <p className="text-sm text-gray-500">Últimos 30 días</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Rendimiento Mensual</p>
          {data.length < 30 ? (
            <p className="text-xs text-amber-500 mt-1">⏳ Recolectando datos (Día {data.length}/30)...</p>
          ) : (
            <p className={`text-xl font-bold ${Number(growth) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {Number(growth) > 0 ? '+' : ''}{growth}%
            </p>
          )}
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis dataKey="date" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={(val) => `$${val}`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem', color: '#fff' }}
              itemStyle={{ color: '#10b981' }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Balance']}
              labelStyle={{ color: '#9ca3af', marginBottom: '0.25rem' }}
            />
            <Line type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
