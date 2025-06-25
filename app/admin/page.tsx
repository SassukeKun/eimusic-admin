'use client';

import { Users, Music, DollarSign, UserCheck } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import type { DashboardStats } from '@/types/admin';

export default function AdminDashboard() {
  // Mock data - em Meticais (MT)
  const stats: DashboardStats = {
    totalUsers: 45320,
    totalArtists: 1250,
    totalTracks: 15680,
    totalRevenue: 2456000, // 2.456M MT
    monthlyGrowth: {
      users: 12.5,
      artists: 8.3,
      tracks: 15.7,
      revenue: 23.4,
    },
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here&apos;s what&apos;s happening with EiMusic today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          change={stats.monthlyGrowth.users}
          changeType="increase"
          icon={Users}
        />
        <StatsCard
          title="Total Artists"
          value={stats.totalArtists}
          change={stats.monthlyGrowth.artists}
          changeType="increase"
          icon={UserCheck}
        />
        <StatsCard
          title="Total Tracks"
          value={stats.totalTracks}
          change={stats.monthlyGrowth.tracks}
          changeType="increase"
          icon={Music}
        />
        <StatsCard
          title="Total Revenue"
          value={stats.totalRevenue}
          change={stats.monthlyGrowth.revenue}
          changeType="increase"
          icon={DollarSign}
          prefix="MT "
        />
      </div>

      {/* Recent Activity - Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Artists</h2>
          <p className="text-gray-500">Artist list will be here...</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Top Tracks This Week</h2>
          <p className="text-gray-500">Track list will be here...</p>
        </div>
      </div>
    </div>
  );
}