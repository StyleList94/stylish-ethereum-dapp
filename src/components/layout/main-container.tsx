import { type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
};

const MainContainer = ({ children }: Props) => (
  <>
    <div
      className={cn(
        'fixed inset-0 z-[-1]',
        'transition ease-in-out duration-200',
        'bg-white dark:bg-neutral-900',
      )}
    />
    <main
      className={cn(
        'flex flex-col max-w-[96rem] min-h-[calc(100vh-3.5rem-10rem)] mx-auto my-0 px-6',
        'text-black dark:text-white',
        'sm:min-h-[calc(100vh-3.5rem-8rem)]',
      )}
    >
      {children}
    </main>
  </>
);

export default MainContainer;
