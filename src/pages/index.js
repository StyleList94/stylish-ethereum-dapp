import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import styled from '@emotion/styled';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  usePrepareSendTransaction,
  useSendTransaction,
  useSignMessage,
  useSwitchNetwork,
  useWaitForTransaction,
} from 'wagmi';
import { Button, CircularProgress, TextField } from '@mui/material';
import { parseEther } from 'ethers/lib/utils';

import useMounted from '../hooks/useMounted';
import { useDispatch, useSelector } from 'react-redux';
import {
  findPendingTxHash,
  removeAddressToPendingTxHash,
  setAddressToPendingTxHash,
} from 'store/transaction';

const PageContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 3rem;
`;

const PageTitle = styled.h1`
  font-family: 'DM Sans', sans-serif;
  font-weight: normal;
  font-size: 1.5rem;
`;

const CardSection = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 375px;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 5px 1px 10px 0 rgba(206, 212, 218, 0.2);
`;

const CardTitle = styled.h2`
  margin-bottom: 1rem;
  font-family: 'Poppins', sans-serif;
  font-weight: normal;
  font-size: 1.25rem;
  text-align: center;
`;

const CardContentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1rem 0;
`;

const CardContentItem = styled.section`
  h3 {
    font-family: 'Inter', sans-serif;
    font-weight: normal;
    font-size: 1rem;
    color: #adb5bd;
  }

  p {
    overflow-x: auto;
    margin-top: 0.25rem;
    font-family: 'Roboto', sans-serif;
    font-size: 1.25rem;

    &::-webkit-scrollbar {
      background-color: #fff;
      height: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(206, 212, 218, 0.5);
      border-radius: 24px;
    }
  }
`;

const CardActionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #f1f3f5;
  border-radius: 12px;
`;

const CardResultBox = styled.div`
  h3 {
    font-family: 'Inter', sans-serif;
    font-weight: normal;
    font-size: 1rem;
    color: #adb5bd;
  }

  p {
    overflow-x: auto;
    margin-top: 0.25rem;
    font-family: 'Roboto', sans-serif;
    font-size: 0.8755rem;

    &::-webkit-scrollbar {
      background-color: #fff;
      height: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(206, 212, 218, 0.5);
      border-radius: 24px;
    }
  }
`;

const ErrorContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  p {
    font-family: 'Roboto', sans-serif;
    font-size: 0.875rem;
    color: #fa5252;
  }
