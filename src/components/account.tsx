'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';

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
            <CardContentItemTitle>Address</CardContentItemTitle>
            <CardContentItemValue>{address}</CardContentItemValue>
          </CardContentItem>
        )}

        {activeConnector && (
          <CardContentItem>
            <CardContentItemTitle>Connector</CardContentItemTitle>
            <CardContentItemValue>{activeConnector.name}</CardContentItemValue>
          </CardContentItem>
        )}
      </CardContent>

      <CardFooter>
        {isMounted && (
          <CardContentItem className="flex flex-col gap-2 w-full">
            <div className="flex flex-col gap-1 w-full">
              {!isConnected &&
                connectors.map((connector) => (
                  <Button
                    key={`connector-${connector.id}`}
                    onClick={() => connect({ connector })}
                    disabled={isConnecting}
                    variant="outline"
                  >
                    {isConnecting && (
                      <span className="loading loading-spinner loading-md" />
                    )}{' '}
                    {connector.id}
                  </Button>
                ))}
              {isConnected && (
                <Button onClick={() => disconnect()} variant="outline">
                  Disconnect
                </Button>
              )}
              {errorConnect && (
                <ErrorContent>
                  <p>{errorConnect.name}</p>
                  <p>{errorConnect.message}</p>
                </ErrorContent>
              )}
            </div>
          </CardContentItem>
        )}
      </CardFooter>
    </Card>
  );
};

export default Account;
