'use client';

import { type ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useAccount, useBalance, useBlockNumber, useEstimateGas } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { useQueryClient } from '@tanstack/react-query';

import useSendTransaction from '@/hooks/use-send-transaction';

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
import NotConnectedInfoBox from '@/components/not-connected-info-box';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import CopyToClipboard from '@/components/copy-to-clipboard';

const SendTransaction = () => {
  const queryClient = useQueryClient();

  const [inputTo, setInputTo] = useState('');
  const [inputValue, setInputValue] = useState('');

  const { address, chain } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: balance, queryKey } = useBalance({
    address,
  });

  const tokenSymbol = useMemo(
    () => chain?.nativeCurrency.symbol.toUpperCase() ?? 'ETH',
    [chain],
  );

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value && !/^\d+\.?\d*$/.test(value)) {
      return;
    }

    setInputValue(value);
  };

  const { data: gas } = useEstimateGas({
    to: inputTo as `0x${string}`,
    value: parseEther((+(inputValue || '0')).toFixed(18).replace(/\.?0+$/, '')),
    query: {
      enabled: !!inputTo && !!inputValue,
    },
  });

  const {
    sendTransaction,
    status: sendTxStatus,
    data: txHash,
    error: errorSendTx,
  } = useSendTransaction();

  useEffect(() => {
    void queryClient.invalidateQueries({ queryKey });
  }, [blockNumber, queryClient, queryKey]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Send Transaction</CardTitle>
        <CardDescription>Transfer for native token</CardDescription>
      </CardHeader>

      {!address && (
        <CardContent className="flex flex-col justify-center h-96">
          <NotConnectedInfoBox />
        </CardContent>
      )}

      {address && (
        <>
          <CardContent className="flex flex-col gap-2 w-full">
            {balance && (
              <CardContentItem>
                <CardContentItemTitle>Balance</CardContentItemTitle>
                <ScrollArea>
                  <CardContentItemValue>
                    {formatEther(balance.value)} {tokenSymbol}
                  </CardContentItemValue>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContentItem>
            )}

            <CardContentItem className="pt-2">
              <div className="flex flex-col gap-2.5 w-full">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="tx-to">To</Label>
                  <Input
                    id="tx-to"
                    type="text"
                    placeholder="Address"
                    onChange={(e) => setInputTo(e.target.value)}
                    value={inputTo}
                  />
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="tx-ether">Native token(ether)</Label>
                  <Input
                    id="tx-ether"
                    type="text"
                    placeholder={tokenSymbol}
                    onChange={handleValueChange}
                    value={inputValue}
                  />
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    sendTransaction({
                      to: inputTo as `0x${string}`,
                      value: parseEther(
                        (+(inputValue || '0'))
                          .toFixed(18)
                          .replace(/\.?0+$/, ''),
                      ),
                      gas,
                    });
                  }}
                >
                  Send {tokenSymbol}
                </Button>
              </div>
            </CardContentItem>
          </CardContent>

          <CardFooter>
            <div className="flex flex-col gap-3 w-full">
              <CardContentItem>
                <CardContentItemTitle>Send Tx Status</CardContentItemTitle>
                <CardContentItemValue>{sendTxStatus}</CardContentItemValue>
              </CardContentItem>
              {errorSendTx && (
                <ErrorContent>
                  <p>{errorSendTx.name}</p>
                  <p>{errorSendTx.message}</p>
                </ErrorContent>
              )}
              {txHash && (
                <CardContentItem>
                  <CardContentItemTitle className="flex items-center gap-2">
                    TX Hash{' '}
                    <CopyToClipboard
                      type="icon"
                      iconSize={14}
                      copyText={txHash}
                    />
                  </CardContentItemTitle>
                  <ScrollArea className="p-1.5">
                    <CardContentItemValue className="text-sm">
                      {txHash}
                      <ScrollBar orientation="horizontal" />
                    </CardContentItemValue>
                  </ScrollArea>
                </CardContentItem>
              )}
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default SendTransaction;
