// app/admin/settings/page.tsx
'use client';

import { useState } from 'react';
import { 
  Save, 
  Settings as SettingsIcon, 
  Bell, 
  DollarSign, 
  Palette, 
  RotateCcw, 
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { 
  SystemSettings, 
  NotificationSettings, 
  MonetizationSettings, 
  InterfaceSettings 
} from '@/types/admin';

// Componente de alternância (switch)
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <div className="flex items-start">
      <button 
        type="button" 
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          checked ? 'bg-indigo-600' : 'bg-gray-200'
        }`}
      >
        <span 
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`} 
        />
      </button>
      {(label || description) && (
        <div className="ml-3">
          {label && <span className="text-sm font-medium text-gray-900">{label}</span>}
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      )}
    </div>
  );
}

// Componente de Entrada de Texto
interface InputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  description?: string;
  required?: boolean;
}

function Input({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = 'text',
  description,
  required = false
}: InputProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        required={required}
      />
    </div>
  );
}

// Componente de Seleção
interface SelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  description?: string;
  required?: boolean;
}

function Select({ 
  id, 
  label, 
  value, 
  onChange, 
  options,
  description,
  required = false
}: SelectProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        required={required}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Componente de Entrada Numérica
interface NumberInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  description?: string;
  required?: boolean;
}

