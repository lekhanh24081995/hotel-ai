import { cn } from '@/app/lib/utils/common';
import { UserIcon } from '@heroicons/react/24/outline';
import Link, { LinkProps } from 'next/link';
import { forwardRef } from 'react';

interface AvatarProps extends Omit<LinkProps, 'href'> {
  href?: string;
  className?: string;
}

const Avatar = forwardRef<HTMLAnchorElement, AvatarProps>(
  ({ href = '', className, ...props }, ref) => {
    return (
      <Link
        className={cn(
          'relative h-8 w-8 flex-shrink-0 rounded-full bg-red-1 p-2 text-white md:h-12 md:w-12 md:p-3',
          className
        )}
        ref={ref}
        href={href}
        {...props}
      >
        <UserIcon />
      </Link>
    );
  }
);

Avatar.displayName = 'Avatar';
export default Avatar;
