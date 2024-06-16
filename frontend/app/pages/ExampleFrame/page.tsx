import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';

const { NEXT_PUBLIC_URL} = process.env

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Trending Crypto Pools',
    },
    {
      action: 'link',
      label: 'Visit Coingcko',
      target: 'https://www.coingecko.com',
    },
  ],
  image: {
    src: `https://images.unsplash.com/photo-1643408875993-d7566153dd89?q=80&w=2980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
    aspectRatio: '1:1',
  },
  postUrl: `${NEXT_PUBLIC_URL}/api/trendingPools`,
});

export const metadata: Metadata = {
  metadataBase: new URL(NEXT_PUBLIC_URL as string),
  title: 'Crypto Farcaster Frames - Powered by CoinGecko',
  description: 'LFG',
  openGraph: {
    title: 'Crypto Farcaster Frames - Powered by CoinGecko',
    description: 'LFG',
    images: [`https://images.unsplash.com/photo-1643408875993-d7566153dd89?q=80&w=2980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function ExampleFrame() {
  return (
    <>
      <h1>Welcome to Crypto Farcaster Frames - Powered by CoinGecko</h1>
    </>
  );
}