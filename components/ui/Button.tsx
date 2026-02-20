'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', isLoading, className = '', disabled, ...props }, ref) => {
    const baseStyles = 'font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center';

    const variants = {
      primary: 'bg-amber-500 text-black hover:bg-amber-400 active:scale-95',
      secondary: 'bg-neutral-800 text-white hover:bg-neutral-700 active:scale-95',
      outline: 'border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white active:scale-95',
      ghost: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 active:scale-95',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base',
      lg: 'px-6 sm:px-8 py-3 sm:py-3.5 text-base sm:text-lg',
    };

    return (
      // @ts-ignore - framer-motion type issue with React 19
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
