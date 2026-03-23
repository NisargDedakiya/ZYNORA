/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface ChartData {
    name: string;
    revenue: number;
    orders: number;
}

export function DashboardStats({ data }: { data: ChartData[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-[400px] bg-white border border-gray-200 rounded-none shadow-sm p-6 flex flex-col items-center justify-center text-gray-400">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Not enough data for the last 30 days</span>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Revenue Area Chart */}
            <div className="xl:col-span-2 bg-white border border-gray-200 rounded-none p-6 shadow-sm transition-all hover:border-gray-300">
                <div className="mb-8 flex justify-between items-center">
                    <h3 className="uppercase tracking-[0.2em] text-[10px] font-bold text-gray-500">Revenue (Last 30 Days)</h3>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#111111" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#111111" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#6B7280', fontFamily: 'monospace', fontWeight: 'bold' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#6B7280', fontFamily: 'monospace', fontWeight: 'bold' }} dx={-10} tickFormatter={(val) => `₹${(val / 1000)}k`} />
                            <Tooltip
                                contentStyle={{ borderRadius: '0px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', color: '#111111', fontSize: '11px', fontWeight: 'bold', fontFamily: 'monospace' }}
                                itemStyle={{ color: '#111111' }}
                                formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#111111" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Orders Line Chart */}
            <div className="bg-white border border-gray-200 rounded-none p-6 shadow-sm transition-all hover:border-gray-300">
                <div className="mb-8 flex justify-between items-center">
                    <h3 className="uppercase tracking-[0.2em] text-[10px] font-bold text-gray-500">Orders Volume</h3>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#6B7280', fontFamily: 'monospace', fontWeight: 'bold' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#6B7280', fontFamily: 'monospace', fontWeight: 'bold' }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '0px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', color: '#111111', fontSize: '11px', fontWeight: 'bold', fontFamily: 'monospace' }}
                                itemStyle={{ color: '#111111' }}
                                formatter={(value: any) => [Number(value), 'Orders']}
                            />
                            <Line type="monotone" dataKey="orders" stroke="#666666" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: '#111111', stroke: '#FFFFFF', strokeWidth: 2 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

