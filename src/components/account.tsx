import { useAccount, useConnect, useDisconnect } from 'wagmi';

import useMounted from 'hooks/useMounted';

import Card from '@/components/card';
import ErrorContent from '@/components/error-content';

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
          <Card.ItemTitle>Status</Card.ItemTitle>
          <Card.ItemValue>{status}</Card.ItemValue>
        </Card.ContentItem>
        {address && (
          <Card.ContentItem>
            <Card.ItemTitle>Address</Card.ItemTitle>
            <Card.ItemValue>{address}</Card.ItemValue>
          </Card.ContentItem>
        )}
        {activeConnector && (
          <Card.ContentItem>
            <Card.ItemTitle>Connector</Card.ItemTitle>
            <Card.ItemValue>{activeConnector.name}</Card.ItemValue>
          </Card.ContentItem>
        )}
      </Card.ContentList>

      {isMounted && (
        <Card.ContentItem>
          <Card.ItemTitle>Connect</Card.ItemTitle>
          <Card.ActionGroup>
            {!isConnected &&
              connectors.map((connector) => (
                <button
                  type="button"
                  className="btn"
                  key={`connector-${connector.id}`}
                  onClick={() => connect({ connector })}
                  disabled={
                    isConnecting && pendingConnector?.id === connector.id
                  }
                >
                  {connector.id}({connector.name})
                  {isConnecting && pendingConnector?.id === connector.id && (
                    <span className="loading loading-spinner loading-md" />
                  )}
                </button>
              ))}
            {isConnected && (
              <button
                type="button"
                className="btn"
                onClick={() => disconnect()}
              >
                Disconnect
              </button>
            )}
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
