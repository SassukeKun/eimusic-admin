/**
 * Página inicial do EiMusic Admin
 * Página simples para testar se tudo está funcionando
 */

export default function HomePage() {
  return (
    <div className="admin-bg min-h-screen">
      <div className="admin-gradient-line"></div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          {/* Logo/Título */}
          <h1 className="text-4xl md:text-6xl font-bold text-admin-gradient mb-4">
            EiMusic Admin
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Painel Administrativo da Plataforma Musical Moçambicana
          </p>
          
          {/* Cards de teste */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="admin-card p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Usuários
              </h3>
              <p className="text-gray-400">
                Gerir usuários da plataforma
              </p>
            </div>
            
            <div className="admin-card p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Artistas
              </h3>
              <p className="text-gray-400">
                Aprovar e verificar artistas
              </p>
            </div>
            
            <div className="admin-card p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Analytics
              </h3>
              <p className="text-gray-400">
                Relatórios e estatísticas
              </p>
            </div>
          </div>
          
          {/* Botões de teste */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <button className="admin-btn-primary">
              Acessar Dashboard
            </button>
            <button className="admin-btn-secondary">
              Ver Documentação
            </button>
          </div>
          
          {/* Status badges de teste */}
          <div className="flex flex-wrap gap-2 justify-center mt-8">
            <span className="status-approved">Aprovado</span>
            <span className="status-pending">Pendente</span>
            <span className="status-blocked">Bloqueado</span>
            <span className="status-verified">Verificado</span>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="text-center py-8 text-gray-500">
        <p>© 2025 EiMusic - Plataforma Musical Moçambicana</p>
      </footer>
    </div>
  );
}