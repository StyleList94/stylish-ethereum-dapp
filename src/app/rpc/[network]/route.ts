import { mainnet, sepolia } from 'wagmi/chains';

type SupportNetwork = 'mainnet' | 'sepolia';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ network: SupportNetwork }> },
) {
  const { network } = await params;

  const body = await req.text();

  const hasCustomRpc = !!process.env.ALCHEMY_API_KEY;

  const networkToRpc: Record<SupportNetwork, string> = {
    mainnet: hasCustomRpc
      ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
      : mainnet.rpcUrls.default.http[0],
    sepolia: hasCustomRpc
      ? `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
      : sepolia.rpcUrls.default.http[0],
  };

  const targetUrl = networkToRpc[network];

  if (!targetUrl) {
    return new Response(
      JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        error: {
          code: -32600,
          message: 'Network not found',
        },
      }),
      { status: 500 },
    );
  }

  const res = await fetch(targetUrl, {
    method: 'POST',
    headers: req.headers,
    body,
  });

  const data = await res.arrayBuffer();

  return new Response(data, {
    status: res.status,
    statusText: res.statusText,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const dynamic = 'force-dynamic';
