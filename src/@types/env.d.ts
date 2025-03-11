interface EnvVariables {
  NEXT_PUBLIC_ENV: string;
  NEXT_PUBLIC_ALCHEMY_API_KEY: string;
}

declare namespace NodeJS {
  interface ProcessEnv extends EnvVariables {}
}
