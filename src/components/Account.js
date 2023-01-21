import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button, CircularProgress } from '@mui/material';

import useMounted from '../hooks/useMounted';

import Card from '@/components/Card';
import ErrorContent from '@/components/ErrorContent';

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
    isLoading: isConnecting,
    error: errorConnect,
    pendingConnector,
  } = useConnect();

  const { disconnect } = useDisconnect();

  const isMounted = useMounted();

  return (
    <Card.Section>
      <Card.Title>Account</Card.Title>
      <Card.ContentList>
        <Card.ContentItem>
          <h3>Status</h3>
          <p>{status}</p>
        </Card.ContentItem>
        {address && (
          <Card.ContentItem>
            <h3>Address</h3>
            <p>{address}</p>
          </Card.ContentItem>
        )}
        {activeConnector && (
          <Card.ContentItem>
            <h3>Connector</h3>
            <p>{activeConnector.name}</p>
          </Card.ContentItem>
        )}
      </Card.ContentList>

      {isMounted && (
        <Card.ContentItem>
          <h3>Connect</h3>
          <Card.ActionGroup>
            {!isConnected &&
              connectors.map((connector) => (
                <Button
                  key={`connector-${connector.id}`}
                  onClick={() => connect({ connector })}
                  disabled={
                    isConnecting && pendingConnector.id === connector.id
                  }
                >
                  {connector.id}({connector.name})
                  {isConnecting && pendingConnector.id === connector.id && (
                    <CircularProgress size={16} />
                  )}
                </Button>
              ))}
            {isConnected && <Button onClick={disconnect}>Disconnect</Button>}
          </Card.ActionGroup>
        </Card.ContentItem>
      )}
      {errorConnect && (
        <ErrorContent>
          <p>{errorConnect.name}</p>
          <p>{errorConnect.message}</p>
        </ErrorContent>
      )}
    </Card.Section>
  );
};

export default Account;
