import Link from 'next/link';

import { cn } from '@/lib/utils';

import ThemeControlSwitch from '@/components/theme-control-switch';

const Header = () => (
  <>
    <header
      className={cn(
        'fixed top-0 left-0 flex w-full h-14 z-10',
        'border-b border-b-gray-200/80 dark:border-b-gray-700/80',
        'bg-white dark:bg-neutral-900',
        'transition ease-in-out duration-200',
      )}
    >
      <div
        className={cn(
          'flex items-center w-full 2xl:max-w-[96rem] px-6 py-3 mx-auto',
        )}
      >
        <div className="flex justify-between w-full select-none">
          <Link
            href="/"
            className="flex items-end font-display text-xl tracking-wide"
          >
            Stylish
            <span className="text-sm leading-relaxed tracking-wider">
              .DAPP
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeControlSwitch />
          </div>
        </div>
      </div>
    </header>
    <div className="h-14" />
  </>
);

export default Header;
