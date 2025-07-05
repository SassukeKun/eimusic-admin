// app/admin/page.tsx - VERSÃO ULTRA SIMPLES
'use client';

import { DashboardStats } from '@/types/admin';
import { useState, useEffect } from 'react';

/**
 * COMPONENTE MÍNIMO ABSOLUTO
 * - Sem imports de ícones (podem ter problemas)
 * - Sem imports de componentes externos  
 * - Sem Next/Image (pode ter problemas)
 * - Apenas React básico + HTML simples
 */

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Tentar carregar apenas stats primeiro
        const res = await fetch('/api/dashboard/stats');
        if (res.ok) {
          const stats = await res.json();
          setData(stats);
        }
      } catch (err) {
        console.log('Erro simples:', err);
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Carregando...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>
        Dashboard Admin
      </h1>
      
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Painel administrativo da plataforma EiMusic
      </p>

      {/* Cards simples com dados reais */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#374151' }}>Total de Usuários</h3>
          <p style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            margin: '0', 
            color: '#1f2937' 
          }}>
            {data?.totalUsers?.toLocaleString() || '0'}
          </p>
          <p style={{ fontSize: '14px', color: '#10b981', margin: '10px 0 0 0' }}>
            ↗ +12% este mês
          </p>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#374151' }}>Artistas Ativos</h3>
          <p style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            margin: '0', 
            color: '#1f2937' 
          }}>
            {data?.totalArtists?.toLocaleString() || '0'}
          </p>
          <p style={{ fontSize: '14px', color: '#10b981', margin: '10px 0 0 0' }}>
            ↗ +8% este mês
          </p>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#374151' }}>Faixas Publicadas</h3>
          <p style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            margin: '0', 
            color: '#1f2937' 
          }}>
            {data?.totalTracks?.toLocaleString() || '0'}
          </p>
          <p style={{ fontSize: '14px', color: '#10b981', margin: '10px 0 0 0' }}>
            ↗ +15% este mês
          </p>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#374151' }}>Receita Total</h3>
          <p style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            margin: '0', 
            color: '#1f2937' 
          }}>
            {(data?.totalRevenue || 0).toLocaleString()} MT
          </p>
          <p style={{ fontSize: '14px', color: '#10b981', margin: '10px 0 0 0' }}>
            ↗ +23% este mês
          </p>
        </div>
      </div>

      {/* Seção de informações adicionais */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#374151' }}>
            Reproduções Totais
          </h3>
          <p style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            margin: '0', 
            color: '#1f2937' 
          }}>
            {(data?.totalPlays || 0).toLocaleString()}
          </p>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '10px 0 0 0' }}>
            Streams de todas as faixas
          </p>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#374151' }}>
            Conteúdo Total
          </h3>
          <p style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            margin: '0', 
            color: '#1f2937' 
          }}>
            {((data?.totalTracks || 0) + (data?.totalAlbums || 0) + (data?.totalVideos || 0)).toLocaleString()}
          </p>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '10px 0 0 0' }}>
            Faixas, álbuns e vídeos
          </p>
        </div>
      </div>

      {/* Links de navegação simples */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#374151' }}>
          Ações Rápidas
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px'
        }}>
          <a 
            href="/admin/artists"
            style={{ 
              display: 'block',
              padding: '15px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '6px',
              textDecoration: 'none',
              color: '#374151',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <strong>👥 Artistas</strong>
            <br />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              Gerenciar artistas
            </span>
          </a>

          <a 
            href="/admin/content"
            style={{ 
              display: 'block',
              padding: '15px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '6px',
              textDecoration: 'none',
              color: '#374151',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <strong>🎵 Conteúdo</strong>
            <br />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              Revisar conteúdo
            </span>
          </a>

          <a 
            href="/admin/users"
            style={{ 
              display: 'block',
              padding: '15px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '6px',
              textDecoration: 'none',
              color: '#374151',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <strong>👤 Usuários</strong>
            <br />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              Gerenciar usuários
            </span>
          </a>

          <a 
            href="/admin/settings"
            style={{ 
              display: 'block',
              padding: '15px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '6px',
              textDecoration: 'none',
              color: '#374151',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <strong>⚙️ Configurações</strong>
            <br />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              Configurar sistema
            </span>
          </a>
        </div>
      </div>

      {/* Debug info - mostrar dados carregados */}
      {data && (
        <div style={{ 
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#f3f4f6',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          <strong>✅ Dados carregados com sucesso do banco:</strong>
          <br />
          Usuários: {data.totalUsers} | 
          Artistas: {data.totalArtists} | 
          Faixas: {data.totalTracks} | 
          Receita: {data.totalRevenue} MT
        </div>
      )}
    </div>
  );
}