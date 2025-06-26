// components/admin/DataTable.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  onSort,
  onRowClick,
}: {
  data: T[];
  columns: Array<{
    key: keyof T;
    label: string;
    sortable?: boolean;
    render?: (value: unknown, item: T) => React.ReactNode;
  }>;
  onSort?: (key: keyof T) => void;
  onRowClick?: (item: T) => void;
}) {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  // Manipulador de ordenação
  const handleSort = (key: keyof T) => {
    if (sortField === key) {
      // Inverter direção se o campo já estiver ordenado
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Novo campo de ordenação
      setSortField(key);
      setSortDirection('asc');
    }
    
    // Chamar o manipulador externo se fornecido
    if (onSort) {
      onSort(key);
    }
  };

  const handleRowClick = (item: T) => {
    if (onRowClick) {
      // Se tiver um ID, usá-lo para destacar a linha selecionada
      if ('id' in item) {
        setSelectedRow(String(item.id));
      }
      onRowClick(item);
    }
  };

  // Se não houver dados, mostrar uma mensagem amigável
  if (data.length === 0) {
    return (
      <div className="card animate-fade-in">
        <div className="p-6 text-center">
          <div className="text-muted mb-2">
            <svg className="mx-auto size-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground">Nenhum dado encontrado</h3>
          <p className="mt-1 text-muted">Tente ajustar seus filtros ou adicionar novos itens.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  scope="col"
                  className={`table-header ${
                    column.sortable ? 'cursor-pointer hover:text-foreground' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    <span>{column.label}</span>
                    {column.sortable && sortField === column.key && (
                      sortDirection === 'asc' ? (
                        <ChevronUp className="size-4 text-muted" />
                      ) : (
                        <ChevronDown className="size-4 text-muted" />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-border">
            {data.map((row, index) => {
              const isSelected = 'id' in row && selectedRow === String(row.id);
              
              return (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  onClick={() => handleRowClick(row)}
                  className={`
                    table-row
                    ${onRowClick ? 'cursor-pointer' : ''}
                    ${isSelected ? 'bg-primary/5' : ''}
                  `}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="table-cell"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : String(row[column.key])}
                    </td>
                  ))}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-border">
        <div className="text-sm text-muted">
          Mostrando <span className="font-medium text-foreground">{data.length}</span> {data.length === 1 ? 'item' : 'itens'}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled
          >
            Anterior
          </button>
          <span className="px-3 py-1 text-sm text-foreground bg-white border border-border rounded-md">
            1
          </span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}