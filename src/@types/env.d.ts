interface EnvVariables {
  NEXT_PUBLIC_ENV: string;
  PORT: string;
  ORIGIN?: string;
  ALCHEMY_API_KEY?: string;
  ETHERSCAN_API_KEY?: string;
}

declare namespace NodeJS {
  interface ProcessEnv extends EnvVariables {}
}
