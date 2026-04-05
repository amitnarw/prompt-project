import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full bg-[#131313] px-3 py-2 text-sm text-[#e7e5e4] ring-offset-background placeholder:text-[#acabaa] focus-visible:outline-none focus-visible:ring-0 focus-visible:border-b-2 focus-visible:border-[#ffb5a0] disabled:cursor-not-allowed disabled:opacity-50 border-b border-[rgba(72,72,72,0.15)]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
