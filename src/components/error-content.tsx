import type { PropsWithChildren } from 'react';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const ErrorContent = ({ children }: PropsWithChildren) => (
  <ScrollArea className="flex flex-col gap-4 h-40 font-mono text-sm text-red-500 rounded-md border p-3">
    {children}
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
);

export default ErrorContent;
