import type { Metadata } from 'next'
import { Basic } from 'next/font/google'

export const metadata: Metadata = {
  title: 'Basic Frame',
  description: 'A Farcaster Frame Demo',
  openGraph: {
    title: 'Basic Frame',
    description: 'A Farcaster Frame Demo',
    images: [`https://cdn.pixabay.com/photo/2024/03/24/17/10/background-8653526_1280.jpg`],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `https://cdn.pixabay.com/photo/2024/03/24/17/10/background-8653526_1280.jpg`,
    'fc:frame:post_url': `${process.env.NEXT_PUBLIC_SITE_URL}/api/frames`,
    'fc:frame:button:1': 'Start',
  },
}
