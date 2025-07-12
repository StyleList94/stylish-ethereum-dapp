'use client';

import type { ComponentProps, ReactNode } from 'react';

import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

type Props = {
  children?: [ReactNode, ReactNode];
  trackClassName?: string;
  thumbClassName?: string;
  iconClassName?: string;
} & ComponentProps<typeof SwitchPrimitive.Root>;

function Switch({
  children,
  trackClassName,
  thumbClassName,
  iconClassName,
  className,
  ...props
}: Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'relative peer bg-zinc-100/80 focus-visible:border-gray-300 focus-visible:ring-gray-300/50 inline-flex h-6 w-12 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all ease-in-out duration-200 outline-none focus-visible:ring-[2px] disabled:cursor-not-allowed disabled:opacity-50',
        'dark:bg-zinc-800/80 dark:focus-visible:border-gray-700 dark:focus-visible:ring-gray-700/50',
        trackClassName,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'flex justify-center items-center bg-zinc-50 text-zinc-600 border border-zinc-200/80 pointer-events-none size-6 rounded-full ring-0 transition-transform ease-in-out duration-200 data-[state=checked]:translate-x-[calc(100%)] data-[state=unchecked]:translate-x-0',
          'dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700/80',
          thumbClassName,
        )}
      />
      {children && (
        <span
          className={cn(
            'absolute left-1 text-zinc-700 dark:text-zinc-300 transition-transform translate-x-[calc(100%+0.375rem)]',
            props.checked && 'translate-x-0',
            iconClassName,
          )}
        >
          {props.checked ? children[1] : children[0]}
        </span>
      )}
    </SwitchPrimitive.Root>
  );
}

export default Switch;
