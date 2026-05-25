'use client';

import React from 'react';

/**
 * Bottone primario con stile organico
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sand-400 focus:ring-offset-2 focus:ring-offset-sand-100 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-sand-500 hover:bg-sand-600 text-sand-100 shadow-lg shadow-sand-500/20 hover:shadow-xl hover:shadow-sand-500/30',
    secondary: 'bg-sand-200 hover:bg-sand-300 text-sand-800',
    outline: 'border-2 border-sand-400 text-sand-600 hover:bg-sand-400 hover:text-sand-100',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Spinner di caricamento
 */
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={`${sizes[size]} border-2 border-sand-300 border-t-sand-600 rounded-full animate-spin`}
    />
  );
}

/**
 * Badge per promozioni
 */
export function PromotionBadge({ discount }: { discount: number }) {
  return (
    <span className="promotion-badge inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-terra-300 text-sand-900">
      -{discount}% OFF
    </span>
  );
}
