import useKlaytn from 'hooks/useKlaytn';

import Card from '@/components/Card';
import Button from '@mui/material/Button';

const KlaytnAccount = () => {
  const { account, balance, isConnected, connect, disconnect } = useKlaytn();

  const handleConnectClick = async () => {
    await connect();
    return true;
  };

  const handleDisconnectClick = () => {
    disconnect();
    return true;
  };

  return (
    <Card.Section>
      <Card.Title>Account</Card.Title>
      <Card.ContentList>
        <Card.ContentItem>
          <h3>Status</h3>
          <p>{isConnected ? 'connected' : 'disconnected'}</p>
        </Card.ContentItem>
        {account && (
          <Card.ContentItem>
            <h3>Address</h3>
            <p>{account}</p>
          </Card.ContentItem>
        )}
        {isConnected && balance && (
          <Card.ContentItem>
            <h3>Balance</h3>
            <p>{parseFloat((+balance).toFixed(2))} KLAY</p>
          </Card.ContentItem>
        )}
        <Card.ContentItem>
          <h3>Connect</h3>
          <Card.ActionGroup>
            {isConnected ? (
              <Button onClick={handleDisconnectClick}>Disconnect</Button>
            ) : (
              <Button onClick={handleConnectClick}>Kaikas</Button>
            )}
          </Card.ActionGroup>
        </Card.ContentItem>
      </Card.ContentList>
    </Card.Section>
  );
};

export default KlaytnAccount;
