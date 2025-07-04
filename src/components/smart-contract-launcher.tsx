'use client';

import { type ChangeEvent, useMemo, useRef, useState } from 'react';
import { useAccount, useChains, useReadContract } from 'wagmi';
import { type AbiFunction, erc20Abi, erc4626Abi, erc721Abi } from 'viem';
import { CircleXIcon, InfoIcon, LoaderCircleIcon } from 'lucide-react';

import useEstimateContractGas from '@/hooks/use-estimate-contract-gas';
import useWriteContract from '@/hooks/use-write-contract';
import {
  cn,
  convertToAbiTypedValue,
  parseAbiFileToJSON,
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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Separator from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import CopyToClipboard from '@/components/copy-to-clipboard';

type AbiVariant = 'custom' | 'erc20' | 'erc721' | 'erc4626';

type Option = {
  value: string;
  label: string;
};

const SmartContractLauncher = () => {
  const inputLoadAbiElement = useRef<HTMLInputElement>(null);

  const [isErrorLoadAbi, setIsErrorLoadAbi] = useState(false);
  const [selectedAbi, setSelectedAbi] = useState<AbiVariant | null>(null);
  const [abiFunctions, setAbiFunctions] = useState<AbiFunction[]>([]);
  const [abiOptions, setAbiOptions] = useState<Option[]>([]);

  const [selectedFunction, setSelectedFunction] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [selectedAbiFunction, setSelectedAbiFunction] =
    useState<AbiFunction | null>(null);

  const [paymentEth, setPaymentEth] = useState('');

  const [contractAddress, setContractAddress] = useState('');
  const [functionInputs, setFunctionInputs] = useState<Record<string, string>>(
    {},
  );

  const [errorMessage, setErrorMessage] = useState('');

  const { address } = useAccount();

  const chains = useChains();

  const estimateContractGas = useEstimateContractGas();

  const selectedFunctionInputs = useMemo(() => {
    if (selectedAbiFunction) {
      return selectedAbiFunction.inputs;
    }
    return null;
  }, [selectedAbiFunction]);

  const isExecutable = useMemo(
    () =>
      !!contractAddress &&
      !!selectedFunction &&
      Object.values(functionInputs).length === selectedFunctionInputs?.length &&
      !Object.values(functionInputs).includes(''),
    [contractAddress, selectedFunction, functionInputs, selectedFunctionInputs],
  );

  const isReadable = useMemo(
    () =>
      selectedAbiFunction?.stateMutability === 'pure' ||
      selectedAbiFunction?.stateMutability === 'view',

    [selectedAbiFunction],
  );

  const isAvailableNetwork = useMemo(
    () => !!address || !!selectedNetwork,
    [address, selectedNetwork],
  );

  const chainOptions: Option[] = useMemo(
    () =>
      chains.map((chain) => ({
        value: chain.name,
        label: chain.name,
      })),
    [chains],
  );

  const resetState = () => {
    setIsErrorLoadAbi(false);
    setSelectedFunction('');
    setSelectedAbiFunction(null);
    setFunctionInputs({});
    setErrorMessage('');
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setSelectedAbi(null);
      setIsErrorLoadAbi(true);
      setAbiFunctions([]);
      resetState();
      return;
    }

    try {
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
    } catch {
      setSelectedAbi(null);
      setIsErrorLoadAbi(true);
      setAbiFunctions([]);
    }
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

    if (inputLoadAbiElement.current) {
      inputLoadAbiElement.current.value = '';
    }
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

  const handleFunctionValueChange = (value: string) => {
    try {
      const [functionName, argumentLength] = separateFunctionInput(value);

      const abiFunction =
        abiFunctions.find(
          (func) =>
            func.name === functionName &&
            func.inputs.length === +argumentLength,
        ) ?? null;

      setSelectedFunction(value);
      setSelectedAbiFunction(abiFunction);
      setFunctionInputs({});
      setErrorMessage('');
    } catch {
      /* DO NOTHING */
    }
  };

  const handleChainValueChange = (value: string) => {
    setSelectedNetwork(value);
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
        convertToAbiTypedValue(functionInputs[param.name ?? ''], param.type),
      ) ?? [],
    chainId: !address
      ? chains.find((chain) => chain.name === selectedNetwork)?.id
      : undefined,
    query: {
      enabled: isExecutable && isReadable && isAvailableNetwork,
    },
  });

  const {
    data: txHash,
    writeContract,
    isPending: isWriting,
    error: errorWriteContract,
  } = useWriteContract();

  const handleExecuteClick = async () => {
    if ((!address && !isExecutable) || isReadable) {
      setErrorMessage('Cannot execute contract function');
      return;
    }

    const writeContractParams = {
      abi: abiFunctions,
      functionName: selectedAbiFunction?.name ?? '',
      address: contractAddress as `0x${string}`,
      args:
        selectedAbiFunction?.inputs.map((param) =>
          convertToAbiTypedValue(functionInputs[param.name ?? ''], param.type),
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
        <div className="flex flex-col gap-2">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="load-abi">Load ABI</Label>
            <Input
              type="file"
              accept="application/json, .json"
              onChange={handleFileChange}
              id="load-abi"
              ref={inputLoadAbiElement}
            />
          </div>
          <div className="flex gap-1">
            {['erc20', 'erc721', 'erc4626'].map((abiVariant) => (
              <Button
                key={`abi-variant-${abiVariant}`}
                className="flex-1"
                size="sm"
                variant={selectedAbi === abiVariant ? 'default' : 'outline'}
                onClick={handleAbiVariantClick(abiVariant as AbiVariant)}
              >
                {abiVariant.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {isErrorLoadAbi && (
          <Alert variant="destructive">
            <CircleXIcon className="h-4 w-4" />
            <AlertTitle>Fail to load ABI</AlertTitle>
            <AlertDescription>JSON File is invalided</AlertDescription>
          </Alert>
        )}

        {abiFunctions.length > 0 && (
          <div className="flex flex-col gap-2 w-full">
            <Separator className="my-2" />
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
              <Label
                htmlFor="contract-address"
                className="flex items-center gap-2"
              >
                Function
                {selectedFunction && (
                  <Badge variant="secondary">
                    {selectedAbiFunction?.stateMutability}
                  </Badge>
                )}
              </Label>
              <Combobox
                value={selectedFunction}
                onValueChange={handleFunctionValueChange}
                options={abiOptions}
                placeholder="Select function..."
                queryPlaceholder="Search function..."
              />
            </div>

            {isReadable && !address && (
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="contract-address">Network</Label>
                <Combobox
                  value={selectedNetwork}
                  onValueChange={handleChainValueChange}
                  options={chainOptions}
                  placeholder="Select network..."
                  queryPlaceholder="Search network..."
                />
              </div>
            )}

            <TooltipProvider>
              {selectedFunctionInputs?.map((param) => (
                <div
                  key={`function-inputs-${param.name}`}
                  className="grid w-full items-center gap-1.5"
                >
                  <Label
                    htmlFor={param.name}
                    className="flex items-center gap-1"
                  >
                    <div className="flex items-center gap-2">
                      {param.name}
                      <Badge variant="secondary">{param.type}</Badge>
                    </div>

                    {param.type.endsWith('[]') && (
                      <Tooltip delayDuration={200}>
                        <TooltipTrigger>
                          <InfoIcon size={14} />
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
                    value={functionInputs[param.name ?? ''] ?? ''}
                  />
                </div>
              ))}
            </TooltipProvider>
            {selectedAbiFunction?.stateMutability === 'payable' && (
              <div className="grid w-full items-center gap-1.5">
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
              <>
                {address && (
                  <Button
                    variant="outline"
                    disabled={!isExecutable || isWriting}
                    onClick={handleExecuteClick}
                  >
                    {isWriting && <LoaderCircleIcon className="animate-spin" />}
                    Execute
                  </Button>
                )}
                {!address && (
                  <Alert variant="destructive">
                    <CircleXIcon className="h-4 w-4" />
                    <AlertTitle>Cannot execute</AlertTitle>
                    <AlertDescription>Wallet not connected</AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>

      {contractAddress && isReadable && isAvailableNetwork && (
        <CardFooter className="flex flex-col">
          <div className="flex flex-col gap-1 w-full">
            <CardContentItemTitle className="flex items-center gap-2">
              Result{' '}
              {(resultData as string | bigint | undefined) && (
                <CopyToClipboard
                  type="icon"
                  iconSize={14}
                  copyText={`${resultData as unknown as string | bigint}`}
                />
              )}
            </CardContentItemTitle>

            {!errorReadContract && (
              <ScrollArea className="rounded-md p-3 border">
                {isReading && (
                  <div
                    className={cn(
                      'w-full h-5 bg-zinc-200 rounded animate-pulse',
                      'dark:bg-zinc-800',
                    )}
                  />
                )}
                {!isReading && (resultData as string | bigint | undefined) && (
                  <CardContentItemValue className="text-sm">
                    {resultData}
                  </CardContentItemValue>
                )}
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}

            {errorReadContract && (
              <ErrorContent>
                <p>{errorReadContract.name}</p>
                <p>{errorReadContract.message}</p>
              </ErrorContent>
            )}
          </div>
        </CardFooter>
      )}

      {(txHash ?? errorWriteContract ?? errorMessage) && (
        <CardFooter className="flex flex-col items-stretch gap-2">
          <div className="flex flex-col gap-2 w-full">
            <CardContentItemTitle className="flex items-center gap-2">
              Latest Tx Hash{' '}
              <CopyToClipboard
                type="icon"
                iconSize={14}
                copyText={`${txHash}`}
              />
            </CardContentItemTitle>
            <ScrollArea className="pb-1.5">
              <CardContentItemValue className="text-sm">
                {txHash}
              </CardContentItemValue>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
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
        </CardFooter>
      )}
    </Card>
  );
};

export default SmartContractLauncher;
