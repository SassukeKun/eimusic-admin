'use client';

import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import { mockArtists } from '@/data/mockups';
import type { Artist, TableColumn } from '@/types/admin';
import Image from 'next/image';

export default function ArtistsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter artists based on search and status
  const filteredArtists = mockArtists.filter((artist) => {
    const matchesSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         artist.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || artist.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Table columns configuration
  const columns: TableColumn<Artist>[] = [
    {
      key: 'name',
      label: 'Artist',
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center space-x-3">
          <Image
            src={item.profileImage || 'https://ui-avatars.com/api/?name=Artist&background=6366f1&color=fff'}
            alt={item.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-gray-500">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'genre',
      label: 'Genre',
      sortable: true,
    },
    {
      key: 'totalTracks',
      label: 'Tracks',
      sortable: true,
    },
    {
      key: 'totalRevenue',
      label: 'Revenue',
      sortable: true,
      render: (value, item) => `MT ${item.totalRevenue.toLocaleString()}`,
    },
    {
      key: 'monetizationPlan',
      label: 'Plan',
      render: (value) => (
        <span className={`
          px-2 py-1 text-xs font-medium rounded-full capitalize
          ${value === 'enterprise' ? 'bg-purple-100 text-purple-800' :
            value === 'premium' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'}
        `}>
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`
          px-2 py-1 text-xs font-medium rounded-full capitalize
          ${value === 'active' ? 'bg-green-100 text-green-800' :
            value === 'inactive' ? 'bg-gray-100 text-gray-800' :
            'bg-red-100 text-red-800'}
        `}>
          {value}
        </span>
      ),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Artists</h1>
          <p className="text-gray-600 mt-1">Manage and monitor artist accounts</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
          <Plus size={20} className="mr-2" />
          Add Artist
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artists..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Artists Table */}
      <DataTable
        data={filteredArtists}
        columns={columns}
        onRowClick={(artist) => console.log('Artist clicked:', artist)}
      />
    </div>
  );
}