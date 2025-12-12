import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading, 
  disabled,
  ...props 
}) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 active:scale-95";
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm disabled:bg-brand-300",
    secondary: "bg-orange-500 text-white hover:bg-orange-600 shadow-sm disabled:bg-orange-300",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100",
    ghost: "text-gray-600 hover:bg-gray-100"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input 
    className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${className}`}
    {...props}
  />
);

export const Badge: React.FC<{ children: React.ReactNode, color?: string }> = ({ children, color = 'bg-gray-100 text-gray-800' }) => (
  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${color}`}>
    {children}
  </span>
);

export const SectionHeader: React.FC<{ title: string, action?: React.ReactNode }> = ({ title, action }) => (
  <div className="flex justify-between items-center mb-4 px-4 pt-2">
    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    {action}
  </div>
);