import { useAccount, useBalance, useConnect } from 'wagmi';
import { formatEther } from 'viem';

import { shortenAddress } from '@/lib/utils';

import { Button } from './ui/button';
import Separator from './ui/separator';

const Web3Status = () => {
  const { address } = useAccount();
  const { connect, connectors } = useConnect();

  const { data: balance } = useBalance({
    address,
  });

  return (
    <>
      {address && (
        <div className="flex items-center gap-2 h-8 px-3 border rounded-sm">
          <p className="font-mono text-xs">
            {balance &&
              `${parseFloat((+formatEther(balance.value)).toFixed(4))} ${balance.symbol}`}
          </p>
          <Separator orientation="vertical" />
          <p className="font-mono text-xs">{shortenAddress(address)}</p>
        </div>
      )}{' '}
      {!address && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => connect({ connector: connectors[0] })}
        >
          Connect Wallet
        </Button>
      )}
    </>
  );
};

export default Web3Status;
