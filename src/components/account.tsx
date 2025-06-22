'use client';

import { useState, useTransition } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { LoaderCircleIcon } from 'lucide-react';

import useMounted from '@/hooks/use-mounted';

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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import CopyToClipboard from '@/components/copy-to-clipboard';

const Account = () => {
  const {
    status,
    address,
    connector: activeConnector,
    isConnected,
  } = useAccount();
  const {
    connect,
    connectors,
    isPending: isConnecting,
    error: errorConnect,
  } = useConnect();
  const { disconnect } = useDisconnect();

  const [isPending, startTransition] = useTransition();
  const [selectedConnector, setSelectedConnector] = useState<string | null>(
    null,
  );

  const isMounted = useMounted();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>EVM Wallet info</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <CardContentItem>
          <CardContentItemTitle>Status</CardContentItemTitle>
          <CardContentItemValue>{status}</CardContentItemValue>
        </CardContentItem>

        {address && (
          <CardContentItem>
            <CardContentItemTitle className="flex items-center gap-2">
              Address
              <CopyToClipboard type="icon" iconSize={14} copyText={address} />
            </CardContentItemTitle>
            <ScrollArea className="pb-1.5">
              <CardContentItemValue>{address}</CardContentItemValue>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContentItem>
        )}

        {activeConnector && (
          <CardContentItem>
            <CardContentItemTitle>Connector</CardContentItemTitle>
            <CardContentItemValue>{activeConnector.name}</CardContentItemValue>
          </CardContentItem>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-4">
        {isMounted && (
          <CardContentItem className="flex flex-col gap-2 w-full">
            <div className="flex flex-col gap-1 w-full">
              {!isConnected &&
                connectors.map((connector) => (
                  <Button
                    key={`connector-${connector.id}`}
                    onClick={() => {
                      startTransition(() => {
                        setSelectedConnector(connector.id);
                        connect({ connector });
                      });
                    }}
                    disabled={isPending || isConnecting}
                    variant="outline"
                  >
                    {isConnecting &&
                      !isPending &&
                      connector.id === selectedConnector && (
                        <LoaderCircleIcon className="animate-spin" />
                      )}{' '}
                    {connector.id}
                  </Button>
                ))}
              {isConnected && (
                <Button onClick={() => disconnect()} variant="outline">
                  Disconnect
                </Button>
              )}
            </div>
          </CardContentItem>
        )}
        {errorConnect && (
          <ErrorContent>
            <p>{errorConnect.name}</p>
            <p>{errorConnect.message}</p>
          </ErrorContent>
        )}
      </CardFooter>
    </Card>
  );
};

export default Account;
