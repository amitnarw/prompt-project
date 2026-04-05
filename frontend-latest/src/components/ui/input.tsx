import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full bg-[#131313] px-3 py-2 text-sm text-[#e7e5e4] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#acabaa] focus-visible:outline-none focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-[#ffb5a0] disabled:cursor-not-allowed disabled:opacity-50 border-b border-[rgba(72,72,72,0.15)]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
