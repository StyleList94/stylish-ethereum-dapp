import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useAccount,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from 'wagmi';
import { parseEther } from 'ethers/lib/utils';
import { Button, TextField } from '@mui/material';

import {
  findPendingTxHash,
  removeAddressToPendingTxHash,
  setAddressToPendingTxHash,
} from '../store/transaction';

import Card from '@/components/Card';
import ErrorContent from '@/components/ErrorContent';

const SendTransaction = () => {
  const dispatch = useDispatch();

  const [toInput, setToInput] = useState('');
  const [valueInput, setValueInput] = useState('');

  const { address } = useAccount();

  const { config } = usePrepareSendTransaction({
    request: {
      to: toInput,
      value: parseEther(valueInput || '0'),
    },
    enabled: !!toInput && !!valueInput,
  });

  const {
    sendTransaction,
    status: sendTxStatus,
    data: txResult,
    error: errorSendTx,
  } = useSendTransaction({
    ...config,
    onSuccess(data) {
      dispatch(setAddressToPendingTxHash({ txHash: data.hash, address }));
    },
  });

  const { pendingTxHash, latestTxHash, pendingTxHashQueue } = useSelector(
    ({ transaction }) => ({
      pendingTxHash: transaction.pendingTxHash,
      latestTxHash: transaction.latestTxHash,
      pendingTxHashQueue: transaction.pendingTxHashQueue,
    }),
  );

  const pendingTxCount = useMemo(
    () => pendingTxHashQueue.length,
    [pendingTxHashQueue],
  );

  const { status: waitTxStatus } = useWaitForTransaction({
    hash: pendingTxHash,
  });

  const { data: latestTxReceipt } = useWaitForTransaction({
    hash: latestTxHash,
  });

  useEffect(() => {
    if (
      pendingTxHash &&
      address &&
      (waitTxStatus === 'success' || waitTxStatus === 'error')
    ) {
      dispatch(removeAddressToPendingTxHash({ address }));
    }
  }, [dispatch, waitTxStatus, pendingTxHash, address]);

  useEffect(() => {
    if (address) {
      dispatch(findPendingTxHash({ address }));
    }
  }, [dispatch, address]);

  return (
    <Card.Section>
      <Card.Title>Transaction Test</Card.Title>
      <Card.ContentList>
        <Card.ContentItem>
          <h3>Send Tx Status</h3>
          <p>{sendTxStatus}</p>
        </Card.ContentItem>
        <Card.ContentItem>
          <h3>Wait Tx Status</h3>
          <p>{waitTxStatus}</p>
        </Card.ContentItem>
        <Card.ContentItem>
          <h3>Pending Tx Count</h3>
          <p>{pendingTxCount}</p>
        </Card.ContentItem>
        <Card.ContentItem>
          <h3>Send</h3>
          <Card.ActionGroup>
            <TextField
              id="tx-to"
              label="To"
              name="to"
              type="text"
              variant="standard"
              onChange={(e) => setToInput(e.target.value)}
            />
            <TextField
              id="tx-ether"
              label="Ether"
              name="ether"
              type="text"
              variant="standard"
              onChange={(e) => setValueInput(e.target.value)}
            />
            <Button
              onClick={() => {
                sendTransaction?.();
              }}
            >
              Send Ether
            </Button>
          </Card.ActionGroup>
        </Card.ContentItem>

        <Card.ContentList>
          {(txResult || latestTxHash) && (
            <Card.ResultBox>
              <h3>Latest Tx Hash</h3>
              <p>{txResult?.hash || latestTxHash}</p>
            </Card.ResultBox>
          )}
          {latestTxReceipt && (
            <Card.ResultBox>
              <h3>Latest Tx Receipt</h3>
              <p>{JSON.stringify(latestTxReceipt)}</p>
            </Card.ResultBox>
          )}
        </Card.ContentList>
      </Card.ContentList>
      {errorSendTx && (
        <ErrorContent>
          <p>{errorSendTx.name}</p>
          <p>{errorSendTx.message}</p>
        </ErrorContent>
      )}
    </Card.Section>
  );
};

export default SendTransaction;
