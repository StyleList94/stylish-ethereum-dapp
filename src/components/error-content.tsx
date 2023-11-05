import type { PropsWithChildren } from 'react';

const ErrorContent = ({ children }: PropsWithChildren) => (
  <div className="overflow-x-auto flex flex-col gap-1 font-['Roboto'] text-sm text-[#fa5252]">
    {children}
  </div>
);

export default ErrorContent;
