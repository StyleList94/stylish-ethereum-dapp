export const addressRegex = /^0x[a-fA-F0-9]{40}/;

export const shortenAddress = (account: string) =>
  `${account.substring(0, 10)}...${account.substring(32)}`;

export const replacer = (key: string, value: unknown) =>
  typeof value === 'bigint' ? value.toString() : value;
