/**
 * Form System Types
 * Interfaces e tipos para o sistema de formulários
 */

// Estados possíveis de um campo
export type FieldState = 'idle' | 'loading' | 'error' | 'success' | 'disabled';

// Layout do campo
export type FieldLayout = 'vertical' | 'horizontal';

// Tamanhos disponíveis para campos
export type FieldSize = 'sm' | 'md' | 'lg';

// Variantes visuais
export type FieldVariant = 'default' | 'filled' | 'outlined';

// Interface base para todos os campos de formulário
export interface BaseFieldProps {
  readonly id?: string;
  readonly name?: string;
  readonly label?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly error?: string;
  readonly helpText?: string;
  readonly placeholder?: string;
  readonly className?: string;
  readonly state?: FieldState;
  readonly layout?: FieldLayout;
  readonly size?: FieldSize;
  readonly variant?: FieldVariant;
}

// Props específicas do FormField wrapper
export interface FormFieldProps extends BaseFieldProps {
  readonly children: React.ReactNode;
  readonly labelPosition?: 'top' | 'left' | 'hidden';
  readonly showAsterisk?: boolean; // Mostra * para campos obrigatórios
  readonly errorIcon?: boolean; // Mostra ícone de erro
  readonly successIcon?: boolean; // Mostra ícone de sucesso
}

// Props para Input de texto
export interface InputProps extends BaseFieldProps {
  readonly type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
  readonly value?: string;
  readonly defaultValue?: string;
  readonly maxLength?: number;
  readonly minLength?: number;
  readonly pattern?: string;
  readonly autoComplete?: string;
  readonly autoFocus?: boolean;
  readonly onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  readonly onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  readonly onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  readonly leftIcon?: React.ReactNode;
  readonly rightIcon?: React.ReactNode;
  readonly clearable?: boolean; // Botão para limpar valor
}

// Opções para Select
export interface SelectOption<T = string | number> {
  readonly value: T;
  readonly label: string;
  readonly disabled?: boolean;
  readonly group?: string;
}

// Props para Select
export interface SelectProps<T = string | number> extends BaseFieldProps {
  readonly value?: T;
  readonly defaultValue?: T;
  readonly options: readonly SelectOption<T>[];
  readonly searchable?: boolean;
  readonly clearable?: boolean;
  readonly multiple?: boolean;
  readonly onChange?: (value: T | T[], option?: SelectOption<T> | SelectOption<T>[]) => void;
  readonly onSearch?: (query: string) => void;
  readonly loading?: boolean;
  readonly emptyMessage?: string;
  readonly maxHeight?: number;
}

// Props para Textarea
export interface TextareaProps extends BaseFieldProps {
  readonly value?: string;
  readonly defaultValue?: string;
  readonly rows?: number;
  readonly cols?: number;
  readonly maxLength?: number;
  readonly minLength?: number;
  readonly resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  readonly autoResize?: boolean; // Ajusta altura automaticamente
  readonly onChange?: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readonly onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  readonly onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
}

// Props para Checkbox
export interface CheckboxProps extends BaseFieldProps {
  readonly checked?: boolean;
  readonly defaultChecked?: boolean;
  readonly indeterminate?: boolean;
  readonly onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly children?: React.ReactNode; // Label content
}

// Props para Switch
export interface SwitchProps extends BaseFieldProps {
  readonly checked?: boolean;
  readonly defaultChecked?: boolean;
  readonly onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly children?: React.ReactNode; // Label content
  readonly thumbIcon?: React.ReactNode;
}

// Tipos para validação
export type ValidationRule<T = string> = {
  readonly required?: boolean | string;
  readonly minLength?: number | { value: number; message: string };
  readonly maxLength?: number | { value: number; message: string };
  readonly pattern?: RegExp | { value: RegExp; message: string };
  readonly min?: number | { value: number; message: string };
  readonly max?: number | { value: number; message: string };
  readonly validate?: (value: T) => string | boolean | Promise<string | boolean>;
  readonly custom?: Array<(value: T) => string | boolean | Promise<string | boolean>>;
};

// Estado de um campo no formulário
export interface FormFieldState<T = unknown> {
  readonly value: T;
  readonly error?: string;
  readonly touched: boolean;
  readonly dirty: boolean;
  readonly validating: boolean;
}

// Estado completo do formulário
export interface FormState {
  readonly [fieldName: string]: FormFieldState;
}

// Context do formulário
export interface FormContextValue {
  readonly state: FormState;
  readonly setValue: <T>(name: string, value: T) => void;
  readonly setError: (name: string, error: string) => void;
  readonly clearError: (name: string) => void;
  readonly setTouched: (name: string, touched?: boolean) => void;
  readonly getFieldState: <T>(name: string) => FormFieldState<T> | undefined;
  readonly isSubmitting: boolean;
  readonly isValid: boolean;
  readonly reset: (values?: Record<string, unknown>) => void;
  readonly submit: () => Promise<boolean>;
}