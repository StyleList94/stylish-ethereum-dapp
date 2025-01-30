'use client';

import { useSignMessage } from 'wagmi';

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
import ErrorContent from '@/components/error-content';
import { Button } from '@/components/ui/button';

const SignMessage = () => {
  const {
    signMessage,
    status: signMessageStatus,
    data: signMessageData,
    error: errorSignMessage,
  } = useSignMessage();

  return (
    <Card className="w-full max-w-[350px]">
      <CardHeader>
        <CardTitle>Signature</CardTitle>
        <CardDescription>Sign Message Test</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 w-full">
        <CardContentItem>
          <CardContentItemTitle>Status</CardContentItemTitle>
          <CardContentItemValue>{signMessageStatus}</CardContentItemValue>
        </CardContentItem>
        <Button
          onClick={() => signMessage({ message: 'hello world!' })}
          variant="outline"
        >
          Sign Message
        </Button>
      </CardContent>

      <CardFooter>
        {signMessageData && (
          <div className="flex flex-col gap-1 w-full">
            <CardContentItemTitle>Result</CardContentItemTitle>
            <CardContentItemValue className="text-sm">
              {signMessageData}
            </CardContentItemValue>
          </div>
        )}
        {errorSignMessage && (
          <ErrorContent>
            <p>{errorSignMessage.name}</p>
            <p>{errorSignMessage.message}</p>
          </ErrorContent>
        )}
      </CardFooter>
    </Card>
  );
};

export default SignMessage;
