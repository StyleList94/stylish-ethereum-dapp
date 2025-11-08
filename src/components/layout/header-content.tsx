import Link from 'next/link';

import { cn } from '@/lib/utils';

const HeaderContent = () => (
  <div
    className={cn(
      'flex items-center w-full h-full 2xl:max-w-384 px-6 py-3 mx-auto',
    )}
  >
    <div className="flex justify-between w-full select-none">
      <Link
        href="/"
        className="flex items-end font-display text-xl tracking-wide"
      >
        Stylish
        <span className="text-sm leading-relaxed tracking-wider">.DAPP</span>
      </Link>

      <div className="flex items-center gap-2">{/* 추가할꺼염 */}</div>
    </div>
  </div>
);

export default HeaderContent;
