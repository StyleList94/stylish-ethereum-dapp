import React from 'react';
import { useSignMessage } from 'wagmi';
import { Button } from '@mui/material';

import Card from '@/components/Card';
import ErrorContent from '@/components/ErrorContent';

const SignMessage = () => {
  const {
    signMessage,
    status: signMessageStatus,
    data: signMessageData,
    error: errorSignMessage,
  } = useSignMessage();

  return (
    <Card.Section>
      <Card.Title>Sign Message Test</Card.Title>
      <Card.ContentList>
        <Card.ContentItem>
          <h3>Status</h3>
          <p>{signMessageStatus}</p>
        </Card.ContentItem>
        <Card.ActionGroup>
          <Button onClick={() => signMessage({ message: 'hello world!' })}>
            Sign Message
          </Button>
        </Card.ActionGroup>
      </Card.ContentList>
      <Card.ContentList>
        {signMessageData && (
          <Card.ResultBox>
            <h3>Result</h3>
            <p>{signMessageData}</p>
          </Card.ResultBox>
        )}
      </Card.ContentList>
      {errorSignMessage && (
        <ErrorContent>
          <p>{errorSignMessage.name}</p>
          <p>{errorSignMessage.message}</p>
        </ErrorContent>
      )}
    </Card.Section>
  );
};

export default SignMessage;
