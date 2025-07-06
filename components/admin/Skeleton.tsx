// components/admin/Skeleton.tsx
'use client';

import React from 'react';

interface SkeletonProps {
  count?: number;
  rows?: number;
  height?: number | string;
  width?: number | string;
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
}
export default function Skeleton({
  count = 1,
  rows = 1,
  height = 20,
  width = '100%',
  className = '',
  variant = 'text',
}: SkeletonProps) {
  
  // Classes base do skeleton
  const baseClasses = [
    'animate-pulse',
    'bg-gray-200',
    'inline-block',
  ];

  // Variantes de formato
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    rounded: 'rounded-lg',
  };

  // Combinar classes
  const skeletonClasses = [
    ...baseClasses,
    variantClasses[variant],
    className,
  ].join(' ');

  // Determinar estilos inline
  const getSkeletonStyle = () => ({
    height: typeof height === 'number' ? `${height}px` : height,
    width: typeof width === 'number' ? `${width}px` : width,
  });

  // Renderizar um único skeleton
  const renderSkeleton = (index: number) => (
    <div
      key={`skeleton-${index}`}
      className={skeletonClasses}
      style={getSkeletonStyle()}
      aria-hidden="true"
    />
  );

  // Renderizar múltiplas linhas para texto
  const renderTextSkeletons = () => {
    const skeletons = [];
    
    for (let row = 0; row < rows; row++) {
      const isLastRow = row === rows - 1;
      const rowWidth = isLastRow && rows > 1 ? '75%' : width; // Última linha menor
      
      skeletons.push(
        <div
          key={`text-row-${row}`}
          className={skeletonClasses}
          style={{
            height: typeof height === 'number' ? `${height}px` : height,
            width: typeof rowWidth === 'number' ? `${rowWidth}px` : rowWidth,
            marginBottom: row < rows - 1 ? '8px' : '0',
          }}
          aria-hidden="true"
        />
      );
    }
    
    return skeletons;
  };

  // Renderizar múltiplos elementos
  const renderMultipleSkeletons = () => {
    const skeletons = [];
    
    for (let i = 0; i < count; i++) {
      if (variant === 'text' && rows > 1) {
        skeletons.push(
          <div key={`skeleton-group-${i}`} className="mb-4">
            {renderTextSkeletons()}
          </div>
        );
      } else {
        skeletons.push(renderSkeleton(i));
      }
    }
    
    return skeletons;
  };

  return (
    <div className="space-y-2">
      {count === 1 && rows === 1 
        ? renderSkeleton(0)
        : renderMultipleSkeletons()
      }
    </div>
  );
}

// Componente helper para skeleton de tabela
export function TableSkeleton({ 
  rows = 5, 
  columns = 4 
}: { 
  rows?: number; 
  columns?: number; 
}) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header skeleton */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={`header-${index}`} height={16} width="60%" />
          ))}
        </div>
      </div>
      
      {/* Rows skeleton */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="px-6 py-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton 
                  key={`cell-${rowIndex}-${colIndex}`} 
                  height={16} 
                  width={colIndex === 0 ? "80%" : "60%"} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente helper para skeleton de card
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton variant="circular" height={40} width={40} />
        <div className="flex-1">
          <Skeleton height={16} width="60%" className="mb-2" />
          <Skeleton height={14} width="40%" />
        </div>
      </div>
      <Skeleton rows={3} height={14} className="mb-4" />
      <div className="flex space-x-2">
        <Skeleton height={32} width={80} variant="rounded" />
        <Skeleton height={32} width={80} variant="rounded" />
      </div>
    </div>
  );
}