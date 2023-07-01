import { useMemo, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import type { TransactionReceipt } from 'caver-js';

import useKlaytn from 'hooks/useKlaytn';
import { shortenKaikasRpcErrorMessage } from 'lib/utils';
import { KaikasRpcError } from 'lib/errors';

import Card from '@/components/Card';
import ErrorContent from '@/components/ErrorContent';

const KlaytnSendTransaction = () => {
  const { account, caver } = useKlaytn();

  const [isLoadingSendTx, setIsLoadingSendTx] = useState(false);
  const [errorSendTx, setErrorSendTx] = useState<KaikasRpcError | null>(null);
  const [txReceipt, setTxReceipt] = useState<TransactionReceipt | null>(null);

  const [toInput, setToInput] = useState('');
  const [valueInput, setValueInput] = useState('');

  const sendTxStatus = useMemo((): 'error' | 'idle' | 'loading' | 'success' => {
    if (!isLoadingSendTx && !errorSendTx && !txReceipt) {
      return 'idle';
    }
    if (isLoadingSendTx) {
      return 'loading';
    }
    if (!isLoadingSendTx && !!txReceipt) {
      return 'success';
    }
    if (!isLoadingSendTx && !!errorSendTx) {
      return 'error';
    }
    return 'idle';
  }, [isLoadingSendTx, errorSendTx, txReceipt]);

  const resetTxResult = () => {
    setTxReceipt(null);
    setErrorSendTx(null);
  };

  const handleSendTx = async () => {
    resetTxResult();
    setIsLoadingSendTx(true);

    if (!account || !caver) {
      setIsLoadingSendTx(false);
      return;
    }

    try {
      const tx = await caver.klay.sendTransaction({
        type: 'VALUE_TRANSFER',
        from: account,
        to: toInput,
        value: caver.utils.toPeb(valueInput, 'KLAY') as number | string,
        gas: 25000,
      });

      setTxReceipt(tx);
    } catch (e) {
      setErrorSendTx(e as KaikasRpcError);
    } finally {
      setIsLoadingSendTx(false);
    }
  };

  return (
    <Card.Section>
      <Card.Title>Transaction Test</Card.Title>
      <Card.ContentList>
        <Card.ContentItem>
          <h3>Send Tx Status</h3>
          <p>{sendTxStatus}</p>
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
              label="KLAY"
              name="klay"
              type="text"
              variant="standard"
              onChange={(e) => setValueInput(e.target.value)}
            />
            <Button onClick={handleSendTx}>Send KLAY</Button>
          </Card.ActionGroup>
        </Card.ContentItem>
      </Card.ContentList>
      <Card.ContentList>
        {txReceipt && (
          <Card.ResultBox>
            <h3>Tx Receipt</h3>
            <p>{JSON.stringify(txReceipt)}</p>
          </Card.ResultBox>
        )}
        {errorSendTx && (
          <ErrorContent>
            <p>{errorSendTx.code}</p>
            <p>{shortenKaikasRpcErrorMessage(errorSendTx.message)}</p>
          </ErrorContent>
        )}
      </Card.ContentList>
    </Card.Section>
  );
};

export default KlaytnSendTransaction;
