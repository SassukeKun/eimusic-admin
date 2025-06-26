// components/ui/Select.tsx
'use client';

import { useState, useRef, useEffect, useCallback, useMemo, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  X, 
  Check,
  Loader2,
  AlertCircle
} from 'lucide-react';
import FormField, { useFieldAccessibility } from './FormField';
import type { SelectProps, SelectOption } from '../../types/form';

/**
 * Classes de estilo para diferentes variantes e tamanhos
 */
const selectVariants = {
  default: 'border border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500',
  filled: 'border-0 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500',
  outlined: 'border-2 border-gray-300 bg-transparent focus:border-blue-500',
};

const selectSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
};

/**
 * Animações para dropdown
 */
const dropdownAnimation = {
  initial: { opacity: 0, y: -8, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.95 },
  transition: { duration: 0.2, ease: 'easeOut' as const },
};

/**
 * Componente Select - Dropdown customizado com busca e seleção múltipla
 */
function Select<T extends string | number>({
  // FormField props
  label,
  required = false,
  disabled = false,
  error,
  helpText,
  state = 'idle',
  layout = 'vertical',
  size = 'md',
  variant = 'default',
  className = '',
  
  // Select specific props
  value,
  options = [],
  searchable = false,
  clearable = false,
  multiple = false,
  loading = false,
  emptyMessage = 'Nenhuma opção encontrada',
  maxHeight = 200,
  onChange,
  onSearch,
  placeholder = 'Selecione uma opção...',
  
  // HTML props
  id,
  ...rest
}: SelectProps<T>, ref: React.ForwardedRef<HTMLButtonElement>) {
  
  // Estados locais
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  
  // ID único para o campo
  const fieldId = useMemo(() => id || `select-${Math.random().toString(36).substr(2, 9)}`, [id]);
  
  // Props de acessibilidade
  const accessibilityProps = useFieldAccessibility(fieldId, !!error, !!helpText);
  
  // Filtrar opções baseado na busca
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    
    return options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (option.group && option.group.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [options, searchQuery]);
  
  // Agrupar opções se necessário
  const groupedOptions = useMemo(() => {
    const groups: Record<string, SelectOption<T>[]> = {};
    const ungrouped: SelectOption<T>[] = [];
    
    filteredOptions.forEach(option => {
      if (option.group) {
        if (!groups[option.group]) {
          groups[option.group] = [];
        }
        groups[option.group].push(option);
      } else {
        ungrouped.push(option);
      }
    });
    
    return { groups, ungrouped };
  }, [filteredOptions]);
  
  // Valor selecionado formatado
  const selectedOptions = useMemo(() => {
    if (!value) return [];
    
    const currentValues = Array.isArray(value) ? value : [value];
    return options.filter(option => currentValues.includes(option.value));
  }, [value, options]);
  
  // Classes do select
  const selectClasses = useMemo(() => {
    const baseClasses = [
      'w-full rounded-md transition-colors duration-200 cursor-pointer',
      'focus:outline-none focus:ring-1',
      'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
      'flex items-center justify-between',
    ];
    
    const variantClasses = selectVariants[variant];
    const sizeClasses = selectSizes[size];
    
    if (error) {
      baseClasses.push('border-red-300 focus:border-red-500 focus:ring-red-500');
    }
    
    return [
      ...baseClasses,
      variantClasses,
      sizeClasses,
      className,
    ].join(' ');
  }, [variant, size, error, className]);
  
  // Handlers
  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen(prev => !prev);
      setHighlightedIndex(-1);
    }
  }, [disabled]);
  
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
  }, []);
  
  const handleSelect = useCallback((option: SelectOption<T>) => {
    if (option.disabled) return;
    
    if (multiple) {
      const currentValues = Array.isArray(value) ? value as T[] : [];
      const newValues = currentValues.includes(option.value)
        ? currentValues.filter(v => v !== option.value)
        : [...currentValues, option.value];
      
      const selectedOpts = options.filter(opt => newValues.includes(opt.value));
      onChange?.(newValues, selectedOpts);
    } else {
      onChange?.(option.value, option);
      handleClose();
    }
  }, [multiple, value, options, onChange, handleClose]);
  
  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      onChange?.([] as T[], []);
    } else {
      onChange?.(null as unknown as T, undefined);
    }
  }, [multiple, onChange]);
  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
    setHighlightedIndex(-1);
  }, [onSearch]);
  
  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (highlightedIndex >= 0) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        handleClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
    }
  }, [disabled, isOpen, highlightedIndex, filteredOptions, handleSelect, handleClose]);
  
  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focar no campo de busca se estiver aberto
      if (searchable && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 0);
      }
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, searchable, handleClose]);
  
  // Scroll para opção destacada
  useEffect(() => {
    if (highlightedIndex >= 0 && optionsRef.current) {
      const optionElement = optionsRef.current.children[highlightedIndex] as HTMLElement;
      if (optionElement) {
        optionElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);
  
  // Renderizar valor selecionado
  const renderSelectedValue = () => {
    if (loading) {
      return (
        <div className="flex items-center text-gray-500">
          <Loader2 className="size-4 mr-2 animate-spin" />
          Carregando...
        </div>
      );
    }
    
    if (selectedOptions.length === 0) {
      return <span className="text-gray-400">{placeholder}</span>;
    }
    
    if (multiple) {
      return (
        <div className="flex flex-wrap gap-1">
          {selectedOptions.slice(0, 2).map(option => (
            <span
              key={option.value}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800"
            >
              {option.label}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(option);
                }}
                className="ml-1 hover:text-blue-600"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
          {selectedOptions.length > 2 && (
            <span className="text-sm text-gray-500">
              +{selectedOptions.length - 2} mais
            </span>
          )}
        </div>
      );
    }
    
    return <span>{selectedOptions[0].label}</span>;
  };
  
  // Renderizar opção
  const renderOption = (option: SelectOption<T>, index: number) => {
    const isSelected = multiple 
      ? Array.isArray(value) && value.includes(option.value)
      : value === option.value;
    const isHighlighted = index === highlightedIndex;
    
    return (
      <div
        key={option.value}
        role="option"
        aria-selected={isSelected}
        className={`
          px-3 py-2 cursor-pointer flex items-center justify-between
          ${isHighlighted ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50'}
          ${isSelected ? 'bg-blue-100 text-blue-900 font-medium' : ''}
          ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !option.disabled && handleSelect(option)}
      >
        <span>{option.label}</span>
        {isSelected && <Check className="size-4 text-blue-600" />}
      </div>
    );
  };

  return (
    <FormField
      id={fieldId}
      label={label}
      required={required}
      error={error}
      helpText={helpText}
      state={state}
      layout={layout}
      size={size}
    >
      <div className="relative" ref={dropdownRef}>
        {/* Select trigger */}
        <button
          {...rest}
          {...accessibilityProps}
          ref={ref}
          type="button"
          className={selectClasses}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="flex-1 text-left min-w-0">
            {renderSelectedValue()}
          </div>
          
          <div className="flex items-center space-x-1 ml-2">
            {/* Clear button */}
            {clearable && selectedOptions.length > 0 && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 p-0.5"
                aria-label="Limpar seleção"
              >
                <X className="size-4" />
              </button>
            )}
            
            {/* Dropdown chevron */}
            {isOpen ? (
              <ChevronUp className="size-4 text-gray-400" />
            ) : (
              <ChevronDown className="size-4 text-gray-400" />
            )}
          </div>
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={dropdownAnimation.initial}
              animate={dropdownAnimation.animate}
              exit={dropdownAnimation.exit}
              transition={dropdownAnimation.transition}
              className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
              style={{ maxHeight: maxHeight + 60 }}
            >
              {/* Search input */}
              {searchable && (
                <div className="p-2 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Buscar opções..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
              )}

              {/* Options list */}
              <div
                ref={optionsRef}
                className="overflow-y-auto"
                style={{ maxHeight }}
                role="listbox"
                aria-multiselectable={multiple}
              >
                {loading ? (
                  <div className="flex items-center justify-center py-8 text-gray-500">
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Carregando opções...
                  </div>
                ) : filteredOptions.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-gray-500">
                    <AlertCircle className="size-4 mr-2" />
                    {emptyMessage}
                  </div>
                ) : (
                  <>
                    {/* Ungrouped options */}
                    {groupedOptions.ungrouped.map((option, index) =>
                      renderOption(option, index)
                    )}
                    
                    {/* Grouped options */}
                    {Object.entries(groupedOptions.groups).map(([groupName, groupOptions]) => (
                      <div key={groupName}>
                        <div className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-50 border-t border-gray-200">
                          {groupName}
                        </div>
                        {groupOptions.map((option, index) =>
                          renderOption(option, groupedOptions.ungrouped.length + index)
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FormField>
  );
}

// Display name para debugging
Select.displayName = 'Select';

export default forwardRef(Select) as <T extends string | number>(
  props: SelectProps<T> & { ref?: React.ForwardedRef<HTMLButtonElement> }
) => React.ReactElement;