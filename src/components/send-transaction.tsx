import { useEffect, useState } from 'react';
import {
  useAccount,
  useBalance,
  useBlockNumber,
  useEstimateGas,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { formatEther, parseEther } from 'viem';

import { useAppSelector } from 'store/hooks';
import { replacer } from 'lib/utils';

import Card from '@/components/card';
import ErrorContent from '@/components/error-content';
import { useQueryClient } from '@tanstack/react-query';
import useSendTransaction from 'hooks/use-send-transaction';
import usePendingTransaction from 'hooks/use-pending-transaction';

const SendTransaction = () => {
  const queryClient = useQueryClient();

  const [toInput, setToInput] = useState('');
  const [valueInput, setValueInput] = useState('');

  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { address, chain } = useAccount();

  const { data: balance, queryKey } = useBalance({
    address,
  });

  const { data: gas } = useEstimateGas({
    to: toInput as `0x${string}`,
    value: parseEther(`${+(valueInput || '0')}`),
    query: {
      enabled: !!toInput && !!valueInput,
    },
  });

  const {
    sendTransaction,
    status: sendTxStatus,
    data: txHash,
    error: errorSendTx,
  } = useSendTransaction();

  const { pendingTxHash, latestTxHash } = useAppSelector(({ transaction }) => ({
    pendingTxHash: transaction.pendingTxHash,
    latestTxHash: transaction.latestTxHash,
    pendingTxHashQueue: transaction.pendingTxHashQueue,
  }));

  const { pendingTxCount, latestTxReceipt } = usePendingTransaction();

  const { status: waitTxStatus } = useWaitForTransactionReceipt({
    hash: pendingTxHash ?? undefined,
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [blockNumber, queryClient, queryKey]);

  return (
    <Card.Section>
      <Card.Title>Transaction Test</Card.Title>
      <Card.ContentList>
        <Card.ContentItem>
          <Card.ItemTitle>Balance</Card.ItemTitle>
          <Card.ItemValue>
            <p className="text-base">
              {formatEther(balance?.value || 0n)}{' '}
              {chain?.nativeCurrency.symbol.toUpperCase() || 'ETH'}
            </p>
          </Card.ItemValue>
        </Card.ContentItem>
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
                sendTransaction?.({
                  to: toInput as `0x${string}`,
                  value: parseEther(`${+(valueInput || '0')}`),
                  gas,
                });
              }}
            >
              Send Ether
            </button>
          </Card.ActionGroup>
        </Card.ContentItem>
      </Card.ContentList>
      <Card.ContentList>
        {(txHash || latestTxHash) && (
          <Card.ResultBox>
            <Card.ItemTitle>Latest Tx Hash</Card.ItemTitle>
            <Card.ResultValue>{txHash || latestTxHash}</Card.ResultValue>
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