function NumberInput({ 
  id, 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1,
  suffix,
  description,
  required = false
}: NumberInputProps) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          type="number"
          id={id}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="block w-full rounded-md border-gray-300 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required={required}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{suffix}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  // Estado para controlar qual seção de configurações está ativa
  const [activeTab, setActiveTab] = useState<'system' | 'notifications' | 'monetization' | 'interface'>('system');
  
  // Estados para os diferentes tipos de configurações
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: 'EiMusic',
    siteDescription: 'Plataforma de distribuição e monetização de conteúdo audiovisual para Moçambique',
    contactEmail: 'suporte@eimusic.co.mz',
    supportPhone: '+258 84 123 4567',
    maintenanceMode: false,
    allowNewRegistrations: true,
    defaultLanguage: 'pt',
    defaultCurrency: 'MZN',
  });
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    newArtistAlert: true,
    newContentAlert: true,
    revenueReports: true,
    systemUpdates: false,
    loginAlerts: false,
  });
  
  const [monetizationSettings, setMonetizationSettings] = useState<MonetizationSettings>({
    defaultCommissionRate: 15, // 15%
    minimumPayoutAmount: 500, // 500 MT
    payoutSchedule: 'monthly',
    allowMicroDonations: true,
    allowSubscriptions: true,
  });
  
  const [interfaceSettings, setInterfaceSettings] = useState<InterfaceSettings>({
    theme: 'light',
    sidebarCollapsed: false,
    itemsPerPage: 25,
    enableAnimations: true,
    dashboardLayout: 'standard',
  });
  
  // Estado para controlar mensagens de sucesso/erro
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState<string>('');
  
  // Função para salvar as configurações
  const saveSettings = () => {
    setSaveStatus('saving');
    
    // Simulando uma chamada de API
    setTimeout(() => {
      setSaveStatus('success');
      setSaveMessage('Configurações salvas com sucesso');
      
      // Limpar mensagem após alguns segundos
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 3000);
    }, 1000);
  };
  
  // Função para resetar as configurações para os valores padrão
  const resetSettings = () => {
    if (window.confirm('Tem certeza que deseja resetar todas as configurações para os valores padrão?')) {
      switch (activeTab) {
        case 'system':
          setSystemSettings({
            siteName: 'EiMusic',
            siteDescription: 'Plataforma de distribuição e monetização de conteúdo audiovisual para Moçambique',
            contactEmail: 'suporte@eimusic.co.mz',
            supportPhone: '+258 84 123 4567',
            maintenanceMode: false,
            allowNewRegistrations: true,
            defaultLanguage: 'pt',
            defaultCurrency: 'MZN',
          });
          break;
        case 'notifications':
          setNotificationSettings({
            emailNotifications: true,
            newArtistAlert: true,
            newContentAlert: true,
            revenueReports: true,
            systemUpdates: false,
            loginAlerts: false,
          });
          break;
        case 'monetization':
          setMonetizationSettings({
            defaultCommissionRate: 15,
            minimumPayoutAmount: 500,
            payoutSchedule: 'monthly',
            allowMicroDonations: true,
            allowSubscriptions: true,
          });
          break;
        case 'interface':
          setInterfaceSettings({
            theme: 'light',
            sidebarCollapsed: false,
            itemsPerPage: 25,
            enableAnimations: true,
            dashboardLayout: 'standard',
          });
          break;
      }
      
      setSaveStatus('success');
      setSaveMessage('Configurações restauradas para os valores padrão');
      
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 3000);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">
          Gerencie as configurações da plataforma EiMusic.
        </p>
      </div>
      
      {/* Mensagem de status */}
      {saveStatus !== 'idle' && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`mb-6 p-4 rounded-md ${
            saveStatus === 'success' ? 'bg-green-50 text-green-800' : 
            saveStatus === 'error' ? 'bg-red-50 text-red-800' : 
            'bg-blue-50 text-blue-800'
          }`}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              {saveStatus === 'success' ? (
                <Check className="h-5 w-5 text-green-400" />
              ) : saveStatus === 'error' ? (
                <div className="h-5 w-5 text-red-400">!</div>
              ) : (
                <div className="h-5 w-5 text-blue-400 animate-spin">
                  <RotateCcw className="h-5 w-5" />
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                {saveStatus === 'saving' ? 'Salvando configurações...' : saveMessage}
              </p>
            </div>
          </div>
        </motion.div>
      )}
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Abas de navegação */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('system')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'system'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <SettingsIcon className="mr-2 h-5 w-5" />
                Sistema
              </div>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notificações
              </div>
            </button>
            <button
              onClick={() => setActiveTab('monetization')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'monetization'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Monetização
              </div>
            </button>
            <button
              onClick={() => setActiveTab('interface')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'interface'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Palette className="mr-2 h-5 w-5" />
                Interface
              </div>
            </button>
          </nav>
        </div>
        
        {/* Conteúdo das configurações */}
        <div className="p-6">
          {/* Configurações do Sistema */}
          {activeTab === 'system' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Configurações do Sistema</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    id="siteName"
                    label="Nome do Site"
                    value={systemSettings.siteName}
                    onChange={(value) => setSystemSettings({...systemSettings, siteName: value})}
                    placeholder="EiMusic"
                    required
                  />
                  
                  <Input
                    id="siteDescription"
                    label="Descrição do Site"
                    value={systemSettings.siteDescription}
                    onChange={(value) => setSystemSettings({...systemSettings, siteDescription: value})}
                    placeholder="Descrição breve da plataforma"
                  />
                  
                  <Input
                    id="contactEmail"
                    label="Email de Contato"
                    type="email"
                    value={systemSettings.contactEmail}
                    onChange={(value) => setSystemSettings({...systemSettings, contactEmail: value})}
                    placeholder="contato@exemplo.com"
                    required
                  />
                  
                  <Input
                    id="supportPhone"
                    label="Telefone de Suporte"
                    value={systemSettings.supportPhone}
                    onChange={(value) => setSystemSettings({...systemSettings, supportPhone: value})}
                    placeholder="+258 XX XXX XXXX"
                  />
                </div>
                
                <div>
                  <div className="mb-6">
                    <Toggle
                      checked={systemSettings.maintenanceMode}
                      onChange={(checked) => setSystemSettings({...systemSettings, maintenanceMode: checked})}
                      label="Modo de Manutenção"
                      description="Quando ativado, o site fica indisponível para usuários não administradores"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <Toggle
                      checked={systemSettings.allowNewRegistrations}
                      onChange={(checked) => setSystemSettings({...systemSettings, allowNewRegistrations: checked})}
                      label="Permitir Novos Registros"
                      description="Se desativado, novos usuários não poderão se registrar"
                    />
                  </div>
                  
                  <Select
                    id="defaultLanguage"
                    label="Idioma Padrão"
                    value={systemSettings.defaultLanguage}
                    onChange={(value) => setSystemSettings({...systemSettings, defaultLanguage: value})}
                    options={[
                      { value: 'pt', label: 'Português' },
                      { value: 'en', label: 'Inglês' },
                    ]}
                  />
                  
                  <Select
                    id="defaultCurrency"
                    label="Moeda Padrão"
                    value={systemSettings.defaultCurrency}
                    onChange={(value) => setSystemSettings({...systemSettings, defaultCurrency: value})}
                    options={[
                      { value: 'MZN', label: 'Metical Moçambicano (MT)' },
                      { value: 'USD', label: 'Dólar Americano ($)' },
                    ]}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Configurações de Notificações */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Configurações de Notificações</h2>
              
              <div className="space-y-6">
                <div className="mb-6">
                  <Toggle
                    checked={notificationSettings.emailNotifications}
                    onChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                    label="Notificações por Email"
                    description="Ativar envio de notificações por email"
                  />
                </div>
                
                <div className="mb-6">
                  <Toggle
                    checked={notificationSettings.newArtistAlert}
                    onChange={(checked) => setNotificationSettings({...notificationSettings, newArtistAlert: checked})}
                    label="Alertas de Novos Artistas"
                    description="Receber alertas quando novos artistas se registrarem"
                  />
                </div>
                
                <div className="mb-6">
                  <Toggle
                    checked={notificationSettings.newContentAlert}
                    onChange={(checked) => setNotificationSettings({...notificationSettings, newContentAlert: checked})}
                    label="Alertas de Novo Conteúdo"
                    description="Receber alertas quando novo conteúdo for enviado"
                  />
                </div>
                
                <div className="mb-6">
                  <Toggle
                    checked={notificationSettings.revenueReports}
                    onChange={(checked) => setNotificationSettings({...notificationSettings, revenueReports: checked})}
                    label="Relatórios de Receita"
                    description="Receber relatórios periódicos de receita"
                  />
                </div>
                
                <div className="mb-6">
                  <Toggle
                    checked={notificationSettings.systemUpdates}
                    onChange={(checked) => setNotificationSettings({...notificationSettings, systemUpdates: checked})}
                    label="Atualizações do Sistema"
                    description="Receber notificações sobre atualizações do sistema"
                  />
                </div>
                
                <div className="mb-6">
                  <Toggle
                    checked={notificationSettings.loginAlerts}
                    onChange={(checked) => setNotificationSettings({...notificationSettings, loginAlerts: checked})}
                    label="Alertas de Login"
                    description="Receber alertas quando houver login na sua conta"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Configurações de Monetização */}
          {activeTab === 'monetization' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Configurações de Monetização</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <NumberInput
                    id="defaultCommissionRate"
                    label="Taxa de Comissão Padrão"
                    value={monetizationSettings.defaultCommissionRate}
                    onChange={(value) => setMonetizationSettings({...monetizationSettings, defaultCommissionRate: value})}
                    min={0}
                    max={100}
                    step={0.5}
                    suffix="%"
                    description="Porcentagem retida pela plataforma sobre os ganhos dos artistas"
                    required
                  />
                  
                  <NumberInput
                    id="minimumPayoutAmount"
                    label="Valor Mínimo para Pagamento"
                    value={monetizationSettings.minimumPayoutAmount}
                    onChange={(value) => setMonetizationSettings({...monetizationSettings, minimumPayoutAmount: value})}
                    min={0}
                    step={100}
                    suffix="MT"
                    description="Valor mínimo que um artista precisa acumular para receber pagamento"
                    required
                  />
                  
                  <Select
                    id="payoutSchedule"
                    label="Frequência de Pagamentos"
                    value={monetizationSettings.payoutSchedule}
                    onChange={(value) => setMonetizationSettings({...monetizationSettings, payoutSchedule: value as 'weekly' | 'biweekly' | 'monthly'})}
                    options={[
                      { value: 'weekly', label: 'Semanal' },
                      { value: 'biweekly', label: 'Quinzenal' },
                      { value: 'monthly', label: 'Mensal' },
                    ]}
                    description="Com que frequência os pagamentos são processados"
                  />
                </div>
                
                <div>
                  <div className="mb-6">
                    <Toggle
                      checked={monetizationSettings.allowMicroDonations}
                      onChange={(checked) => setMonetizationSettings({...monetizationSettings, allowMicroDonations: checked})}
                      label="Permitir Micro Doações"
                      description="Permitir que ouvintes façam pequenas doações aos artistas"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <Toggle
                      checked={monetizationSettings.allowSubscriptions}
                      onChange={(checked) => setMonetizationSettings({...monetizationSettings, allowSubscriptions: checked})}
                      label="Permitir Assinaturas"
                      description="Permitir que usuários assinem conteúdo exclusivo"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Configurações de Interface */}
          {activeTab === 'interface' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Configurações de Interface</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Select
                    id="theme"
                    label="Tema"
                    value={interfaceSettings.theme}
                    onChange={(value) => setInterfaceSettings({...interfaceSettings, theme: value as 'light' | 'dark' | 'system'})}
                    options={[
                      { value: 'light', label: 'Claro' },
                      { value: 'dark', label: 'Escuro' },
                      { value: 'system', label: 'Sistema (automático)' },
                    ]}
                  />
                  
                  <NumberInput
                    id="itemsPerPage"
                    label="Itens por Página"
                    value={interfaceSettings.itemsPerPage}
                    onChange={(value) => setInterfaceSettings({...interfaceSettings, itemsPerPage: value})}
                    min={10}
                    max={100}
                    step={5}
                    description="Número de itens mostrados em tabelas de listagem"
                  />
                  
                  <Select
                    id="dashboardLayout"
                    label="Layout do Dashboard"
                    value={interfaceSettings.dashboardLayout}
                    onChange={(value) => setInterfaceSettings({...interfaceSettings, dashboardLayout: value as 'compact' | 'standard' | 'detailed'})}
                    options={[
                      { value: 'compact', label: 'Compacto' },
                      { value: 'standard', label: 'Padrão' },
                      { value: 'detailed', label: 'Detalhado' },
                    ]}
                  />
                </div>
                
                <div>
                  <div className="mb-6">
                    <Toggle
                      checked={interfaceSettings.sidebarCollapsed}
                      onChange={(checked) => setInterfaceSettings({...interfaceSettings, sidebarCollapsed: checked})}
                      label="Barra Lateral Recolhida"
                      description="Iniciar com a barra lateral recolhida"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <Toggle
                      checked={interfaceSettings.enableAnimations}
                      onChange={(checked) => setInterfaceSettings({...interfaceSettings, enableAnimations: checked})}
                      label="Ativar Animações"
                      description="Habilitar animações na interface"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Botões de ação */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <button
            type="button"
            onClick={resetSettings}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Resetar
          </button>
          
          <button
            type="button"
            onClick={saveSettings}
            disabled={saveStatus === 'saving'}
            className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              saveStatus === 'saving' ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {saveStatus === 'saving' ? (
              <>
                <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}