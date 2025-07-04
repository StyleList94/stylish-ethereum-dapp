import type { Abi } from 'viem';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { BigNumber } from 'bignumber.js';

export const shortenAddress = (account: string) =>
  `${account.substring(0, 10)}...${account.substring(32)}`;

export const replacer = (_key: string, value: unknown) =>
  typeof value === 'bigint' ? value.toString() : value;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseAbiFileToJSON(file: File) {
  return new Promise((resolve: (value: Abi) => void, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(
          event.target?.result?.toString() ?? '{ abi:[] }',
        ) as { abi: Abi };

        const { abi } = jsonData;
        resolve(abi);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (event) =>
      reject(event.target?.error ?? new Error('Unable to parse abi'));
    reader.readAsText(file);
  });
}

export const separateFunctionInput = (
  formattedName: string,
): [string, number] => {
  const [, functionName, argumentLength] =
    /^([a-zA-Z]+)\[(\d+)]$/.exec(formattedName) ?? [];

  if (functionName === '' || Number.isNaN(+argumentLength)) {
    throw new Error(
      'invalid arguments, formattedName must be formatted string.',
    );
  }

  return [functionName, +argumentLength];
};

export const convertToAbiTypedValue = (value: string, type: string) => {
  if (/^u?int\d*(\[])*$/.test(type)) {
    if (type.endsWith('[]')) {
      const valueArray = value.replace(/\s+/g, '').split(',');
      if (valueArray.every((item) => /^-?\d+$/.test(item))) {
        return valueArray.map(BigInt);
      }
      return [];
    }

    if (/^-?\d+$/.test(value)) {
      return BigInt(value);
    }
  }
  if (type === 'bool') {
    return value.toLowerCase() === 'true';
  }
  if (type.endsWith('[]')) {
    return value.replace(/\s+/g, '').split(',');
  }

  return value;
};

export const convertUnits = (value: string, decimals: number) =>
  new BigNumber(10)
    .pow(-decimals)
    .multipliedBy(value)
    .toFixed(100)
    .replace(/\.?0+$/, '');
