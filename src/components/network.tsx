'use client';

import { useAccount, useSwitchChain } from 'wagmi';

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

const Network = () => {
  const { chain } = useAccount();

  const {
    switchChain,
    chains,
    status: switchNetworkStatus,
    error: errorSwitch,
  } = useSwitchChain();

  return (
    <Card className="w-full max-w-[350px]">
      <CardHeader>
        <CardTitle>Network</CardTitle>
        <CardDescription>Chain info</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <CardContentItem>
          <CardContentItemTitle>Chain Id</CardContentItemTitle>
          <CardContentItemValue>
            {chain?.id || 'Not supported'}
          </CardContentItemValue>
        </CardContentItem>
        <CardContentItem>
          <CardContentItemTitle>Name</CardContentItemTitle>
          <CardContentItemValue>
            {chain?.name || 'Not supported'}
          </CardContentItemValue>
        </CardContentItem>
        <CardContentItem>
          <CardContentItemTitle>Switch Network Status</CardContentItemTitle>
          <CardContentItemValue>{switchNetworkStatus}</CardContentItemValue>
        </CardContentItem>
      </CardContent>

      <CardFooter>
        <div className="flex flex-col gap-1 w-full">
          <h3 className="font-medium text-sm text-muted-foreground">
            Switch To
          </h3>
          {chains.map((chainItem) => (
            <Button
              key={`${chainItem.id}-${chainItem.name}`}
              onClick={() => switchChain?.({ chainId: chainItem.id })}
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
      </CardFooter>
    </Card>
  );
};

export default Network;
