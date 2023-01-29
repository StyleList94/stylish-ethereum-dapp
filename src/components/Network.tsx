import React from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import Button from '@mui/material/Button';

import Card from '@/components/Card';
import ErrorContent from '@/components/ErrorContent';

const Network = () => {
  const { chain } = useNetwork();

  const {
    switchNetwork,
    chains,
    status: switchNetworkStatus,
    error: errorSwitch,
  } = useSwitchNetwork();

  return (
    <Card.Section>
      <Card.Title>Network</Card.Title>
      <Card.ContentList>
        <Card.ContentItem>
          <h3>Chain Id</h3>
          <p>{chain?.id}</p>
        </Card.ContentItem>
        <Card.ContentItem>
          <h3>Name</h3>
          <p>{chain?.name}</p>
        </Card.ContentItem>
        <Card.ContentItem>
          <h3>Switch Network Status</h3>
          <p>{switchNetworkStatus}</p>
        </Card.ContentItem>
      </Card.ContentList>
      <Card.ContentItem>
        <h3>Switch To</h3>
        <Card.ActionGroup>
          {chains.map((chainItem) => (
            <Button
              key={`${chainItem.id}-${chainItem.name}`}
              onClick={() => switchNetwork?.(chainItem.id)}
            >
              {chainItem.name}
            </Button>
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
