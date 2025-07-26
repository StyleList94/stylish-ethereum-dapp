type ResponseData = {
  status: string;
  message: string;
  result:
    | {
        LastBlock: string;
        SafeGasPrice: string;
        ProposeGasPrice: string;
        FastGasPrice: string;
        suggestBaseFee: string;
        gasUsedRatio: string;
      }
    | string;
};

export async function GET() {
  if (!process.env.ETHERSCAN_API_KEY) {
    return new Response(
      JSON.stringify({
        status: 'FAIL',
        message: 'ETHERSCAN_API_KEY is required',
      }),
      { status: 401 },
    );
  }

  const res = await fetch(
    `https://api.etherscan.io/v2/api?chainid=1&module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN_API_KEY}`,
  );

  const json = (await res.json()) as ResponseData;

  if (typeof json.result === 'string') {
    return new Response(
      JSON.stringify({
        status: 'FAIL',
        message: json.result,
      }),
      { status: 400 },
    );
  }

  return Response.json({
    status: 'OK',
    safeGasPrice: json.result.SafeGasPrice,
    averageGasPrice: json.result.ProposeGasPrice,
    fastGasPrice: json.result.FastGasPrice,
    lastBlock: json.result.LastBlock,
  });
}

export const dynamic = 'force-dynamic';
