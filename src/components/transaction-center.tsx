'use client';

import { useAccount } from 'wagmi';

import usePendingTransaction from '@/hooks/use-pending-transaction';
import { replacer } from '@/lib/utils';
import useRootStore from '@/store/hooks';

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
import NotConnectedInfoBox from '@/components/not-connected-info-box';
import ErrorContent from '@/components/error-content';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const TransactionCenter = () => {
  const { address } = useAccount();

  const { latestTxHash } = useRootStore((state) => state);
  const {
    pendingTxCount,
    pendingTxHash,
    latestTxReceipt,
    status: waitTxStatus,
    error: errorResultTx,
  } = usePendingTransaction();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transaction Center</CardTitle>
        <CardDescription>Live transaction status</CardDescription>
      </CardHeader>

      {!address && (
        <CardContent className="flex flex-col justify-center h-72">
          <NotConnectedInfoBox />
        </CardContent>
      )}

      {address && (
        <CardContent className="flex flex-col gap-2 w-full">
          <CardContentItem>
            <CardContentItemTitle>Wait Tx Status</CardContentItemTitle>
            <CardContentItemValue>{waitTxStatus}</CardContentItemValue>
          </CardContentItem>
          <CardContentItem>
            <CardContentItemTitle>Pending Tx Count</CardContentItemTitle>
            <CardContentItemValue>{pendingTxCount}</CardContentItemValue>
          </CardContentItem>
        </CardContent>
      )}

      {(pendingTxHash ?? latestTxHash) && (
        <CardFooter className="flex-col items-start gap-3">
          {pendingTxHash && (
            <div className="flex flex-col gap-2 w-full">
              <CardContentItemTitle>Pending Tx Hash</CardContentItemTitle>
              <ScrollArea className="pb-1.5">
                <CardContentItemValue className="text-sm">
                  {pendingTxHash}
                </CardContentItemValue>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          )}
          {latestTxHash && (
            <div className="flex flex-col gap-2 w-full">
              <CardContentItemTitle>Latest Tx Hash</CardContentItemTitle>
              <ScrollArea className="pb-1.5">
                <CardContentItemValue className="text-sm">
                  {latestTxHash}
                </CardContentItemValue>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          )}
          {latestTxReceipt && (
            <div className="flex flex-col gap-2 w-full">
              <CardContentItemTitle>Latest Tx Receipt</CardContentItemTitle>
              <ScrollArea className="rounded-md p-3 border">
                <CardContentItemValue className="text-sm">
                  {JSON.stringify(latestTxReceipt, replacer)}
                </CardContentItemValue>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          )}
          {errorResultTx && (
            <ErrorContent>
              <p>{errorResultTx.name}</p>
              <p>{errorResultTx.message}</p>
            </ErrorContent>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default TransactionCenter;
