'use client';

import { useTransition } from 'react';
import { useAccount, useBlockNumber, useSwitchChain } from 'wagmi';

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
import { Button } from '@/components/ui/button';
import ErrorContent from '@/components/error-content';
import NotConnectedInfoBox from '@/components/not-connected-info-box';
import CopyToClipboard from '@/components/copy-to-clipboard';

const Network = () => {
  const { chain, isConnected } = useAccount();

  const {
    switchChain,
    chains,
    status: switchNetworkStatus,
    error: errorSwitch,
  } = useSwitchChain();

  const [isPending, startTransition] = useTransition();

  const { data: blockNumber } = useBlockNumber({
    watch: true,
    query: { enabled: isConnected },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Network</CardTitle>
        <CardDescription>Chain info from EVM wallet</CardDescription>
      </CardHeader>

      {!isConnected && (
        <CardContent className="flex flex-col justify-center h-72">
          <NotConnectedInfoBox />
        </CardContent>
      )}

      {isConnected && (
        <>
          <CardContent className="flex flex-col gap-2">
            <CardContentItem>
              <CardContentItemTitle className="flex items-center gap-2">
                Chain Id
                {chain?.id && (
                  <CopyToClipboard
                    type="icon"
                    iconSize={14}
                    copyText={`${chain.id}`}
                  />
                )}
              </CardContentItemTitle>
              <div className="flex items-center gap-1">
                <CardContentItemValue>
                  {chain?.id ?? 'Not supported'}
                </CardContentItemValue>
              </div>
            </CardContentItem>
            <CardContentItem>
              <CardContentItemTitle>Name</CardContentItemTitle>
              <CardContentItemValue>
                {chain?.name ?? 'Not supported'}
              </CardContentItemValue>
            </CardContentItem>
            {blockNumber && (
              <CardContentItem>
                <CardContentItemTitle>Block</CardContentItemTitle>
                <CardContentItemValue>
                  {blockNumber.toString()}
                </CardContentItemValue>
              </CardContentItem>
            )}
          </CardContent>

          <CardFooter className="flex-col items-start gap-2">
            <div className="flex flex-col gap-1 w-full">
              <h3 className="font-medium text-sm text-muted-foreground">
                Switch To
              </h3>
              {chains.map((chainItem) => (
                <Button
                  key={`${chainItem.id}-${chainItem.name}`}
                  onClick={() => {
                    startTransition(() => {
                      switchChain({ chainId: chainItem.id });
                    });
                  }}
                  disabled={
                    isPending ||
                    chainItem.id === chain?.id ||
                    switchNetworkStatus === 'pending'
                  }
                  variant="outline"
                >
                  {chainItem.name}
                </Button>
              ))}
              {errorSwitch && (
                <ErrorContent>
                  <p>{errorSwitch.name}</p>
                  <p>{errorSwitch.message}</p>
                </ErrorContent>
              )}
            </div>
            <CardContentItem>
              <CardContentItemTitle>Switch status</CardContentItemTitle>
              <CardContentItemValue>{switchNetworkStatus}</CardContentItemValue>
            </CardContentItem>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default Network;
