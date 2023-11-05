import React from 'react';
import { useSignMessage } from 'wagmi';

import Card from '@/components/card';
import ErrorContent from '@/components/error-content';

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
          <Card.ItemTitle>Status</Card.ItemTitle>
          <Card.ItemValue>{signMessageStatus}</Card.ItemValue>
        </Card.ContentItem>
        <Card.ActionGroup>
          <button
            type="button"
            className="btn"
            onClick={() => signMessage({ message: 'hello world!' })}
          >
            Sign Message
          </button>
        </Card.ActionGroup>
      </Card.ContentList>
      <Card.ContentList>
        {signMessageData && (
          <Card.ResultBox>
            <Card.ItemTitle>Result</Card.ItemTitle>
            <Card.ResultValue>{signMessageData}</Card.ResultValue>
          </Card.ResultBox>
        )}
        {errorSignMessage && (
          <ErrorContent>
            <p>{errorSignMessage.name}</p>
            <p>{errorSignMessage.message}</p>
          </ErrorContent>
        )}
      </Card.ContentList>
    </Card.Section>
  );
};

export default SignMessage;
