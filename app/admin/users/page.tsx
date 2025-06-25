'use client';

import { useState } from 'react';
import { UserPlus, Download, Filter } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import SearchBar from '@/components/admin/SearchBar';
import { mockUsers } from '@/data/mockups';
import type { User, TableColumn } from '@/types/admin';
import Image from 'next/image';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');

  // Filter users
  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  // Table columns
  const columns: TableColumn<User>[] = [
    {
      key: 'name',
      label: 'User',
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center space-x-3">
          <Image
            src={item.avatar || 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff'}
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
      key: 'plan',
      label: 'Plan',
      render: (value) => (
        <span className={`
          px-2 py-1 text-xs font-medium rounded-full capitalize
          ${value === 'premium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}
        `}>
          {value}
        </span>
      ),
    },
    {
      key: 'joinedDate',
      label: 'Joined',
      sortable: true,
      render: (value) => new Date(String(value)).toLocaleDateString('pt-MZ'),
    },
    {
      key: 'lastActive',
      label: 'Last Active',
      sortable: true,
      render: (value) => new Date(String(value)).toLocaleDateString('pt-MZ'),
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      sortable: true,
      render: (value) => `MT ${Number(value).toLocaleString()}`,
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
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage platform users and subscriptions</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
            <Download size={20} className="mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
            <UserPlus size={20} className="mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search users..."
          />

          {/* Plan Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
            >
              <option value="all">All Plans</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <DataTable
        data={filteredUsers}
        columns={columns}
        onRowClick={(user) => console.log('User clicked:', user)}
      />

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{mockUsers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Premium Users</p>
          <p className="text-2xl font-bold text-gray-900">
            {mockUsers.filter(u => u.plan === 'premium').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">
            MT {mockUsers.reduce((sum, u) => sum + u.totalSpent, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}