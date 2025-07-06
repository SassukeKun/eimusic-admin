import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface VideoData {
  id: string;
  title: string;
  thumbnail_url: string | null;
  views: number;
  likes: number;
}

interface DeleteConfirmationModalProps {
  video: VideoData;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationModal({ video, onClose, onConfirm }: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header com aviso */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-white">
              <div className="p-2 bg-white/20 rounded-lg">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Confirmar Exclusão</h2>
                <p className="text-red-100 text-sm">Esta ação não pode ser desfeita</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        {/* Conteúdo */}
       <div className="p-6">
         {/* Preview do vídeo a ser deletado */}
         <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl mb-6">
           {video.thumbnail_url ? (
             <img
               src={video.thumbnail_url}
               alt={`Thumbnail de ${video.title}`}
               className="h-16 w-24 rounded-lg object-cover flex-shrink-0"
             />
           ) : (
             <div className="h-16 w-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
               <span className="text-gray-500 text-xs">Sem thumbnail</span>
             </div>
           )}
           <div className="flex-1 min-w-0">
             <h3 className="font-semibold text-gray-900 line-clamp-2">{video.title}</h3>
             <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
               <span>{video.views.toLocaleString()} views</span>
               <span>{video.likes} likes</span>
             </div>
           </div>
         </div>

         {/* Mensagem de confirmação */}
         <div className="text-center">
           <h3 className="text-lg font-semibold text-gray-900 mb-2">
             Tem certeza que deseja excluir este vídeo?
           </h3>
           <p className="text-gray-600 mb-6">
             O vídeo será removido permanentemente da plataforma. 
             Esta ação não pode ser desfeita.
           </p>

           {/* Avisos importantes */}
           <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
             <h4 className="font-semibold text-red-800 mb-2">⚠️ O que será perdido:</h4>
             <ul className="text-sm text-red-700 space-y-1">
               <li>• Todas as visualizações e estatísticas</li>
               <li>• Likes e comentários dos usuários</li>
               <li>• Histórico e métricas do vídeo</li>
               <li>• Links e referências externas</li>
             </ul>
           </div>
         </div>
       </div>

       {/* Footer com botões */}
       <div className="flex space-x-3 p-6 bg-gray-50 border-t">
         <button
           onClick={onClose}
           className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
         >
           Cancelar
         </button>
         <button
           onClick={onConfirm}
           className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium flex items-center justify-center space-x-2 shadow-lg"
         >
           <Trash2 className="h-4 w-4" />
           <span>Excluir Vídeo</span>
         </button>
       </div>
     </div>
   </div>
 );
}