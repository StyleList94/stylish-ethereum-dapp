'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col justify-center items-center gap-12 w-full max-w-[500px] h-screen mx-auto py-16 px-6 text-black dark:text-white">
      <h2 className="text-2xl">Something went wrong!</h2>

      {process.env.NEXT_PUBLIC_ENV === 'dev' && (
        <ScrollArea className="w-80 h-56 rounded-md p-3 border">
          <p className="font-mono text-xs">{error.stack}</p>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}

      <div className="flex flex-col gap-4">
        <Button variant="ghost" onClick={() => reset()}>
          Try again
        </Button>
        <Button asChild variant="link">
          <Link href="/" className="underline">
            Back to Main
          </Link>
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
