import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button, SectionHeader } from './Shared';
import { User } from '../types';

const data = [
  { name: 'Jan', amount: 4500 },
  { name: 'Feb', amount: 6200 },
  { name: 'Mar', amount: 5100 },
  { name: 'Apr', amount: 8400 },
  { name: 'May', amount: 12000 },
  { name: 'Jun', amount: 15500 },
];

interface SellerDashboardProps {
  user: User;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ user }) => {
  return (
    <div className="space-y-6 pb-20">
      <div className="bg-brand-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <img src={user.avatar} alt="Profile" className="w-16 h-16 rounded-full border-4 border-brand-500" />
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="opacity-90 text-sm">Seller Account • Nairobi</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-brand-700/50 p-3 rounded-xl backdrop-blur-sm">
            <p className="text-xs opacity-75 mb-1">Total Earnings</p>
            <p className="text-xl font-bold">KES 51,700</p>
          </div>
          <div className="bg-brand-700/50 p-3 rounded-xl backdrop-blur-sm">
            <p className="text-xs opacity-75 mb-1">Active Gigs</p>
            <p className="text-xl font-bold">3</p>
          </div>
        </div>
      </div>

      <div className="px-4">
        <SectionHeader title="Revenue Projection" />
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-64">
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#9ca3af'}} />
              <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#9ca3af'}} tickFormatter={(value) => `K${value/1000}k`} />
              <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">Projected growth based on current booking trends.</p>
      </div>

      <div className="px-4">
        <div className="bg-gradient-to-r from-orange-100 to-orange-50 p-4 rounded-xl border border-orange-100">
           <h3 className="font-bold text-orange-800 mb-2">Upgrade to Pro</h3>
           <p className="text-sm text-orange-700 mb-3">Get 3x more visibility and lower transaction fees.</p>
           <Button variant="secondary" className="w-full text-sm py-1.5">Go Premium for KES 500/mo</Button>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;