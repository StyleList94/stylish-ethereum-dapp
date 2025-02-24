'use client';

import { type ChangeEvent, useMemo, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { type AbiFunction, erc20Abi, erc4626Abi, erc721Abi } from 'viem';
import { Info, LoaderCircle } from 'lucide-react';

import useRootStore from '@/store/hooks';
import useEstimateContractGas from '@/hooks/use-estimate-contract-gas';
import useWriteContract from '@/hooks/use-write-contract';
import usePendingTransaction from '@/hooks/use-pending-transaction';
import {
  convertToAbiTypedValue,
  parseAbiFileToJSON,
  replacer,
  separateFunctionInput,
} from '@/lib/utils';

import {
  Card,
  CardContent,
  CardContentItemTitle,
  CardContentItemValue,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import Combobox from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import ErrorContent from '@/components/error-content';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type AbiVariant = 'custom' | 'erc20' | 'erc721' | 'erc4626';

type Option = {
  value: string;
  label: string;
};

const SmartContractLauncher = () => {
  const [selectedAbi, setSelectedAbi] = useState<AbiVariant | null>(null);
  const [abiFunctions, setAbiFunctions] = useState<AbiFunction[]>([]);
  const [abiOptions, setAbiOptions] = useState<Option[]>([]);
  const [selectedFunction, setSelectedFunction] = useState('');
  const [selectedAbiFunction, setSelectedAbiFunction] =
    useState<AbiFunction | null>(null);
  const [paymentEth, setPaymentEth] = useState('');

  const [contractAddress, setContractAddress] = useState('');
  const [functionInputs, setFunctionInputs] = useState<Record<string, string>>(
    {},
  );

  const [errorMessage, setErrorMessage] = useState('');

  const { address } = useAccount();
  const estimateContractGas = useEstimateContractGas();

  const { latestTxHash } = useRootStore((state) => state);
  const { latestTxReceipt } = usePendingTransaction();

  const selectedFunctionInputs = useMemo(() => {
    if (selectedAbiFunction) {
      return selectedAbiFunction.inputs;
    }
    return null;
  }, [selectedAbiFunction]);

  const isExecutable = useMemo(
    () =>
      !!address &&
      !!contractAddress &&
      !!selectedFunction &&
      Object.values(functionInputs).length === selectedFunctionInputs?.length &&
      !Object.values(functionInputs).includes(''),
    [
      address,
      contractAddress,
      selectedFunction,
      functionInputs,
      selectedFunctionInputs,
    ],
  );

  const isReadable = useMemo(
    () =>
      selectedAbiFunction?.stateMutability === 'pure' ||
      selectedAbiFunction?.stateMutability === 'view',
    [selectedAbiFunction],
  );

  const resetState = () => {
    setSelectedFunction('');
    setSelectedAbiFunction(null);
    setFunctionInputs({});
    setErrorMessage('');
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files![0];

    const resAbi = await parseAbiFileToJSON(selectedFile);

    const filteredAbi = resAbi.filter((item) => item.type === 'function');

    setSelectedAbi('custom');
    setAbiFunctions(filteredAbi);
    setAbiOptions(
      filteredAbi.map((item) => ({
        label: `${item.name}[${item.inputs.length}]`,
        value: `${item.name}[${item.inputs.length}]`,
      })),
    );
    resetState();
  };

  const handleAbiVariantClick = (variant: AbiVariant) => () => {
    let chosenAbi;

    switch (variant) {
      case 'erc20':
        chosenAbi = erc20Abi;
        break;
      case 'erc721':
        chosenAbi = erc721Abi;
        break;
      case 'erc4626':
        chosenAbi = erc4626Abi;
        break;
      default:
        break;
    }

    const filteredAbi = (chosenAbi ?? []).filter(
      (item) => item.type === 'function',
    );

    setSelectedAbi(variant);
    setAbiFunctions(filteredAbi);
    setAbiOptions(
      filteredAbi.map((item) => ({
        label: `${item.name}[${item.inputs.length}]`,
        value: `${item.name}[${item.inputs.length}]`,
      })),
    );
    resetState();
  };

  const handleValueChange = (value: string) => {
    try {
      const [functionName, argumentLength] = separateFunctionInput(value);

      const abiFunction =
        abiFunctions.find(
          (func) =>
            func.name === functionName &&
            func.inputs.length === +argumentLength,
        ) || null;

      setSelectedFunction(value);
      setSelectedAbiFunction(abiFunction);
      setFunctionInputs({});
      setErrorMessage('');
    } catch {
      /* DO NOTHING */
    }
  };

  const handleContractAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContractAddress(e.target.value);
  };

  const handleFunctionInputsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFunctionInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    setErrorMessage('');
  };

  const handleEthPaymentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPaymentEth((prevState) => (/^$|^\d+$/.test(value) ? value : prevState));
  };

  const {
    isLoading: isReading,
    data: resultData,
    error: errorReadContract,
  } = useReadContract({
    abi: abiFunctions,
    functionName: selectedAbiFunction?.name ?? '',
    address: contractAddress as `0x${string}`,
    args:
      selectedAbiFunction?.inputs.map((param) =>
        convertToAbiTypedValue(functionInputs[param.name!], param.type),
      ) ?? [],
    query: {
      enabled: isExecutable && isReadable,
    },
  });

  const {
    data: txHash,
    writeContract,
    isPending: isWriting,
    error: errorWriteContract,
  } = useWriteContract();

  const handleExecuteClick = async () => {
    if (!isExecutable || isReadable) {
      setErrorMessage('Cannot execute contract function');
      return;
    }

    const writeContractParams = {
      abi: abiFunctions,
      functionName: selectedAbiFunction?.name || '',
      address: contractAddress as `0x${string}`,
      args:
        selectedAbiFunction?.inputs.map((param) =>
          convertToAbiTypedValue(functionInputs[param.name!], param.type),
        ) ?? [],
    };

    let gas = 0n;

    try {
      gas = await estimateContractGas(writeContractParams);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
      return;
    }

    writeContract({
      ...writeContractParams,
      gas: (gas * 120n) / 100n,
      value: BigInt(paymentEth),
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Launcher</CardTitle>
        <CardDescription>Execute Smart Contract</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 w-full">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <div className="flex flex-col gap-1">
            <Label htmlFor="load-abi">Load ABI</Label>
            <Input
              type="file"
              accept="application/json, .json"
              onChange={handleFileChange}
              id="load-abi"
            />
            <div className="flex gap-1">
              {['erc20', 'erc721', 'erc4626'].map((abiVariant) => (
                <Button
                  key={`abi-variant-${abiVariant}`}
                  className="flex-1"
                  variant={selectedAbi === abiVariant ? 'default' : 'outline'}
                  onClick={handleAbiVariantClick(abiVariant as AbiVariant)}
                >
                  {abiVariant.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {abiFunctions && abiFunctions.length > 0 && (
          <div className="flex flex-col gap-2 w-full">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="contract-address">Contract Address</Label>
              <Input
                type="text"
                id="contract-address"
                onChange={handleContractAddressChange}
                value={contractAddress}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="contract-address">Function</Label>
              <Combobox
                value={selectedFunction}
                onValueChange={handleValueChange}
                options={abiOptions}
              />
            </div>

            <TooltipProvider>
              {selectedFunctionInputs?.map((param) => (
                <div
                  key={`function-inputs-${param.name}`}
                  className="grid w-full max-w-sm items-center gap-1.5"
                >
                  <Label
                    htmlFor={param.name}
                    className="flex items-center gap-1"
                  >
                    {param.name}

                    {/\[]$/.test(param.type) && (
                      <Tooltip delayDuration={200}>
                        <TooltipTrigger>
                          <Info size={14} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter multiple values separated by commas.</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </Label>
                  <Input
                    type="text"
                    name={param.name}
                    id={param.name}
                    onChange={handleFunctionInputsChange}
                    value={functionInputs[param.name!] ?? ''}
                  />
                </div>
              ))}
            </TooltipProvider>
            {selectedAbiFunction?.stateMutability === 'payable' && (
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="eth-payment">ETH Payment</Label>
                <Input
                  type="text"
                  id="eth-payment"
                  onChange={handleEthPaymentChange}
                  value={paymentEth}
                />
              </div>
            )}
            {!!selectedFunction && !isReadable && (
              <Button
                variant="outline"
                disabled={!isExecutable || isWriting}
                onClick={handleExecuteClick}
              >
                {isWriting && <LoaderCircle className="animate-spin" />}
                Execute
              </Button>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isReadable ? (
          <>
            {isReading && (
              <div className="flex justify-center items-center w-full">
                <LoaderCircle className="animate-spin" />
              </div>
            )}
            {!isReading && resultData && (
              <div className="flex flex-col gap-1 w-full">
                <CardContentItemTitle>Output</CardContentItemTitle>
                <CardContentItemValue className="text-sm">
                  {resultData}
                </CardContentItemValue>
              </div>
            )}
            {errorReadContract && (
              <ErrorContent>
                <p>{errorReadContract.name}</p>
                <p>{errorReadContract.message}</p>
              </ErrorContent>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-3 w-full">
            {(txHash || latestTxHash) && (
              <>
                <CardContentItemTitle>Latest Tx Hash</CardContentItemTitle>
                <CardContentItemValue className="text-sm">
                  {txHash || latestTxHash}
                </CardContentItemValue>
              </>
            )}
            {latestTxReceipt && (
              <>
                <CardContentItemTitle>Latest Tx Receipt</CardContentItemTitle>
                <CardContentItemValue className="text-sm">
                  {JSON.stringify(latestTxReceipt, replacer)}
                </CardContentItemValue>
              </>
            )}

            {errorWriteContract && (
              <ErrorContent>
                <p>{errorWriteContract.name}</p>
                <p>{errorWriteContract.message}</p>
              </ErrorContent>
            )}

            {errorMessage && (
              <ErrorContent>
                <p>{errorMessage}</p>
              </ErrorContent>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default SmartContractLauncher;
