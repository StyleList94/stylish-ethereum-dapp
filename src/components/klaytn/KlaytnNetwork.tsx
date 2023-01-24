import { useState } from 'react';
import Button from '@mui/material/Button';

import useKlaytn from 'hooks/useKlaytn';
import { shortenKaikasRpcErrorMessage } from 'lib/utils';
import { KaikasRpcError } from 'lib/errors';

import Card from '@/components/Card';
import ErrorContent from '@/components/ErrorContent';

const KlaytnNetwork = () => {
  const { klaytn } = useKlaytn();

  const [errorSwitch, setErrorSwitch] = useState<KaikasRpcError | null>(null);

  const handleSwitchNetwork =
    (targetNetwork: 'baobob' | 'cypress') => async () => {
      setErrorSwitch(null);
      const chainId = targetNetwork === 'baobob' ? '0x3e9' : '0x2019';
      try {
        await klaytn?.request({
          method: 'wallet_switchKlaytnChain',
          params: [{ chainId }],
        });
      } catch (e) {
        setErrorSwitch(e as KaikasRpcError);
      }
    };

  return (
    <Card.Section>
      <Card.Title>Network</Card.Title>
      <Card.ContentList>
        <Card.ContentItem>
          <h3>Chain Id</h3>
          <p>{klaytn?.networkVersion}</p>
        </Card.ContentItem>
      </Card.ContentList>
      <Card.ContentItem>
        <h3>Switch To</h3>
        <Card.ActionGroup>
          {['cypress' as const, 'baobob' as const].map((chainItem) => (
            <Button
              key={`${chainItem}-switch`}
              onClick={handleSwitchNetwork(chainItem)}
            >
              {chainItem} Network
            </Button>
          ))}
        </Card.ActionGroup>
      </Card.ContentItem>
      <Card.ContentList>
        {errorSwitch && (
          <ErrorContent>
            <p>{errorSwitch.code}</p>
            <p>{shortenKaikasRpcErrorMessage(errorSwitch.message)}</p>
          </ErrorContent>
        )}
      </Card.ContentList>
    </Card.Section>
  );
};

export default KlaytnNetwork;
