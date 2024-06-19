// Step 1. import getFrameHtmlResponse from @coinbase/onchainkit
import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
 
async function getResponse(req: NextRequest): Promise<NextResponse> {
  return new NextResponse(
    // Step 3. Use getFrameHtmlResponse to create a Frame response
    getFrameHtmlResponse({
      buttons: [
        {
          label: `We love BOAT`,
        },
      ],
      image: 'https://cdn.pixabay.com/photo/2024/03/24/17/10/background-8653526_1280.jpg',
      postUrl: 'https://build-onchain-apps.vercel.app/api/frame',
    }),
  );
}
 
export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}