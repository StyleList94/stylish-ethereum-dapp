import { useEffect, useState } from 'react';
import { useAccount, useBalance, useBlockNumber, useEstimateGas } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { useQueryClient } from '@tanstack/react-query';

import useSendTransaction from '@/hooks/use-send-transaction';
import usePendingTransaction from '@/hooks/use-pending-transaction';
import { replacer } from '@/lib/utils';

import {
  Card,
  CardContent,
  CardContentItem,
  CardContentItemTitle,
  CardContentItemValue,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ErrorContent from '@/components/error-content';
import { Button } from '@/components/ui/button';
import Label from '@/components/ui/label';
import Input from '@/components/ui/input';
import useRootStore from '@/store/hooks';

const SendTransaction = () => {
  const queryClient = useQueryClient();

  const [toInput, setToInput] = useState('');
  const [valueInput, setValueInput] = useState('');

  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { address, chain } = useAccount();

  const { data: balance, queryKey } = useBalance({
    address,
  });

  const { data: gas } = useEstimateGas({
    to: toInput as `0x${string}`,
    value: parseEther(
      `${(+(valueInput || '0')).toFixed(18).replace(/\.?0+$/, '')}`,
    ),
    query: {
      enabled: !!toInput && !!valueInput,
    },
  });

  const {
    sendTransaction,
    status: sendTxStatus,
    data: txHash,
    error: errorSendTx,
  } = useSendTransaction();

  const { latestTxHash } = useRootStore((store) => store);

  const {
    pendingTxCount,
    latestTxReceipt,
    status: waitTxStatus,
  } = usePendingTransaction();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [blockNumber, queryClient, queryKey]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transaction</CardTitle>
        <CardDescription>Test to send Token</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 w-full">
        {balance && (
          <CardContentItem>
            <CardContentItemTitle>Balance</CardContentItemTitle>
            <CardContentItemValue>
              <span className="text-base">
                {formatEther(balance.value)}{' '}
                {chain && chain.nativeCurrency.symbol.toUpperCase()}
              </span>
            </CardContentItemValue>
          </CardContentItem>
        )}
        <CardContentItem>
          <CardContentItemTitle>Send Tx Status</CardContentItemTitle>
          <CardContentItemValue>{sendTxStatus}</CardContentItemValue>
        </CardContentItem>
        <CardContentItem>
          <CardContentItemTitle>Wait Tx Status</CardContentItemTitle>
          <CardContentItemValue>{waitTxStatus}</CardContentItemValue>
        </CardContentItem>
        <CardContentItem>
          <CardContentItemTitle>Pending Tx Count</CardContentItemTitle>
          <CardContentItemValue>{pendingTxCount}</CardContentItemValue>
        </CardContentItem>
        <CardContentItem className="pt-2">
          <div className="flex flex-col gap-2.5 w-full">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="tx-to">To</Label>
              <Input
                id="tx-to"
                type="text"
                placeholder="Address"
                onChange={(e) => setToInput(e.target.value)}
                value={toInput}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="tx-ether">Ether</Label>
              <Input
                id="tx-ether"
                type="text"
                placeholder="ETH"
                onChange={(e) => setValueInput(e.target.value)}
                value={valueInput}
              />
            </div>

            <Button
              onClick={() => {
                sendTransaction?.({
                  to: toInput as `0x${string}`,
                  value: parseEther(
                    `${(+(valueInput || '0')).toFixed(18).replace(/\.?0+$/, '')}`,
                  ),
                  gas,
                });
              }}
            >
              Send Ether
            </Button>
          </div>
        </CardContentItem>
      </CardContent>

      <CardFooter>
        <div className="flex flex-col gap-3 w-full">
          {errorSendTx && (
            <ErrorContent>
              <p>{errorSendTx.name}</p>
              <p>{errorSendTx.message}</p>
            </ErrorContent>
          )}
          {(txHash || latestTxHash) && (
            <>
              <CardContentItemTitle>Latest Tx Hash</CardContentItemTitle>
              <CardContentItemValue className="text-sm">
                {txHash || latestTxHash}
              </CardContentItemValue>
            </>
          )}
          {latestTxReceipt && (
            <>
              <CardContentItemTitle>Latest Tx Receipt</CardContentItemTitle>
              <CardContentItemValue className="text-sm">
                {JSON.stringify(latestTxReceipt, replacer)}
              </CardContentItemValue>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SendTransaction;
