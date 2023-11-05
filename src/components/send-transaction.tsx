import { useEffect, useMemo, useState } from 'react';
import {
  useAccount,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from 'wagmi';
import { parseEther } from 'viem';

import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  findPendingTxHash,
  removeAddressToPendingTxHash,
  setAddressToPendingTxHash,
} from 'store/transaction';
import { replacer } from 'lib/utils';

import Card from '@/components/card';
import ErrorContent from '@/components/error-content';

const SendTransaction = () => {
  const dispatch = useAppDispatch();

  const [toInput, setToInput] = useState('');
  const [valueInput, setValueInput] = useState('');

  const { address } = useAccount();

  const { config } = usePrepareSendTransaction({
    to: toInput,
    value: parseEther(`${+(valueInput || '0')}`),

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
      if (address) {
        dispatch(setAddressToPendingTxHash({ txHash: data.hash, address }));
      }
    },
  });

  const { pendingTxHash, latestTxHash, pendingTxHashQueue } = useAppSelector(
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
    hash: pendingTxHash ?? undefined,
  });

  const { data: latestTxReceipt } = useWaitForTransaction({
    hash: latestTxHash ?? undefined,
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
          <Card.ItemTitle>Send Tx Status</Card.ItemTitle>
          <Card.ItemValue>{sendTxStatus}</Card.ItemValue>
        </Card.ContentItem>
        <Card.ContentItem>
          <Card.ItemTitle>Wait Tx Status</Card.ItemTitle>
          <Card.ItemValue>{waitTxStatus}</Card.ItemValue>
        </Card.ContentItem>
        <Card.ContentItem>
          <Card.ItemTitle>Pending Tx Count</Card.ItemTitle>
          <Card.ItemValue>{pendingTxCount}</Card.ItemValue>
        </Card.ContentItem>
        <Card.ContentItem>
          <Card.ItemTitle>Send</Card.ItemTitle>
          <Card.ActionGroup>
            <div className="form-control w-full max-w-xs">
              <label htmlFor="tx-to" className="label">
                <span className="label-text">To</span>
              </label>
              <input
                id="tx-to"
                type="text"
                placeholder="Address"
                className="input input-ghost input-sm w-full max-w-xs"
                onChange={(e) => setToInput(e.target.value)}
                value={toInput}
              />
            </div>

            <div className="form-control w-full max-w-xs">
              <label htmlFor="tx-ether" className="label">
                <span className="label-text">Ether</span>
              </label>
              <input
                id="tx-ether"
                type="text"
                placeholder="ETH"
                className="input input-ghost input-sm w-full max-w-xs"
                onChange={(e) => setValueInput(e.target.value)}
                value={valueInput}
              />
            </div>

            <button
              type="button"
              className="btn"
              onClick={() => {
                sendTransaction?.();
              }}
            >
              Send Ether
            </button>
          </Card.ActionGroup>
        </Card.ContentItem>
      </Card.ContentList>
      <Card.ContentList>
        {(txResult || latestTxHash) && (
          <Card.ResultBox>
            <Card.ItemTitle>Latest Tx Hash</Card.ItemTitle>
            <Card.ResultValue>
              {txResult?.hash || latestTxHash}
            </Card.ResultValue>
          </Card.ResultBox>
        )}
        {latestTxReceipt && (
          <Card.ResultBox>
            <Card.ItemTitle>Latest Tx Receipt</Card.ItemTitle>
            <Card.ResultValue>
              {JSON.stringify(latestTxReceipt, replacer)}
            </Card.ResultValue>
          </Card.ResultBox>
        )}
        {errorSendTx && (
          <ErrorContent>
            <p>{errorSendTx.name}</p>
            <p>{errorSendTx.message}</p>
          </ErrorContent>
        )}
      </Card.ContentList>
    </Card.Section>
  );
};

export default SendTransaction;
