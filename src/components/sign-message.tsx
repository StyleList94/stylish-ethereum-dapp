'use client';

import { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { CircleXIcon } from 'lucide-react';
import { recoverMessageAddress } from 'viem';

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
import Label from '@/components/ui/label';
import Textarea from '@/components/ui/textarea';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Input from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import CopyToClipboard from '@/components/copy-to-clipboard';

const SignMessage = () => {
  const { isConnected } = useAccount();
  const {
    signMessage,
    status: signMessageStatus,
    data: signature,
    error: errorSignMessage,
  } = useSignMessage();

  const [textMessage, setTextMessage] = useState('');
  const [inputSignature, setInputSignature] = useState('');

  const [recoveryAddress, setRecoveryAddress] = useState('');
  const [errorRecoverMessage, setErrorRecoverMessage] = useState('');

  const handleRecoverClick = async () => {
    setErrorRecoverMessage('');
    if (!textMessage || !inputSignature) {
      setRecoveryAddress('');
      return;
    }
    try {
      const address = await recoverMessageAddress({
        message: textMessage,
        signature: inputSignature as `0x${string}`,
      });

      setRecoveryAddress(address);
    } catch (error) {
      if (error instanceof Error) {
        setErrorRecoverMessage(error.message);
      }
      setRecoveryAddress('');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Signature</CardTitle>
        <CardDescription>Sign/Recover Message</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 w-full">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="message">Message</Label>
          <Textarea
            placeholder="Type message here."
            id="message"
            className="h-24"
            onChange={(e) => setTextMessage(e.target.value)}
            value={textMessage}
          />
        </div>

        <div className="grid w-full gap-2">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="signature-data">Signature</Label>
            <Input
              id="signature-data"
              onChange={(e) => setInputSignature(e.target.value)}
              value={inputSignature}
            />
          </div>
          {isConnected ? (
            <Button
              disabled={!textMessage}
              onClick={() => signMessage({ message: textMessage })}
              variant="outline"
            >
              Sign Message
            </Button>
          ) : (
            <Alert variant="destructive">
              <CircleXIcon className="h-4 w-4" />
              <AlertTitle>Cannot Signing</AlertTitle>
              <AlertDescription>Wallet not connected</AlertDescription>
            </Alert>
          )}

          <Button
            disabled={!textMessage || !inputSignature}
            onClick={handleRecoverClick}
            variant="outline"
          >
            Recovery
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2">
        <CardContentItem>
          <CardContentItemTitle>Sign message status</CardContentItemTitle>
          <CardContentItemValue>{signMessageStatus}</CardContentItemValue>
        </CardContentItem>
        {signature && (
          <div className="flex flex-col gap-1 w-full">
            <CardContentItemTitle className="flex items-center gap-2">
              Signature{' '}
              <CopyToClipboard type="icon" iconSize={14} copyText={signature} />
            </CardContentItemTitle>
            <ScrollArea className="pb-1.5">
              <CardContentItemValue className="text-sm">
                {signature}
              </CardContentItemValue>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        )}
        {recoveryAddress && (
          <div className="flex flex-col gap-1 w-full">
            <CardContentItemTitle>Signing address</CardContentItemTitle>
            <ScrollArea className="pb-1.5">
              <CardContentItemValue className="text-sm">
                {recoveryAddress}
              </CardContentItemValue>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        )}
        <div className="w-full">
          {errorSignMessage && (
            <ErrorContent>
              <p>{errorSignMessage.name}</p>
              <p>{errorSignMessage.message}</p>
            </ErrorContent>
          )}
          {errorRecoverMessage && (
            <ErrorContent>
              <p>{errorRecoverMessage}</p>
            </ErrorContent>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignMessage;
