'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/app/lib/utils/common';

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn(labelVariants(), className)} {...props} />
  )
);
Label.displayName = 'Label';

export { Label };
