import Link from 'next/link';
import { FlameIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center gap-12 w-full max-w-[500px] h-screen mx-auto py-16 px-6 text-black dark:text-white">
      <div className="flex flex-col items-center gap-6">
        <FlameIcon size={96} />
        <h2 className="text-2xl">Not Found</h2>
        <h3 className="text-lg">404</h3>
      </div>

      <div className="flex flex-col gap-4">
        <Button variant="link" size="lg" asChild>
          <Link href="/">Back to Main</Link>
        </Button>
      </div>

      <div className="flex flex-col gap-2 select-none">
        <p className="flex items-end gap-0.5 font-display text-xl tracking-wide">
          Stylish
          <span className="text-sm leading-relaxed tracking-wider">.DAPP</span>
        </p>
      </div>
    </div>
  );
}
