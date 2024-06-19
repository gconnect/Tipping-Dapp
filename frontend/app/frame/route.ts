import { NextRequest, NextResponse } from "next/server"
import { getConnectedAddressForUser } from "../utils/facastAccount";
import { mintNft, balanceOf } from "../utils/mint";
import { PinataFDK } from "pinata-fdk";

const fdk = new PinataFDK({
  pinata_jwt: process.env.NEXT_PUBLIC_PINATA_JWT as string,
  pinata_gateway: process.env.NEXT_PUBLIC_GATEWAY_URL as string,
});

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const frameMetadata = await fdk.getFrameMetadata({
      post_url: `${process.env.NEXT_PUBLIC_BASE_URL}/frame`,
      buttons: [{ label: "Mint NFT", action: "post" }],
      aspect_ratio: "1.91:1",
      cid: "QmeDuMkGzf22nujgMi5mzUT2QAYSF9FPYqeiVui7Xw6wcd",
    });
    return new NextResponse(frameMetadata);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error });
  }

  // const frameMetadata = fdk.getFrameMetadata({
  //   post_url: `<YOUR_DOMAIN>/api/test`,
  //   input: {text: "Hello, world!"},
  //   aspect_ratio: "1.91:1",
  //   buttons: [
  //     { label: 'Post', action: 'post'},
  //     { label: 'Post Redirect', action: "post_redirect"},
  //     { label: 'Mint', action: "mint" },
  //     { label: 'Link', action: "link", target: "https://google.com"},
  //     // { label: 'Send Tip', action: "tx" },
  //   ],
  //   cid: "QmTQBdzR67RPkz1UQnF7S2fy9fHYeXf8J88BUsojj5YXah", 
  //   state: {counter: 1}
  // });
  // return new NextResponse(frameMetadata);
}

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const fid = body.untrustedData.fid;
  const address = await getConnectedAddressForUser(fid);
  const balance = await balanceOf(address);
  console.log(balance);
  if (typeof balance === "number" && balance !== null && balance < 1) {
    try {
      const mint = await mintNft(address);
      console.log(mint);
      const frameMetadata = await fdk.getFrameMetadata({
        post_url: `${process.env.NEXT_PUBLIC_BASE_URL}/redirect`,
        buttons: [{ label: "Learn How to Make This", action: "post_redirect" }],
        aspect_ratio: "1:1",
        cid: "QmeDuMkGzf22nujgMi5mzUT2QAYSF9FPYqeiVui7Xw6wcd",
      });
      return new NextResponse(frameMetadata);
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: error });
    }
  } else {
    const frameMetadata = await fdk.getFrameMetadata({
      post_url: `${process.env.NEXT_PUBLIC_BASE_URL}/redirect`,
      buttons: [{ label: "Learn How to Make This", action: "post_redirect" }],
      aspect_ratio: "1:1",
      cid: "QmeDuMkGzf22nujgMi5mzUT2QAYSF9FPYqeiVui7Xw6wcd",
    });
    return new NextResponse(frameMetadata);
  }
}