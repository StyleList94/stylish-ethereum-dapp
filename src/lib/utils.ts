import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const shortenAddress = (account: string) =>
  `${account.substring(0, 10)}...${account.substring(32)}`;

export const replacer = (key: string, value: unknown) =>
  typeof value === 'bigint' ? value.toString() : value;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
