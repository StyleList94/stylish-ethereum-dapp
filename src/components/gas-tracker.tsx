'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useBlockNumber } from 'wagmi';
import {
  BoxIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FuelIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

type GasTrackerData = {
  lastBlock: string;
  safeGasPrice: string;
  averageGasPrice: string;
  FastGasPrice: string;
  fastGasPrice: string;
};

type ResponseData = {
  status: string;
} & GasTrackerData;

const GasTracker = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['gas-tracker'],
    queryFn: async () => {
      const response = await fetch('/api/gas-tracker');

      return (await response.json()) as ResponseData;
    },
  });

  const { data: blockNumber } = useBlockNumber({
    watch: true,
    chainId: 1,
  });

  useEffect(() => {
    void queryClient.invalidateQueries({ queryKey: ['gas-tracker'] });
  }, [blockNumber, queryClient]);

  if (!data) return null;

  return (
    <div
      className={cn(
        'fixed left-0 bottom-0 z-10 @container',
        'flex justify-end items-center gap-3 w-full h-4 px-2 py-0.5',
        'bg-zinc-200/80 dark:bg-zinc-800/90',
        'font-mono text-xs text-zinc-800 dark:text-zinc-200',
      )}
    >
      {data.lastBlock && (
        <p className="flex items-center gap-1.5">
          <BoxIcon aria-label="block-icon" size={12} /> {data.lastBlock}
        </p>
      )}
      {data.averageGasPrice && (
        <p className="flex items-center gap-1.5">
          <FuelIcon aria-label="average-icon" size={12} />{' '}
          {parseFloat((+data.averageGasPrice).toFixed(3))} gwei
        </p>
      )}
      {data.fastGasPrice && (
        <p className="hidden @lg:flex @lg:items-center @lg:gap-1.5">
          <ChevronUpIcon aria-label="high-icon" size={12} />{' '}
          {parseFloat((+data.fastGasPrice).toFixed(3))} gwei
        </p>
      )}
      {data.safeGasPrice && (
        <p className="hidden @lg:flex @lg:items-center @lg:gap-1.5">
          <ChevronDownIcon aria-label="low-icon" size={12} />{' '}
          {parseFloat((+data.safeGasPrice).toFixed(3))} gwei
        </p>
      )}
    </div>
  );
};

export default GasTracker;