`;

export default function IndexPage() {
  const dispatch = useDispatch();

  const {
    connect,
    connectors,
    isLoading: isConnecting,
    error: errorConnect,
    pendingConnector,
  } = useConnect();
  const { disconnect } = useDisconnect();
  const {
    status,
    address,
    connector: activeConnector,
    isConnected,
  } = useAccount();
  const { chain } = useNetwork();
  const {
    switchNetwork,
    chains,
    status: switchNetworkStatus,
    error: errorSwitch,
  } = useSwitchNetwork();
  const {
    signMessage,
    status: signMessageStatus,
    data: signMessageData,
    error: errorSignMessage,
  } = useSignMessage();

  const [toInput, setToInput] = useState('');
  const [valueInput, setValueInput] = useState('');

  const isMounted = useMounted();
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
    <PageContainer>
      <PageTitle>Stylish Ethereum DApp</PageTitle>
      <CardSection>
        <CardTitle>Account</CardTitle>
        <CardContentList>
          <CardContentItem>
            <h3>Status</h3>
            <p>{status}</p>
          </CardContentItem>
          {address && (
            <CardContentItem>
              <h3>Address</h3>
              <p>{address}</p>
            </CardContentItem>
          )}
          {activeConnector && (
            <CardContentItem>
              <h3>Connector</h3>
              <p>{activeConnector.name}</p>
            </CardContentItem>
          )}
        </CardContentList>

        {isMounted && (
          <CardContentItem>
            <h3>Connect</h3>
            <CardActionGroup>
              {!isConnected &&
                connectors.map((connector) => (
                  <Button
                    key={`connector-${connector.id}`}
                    onClick={() => connect({ connector })}
                    disabled={
                      isConnecting && pendingConnector.id === connector.id
                    }
                  >
                    {connector.id}({connector.name})
                    {isConnecting && pendingConnector.id === connector.id && (
                      <CircularProgress size={16} />
                    )}
                  </Button>
                ))}
              {isConnected && <Button onClick={disconnect}>Disconnect</Button>}
            </CardActionGroup>
          </CardContentItem>
        )}
        {errorConnect && (
          <ErrorContent>
            <p>{errorConnect.name}</p>
            <p>{errorConnect.message}</p>
          </ErrorContent>
        )}
      </CardSection>
      {isMounted && isConnected && (
        <CardSection>
          <CardTitle>Network</CardTitle>
          <CardContentList>
            <CardContentItem>
              <h3>Chain Id</h3>
              <p>{chain?.id}</p>
            </CardContentItem>
            <CardContentItem>
              <h3>Name</h3>
              <p>{chain?.name}</p>
            </CardContentItem>
            <CardContentItem>
              <h3>Switch Network Status</h3>
              <p>{switchNetworkStatus}</p>
            </CardContentItem>
          </CardContentList>
          <CardContentItem>
            <h3>Switch To</h3>
            <CardActionGroup>
              {chains.map((chain) => (
                <Button
                  key={`${chain.id}-${chain.name}`}
                  onClick={() => switchNetwork?.(chain.id)}
                >
                  {chain.name}
                </Button>
              ))}
            </CardActionGroup>
          </CardContentItem>
          {errorSwitch && (
            <ErrorContent>
              <p>{errorSwitch.name}</p>
              <p>{errorSwitch.message}</p>
            </ErrorContent>
          )}
        </CardSection>
      )}
      {isMounted && isConnected && (
        <CardSection>
          <CardTitle>Sign Message Test</CardTitle>
          <CardContentList>
            <CardContentItem>
              <h3>Status</h3>
              <p>{signMessageStatus}</p>
            </CardContentItem>
            <CardActionGroup>
              <Button onClick={() => signMessage({ message: 'hello world!' })}>
                Sign Message
              </Button>
            </CardActionGroup>
          </CardContentList>
          <CardContentList>
            {signMessageData && (
              <CardResultBox>
                <h3>Result</h3>
                <p>{signMessageData}</p>
              </CardResultBox>
            )}
          </CardContentList>
          {errorSignMessage && (
            <ErrorContent>
              <p>{errorSignMessage.name}</p>
              <p>{errorSignMessage.message}</p>
            </ErrorContent>
          )}
        </CardSection>
      )}
      {isMounted && isConnected && (
        <CardSection>
          <CardTitle>Transaction Test</CardTitle>
          <CardContentList>
            <CardContentItem>
              <h3>Send Tx Status</h3>
              <p>{sendTxStatus}</p>
            </CardContentItem>
            <CardContentItem>
              <h3>Wait Tx Status</h3>
              <p>{waitTxStatus}</p>
            </CardContentItem>
            <CardContentItem>
              <h3>Pending Tx Count</h3>
              <p>{pendingTxCount}</p>
            </CardContentItem>
            <CardContentItem>
              <h3>Send</h3>
              <CardActionGroup>
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
              </CardActionGroup>
            </CardContentItem>

            <CardContentList>
              {(txResult || latestTxHash) && (
                <CardResultBox>
                  <h3>Latest Tx Hash</h3>
                  <p>{txResult?.hash || latestTxHash}</p>
                </CardResultBox>
              )}
              {latestTxReceipt && (
                <CardResultBox>
                  <h3>Latest Tx Receipt</h3>
                  <p>{JSON.stringify(latestTxReceipt)}</p>
                </CardResultBox>
              )}
            </CardContentList>
          </CardContentList>
          {errorSendTx && (
            <ErrorContent>
              <p>{errorSendTx.name}</p>
              <p>{errorSendTx.message}</p>
            </ErrorContent>
          )}
        </CardSection>
      )}
    </PageContainer>
  );
}

IndexPage.getLayout = (page) => (
  <>
    <Head>
      <title>Stylish Ethereum DApp</title>
    </Head>
    {page}
  </>
);
