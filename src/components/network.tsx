import React from 'react';
import { useAccount, useSwitchChain } from 'wagmi';

import Card from '@/components/card';
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
    <Card.Section>
      <Card.Title>Network</Card.Title>
      <Card.ContentList>
        <Card.ContentItem>
          <Card.ItemTitle>Chain Id</Card.ItemTitle>
          <Card.ItemValue>{chain?.id || 'Not supported'}</Card.ItemValue>
        </Card.ContentItem>
        <Card.ContentItem>
          <Card.ItemTitle>Name</Card.ItemTitle>
          <Card.ItemValue>{chain?.name || 'Not supported'}</Card.ItemValue>
        </Card.ContentItem>
        <Card.ContentItem>
          <Card.ItemTitle>Switch Network Status</Card.ItemTitle>
          <Card.ItemValue>{switchNetworkStatus}</Card.ItemValue>
        </Card.ContentItem>
      </Card.ContentList>
      <Card.ContentItem>
        <h3>Switch To</h3>
        <Card.ActionGroup>
          {chains.map((chainItem) => (
            <button
              type="button"
              className="btn"
              key={`${chainItem.id}-${chainItem.name}`}
              onClick={() => switchChain?.({ chainId: chainItem.id })}
            >
              {chainItem.name}
            </button>
          ))}
        </Card.ActionGroup>
      </Card.ContentItem>
      {errorSwitch && (
        <ErrorContent>
          <p>{errorSwitch.name}</p>
          <p>{errorSwitch.message}</p>
        </ErrorContent>
      )}
    </Card.Section>
  );
};

export default Network;
