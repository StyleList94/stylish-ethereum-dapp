import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';

import useKlaytn from 'hooks/useKlaytn';
import { shortenKaikasRpcErrorMessage } from 'lib/utils';
import { KaikasRpcError } from 'lib/errors';

import Card from '@/components/Card';
import ErrorContent from '@/components/ErrorContent';

const KlaytnSignMessage = () => {
  const { account, caver } = useKlaytn();

  const [isLoadingSignMessage, setIsLoadingSignMessage] = useState(false);
  const [errorSignMessage, setErrorSignMessage] =
    useState<KaikasRpcError | null>(null);
  const [signMessageData, setSignMessageData] = useState<string | null>(null);

  const signMessageStatus = useMemo(():
    | 'error'
    | 'idle'
    | 'loading'
    | 'success' => {
    if (!isLoadingSignMessage && !errorSignMessage && !signMessageData) {
      return 'idle';
    }
    if (isLoadingSignMessage) {
      return 'loading';
    }
    if (!isLoadingSignMessage && !!signMessageData) {
      return 'success';
    }
    if (!isLoadingSignMessage && !!errorSignMessage) {
      return 'error';
    }
    return 'idle';
  }, [isLoadingSignMessage, errorSignMessage, signMessageData]);

  const resetSignMessageResult = () => {
    setSignMessageData(null);
    setErrorSignMessage(null);
  };

  const handleSignClick = async () => {
    resetSignMessageResult();
    setIsLoadingSignMessage(true);

    if (!account || !caver) {
      setIsLoadingSignMessage(false);
      return;
    }

    try {
      const data = await caver.rpc.klay.sign(account, 'Hello world!');

      setSignMessageData(data);
    } catch (e) {
      setErrorSignMessage(e as KaikasRpcError);
    } finally {
      setIsLoadingSignMessage(false);
    }
  };

  return (
    <Card.Section>
      <Card.Title>Sign Message Test</Card.Title>
      <Card.ContentList>
        <Card.ContentItem>
          <h3>Status</h3>
          <p>{signMessageStatus}</p>
        </Card.ContentItem>
        <Card.ActionGroup>
          <Button onClick={handleSignClick}>Sign Message</Button>
        </Card.ActionGroup>
      </Card.ContentList>
      <Card.ContentList>
        {signMessageData && (
          <Card.ResultBox>
            <h3>Result</h3>
            <p>{signMessageData}</p>
          </Card.ResultBox>
        )}
        {errorSignMessage && (
          <ErrorContent>
            <p>{errorSignMessage.code}</p>
            <p>{shortenKaikasRpcErrorMessage(errorSignMessage.message)}</p>
          </ErrorContent>
        )}
      </Card.ContentList>
    </Card.Section>
  );
};

export default KlaytnSignMessage;
