import { useEffect, useState } from 'react';
import { CheckIcon, CopyIcon } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

type Props = {
  copyText: string;
  disabled?: boolean;
  type?: 'button' | 'icon';
  iconSize?: string | number;
};

const CopyToClipboard = ({
  copyText,
  disabled,
  type = 'button',
  iconSize,
}: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyChainIdClick = async () => {
    if (copyText) {
      await window.navigator.clipboard.writeText(copyText);
      setIsCopied(true);
    }
  };

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }, [isCopied]);

  return (
    <TooltipProvider skipDelayDuration={0}>
      <Tooltip delayDuration={200}>
        <TooltipTrigger
          asChild={type === 'button'}
          onClick={handleCopyChainIdClick}
          aria-label="copy-to-clipboard"
        >
          {type === 'button' ? (
            <Button variant="outline" size="icon" disabled={disabled}>
              {isCopied ? <CheckIcon /> : <CopyIcon />}
            </Button>
          ) : (
            <div>
              {isCopied ? (
                <CheckIcon size={iconSize} />
              ) : (
                <CopyIcon size={iconSize} />
              )}
            </div>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{isCopied ? 'Copied!' : 'Copy'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CopyToClipboard;
