// pages/api/uploadImage.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const formData = new FormData();
    const src = req.body;

    const file: any = fs.createReadStream(src);
    formData.append("file", file);

    const pinataMetadata = JSON.stringify({
      name: "Dtipify",
    });
    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", pinataOptions);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT as string}`,
      },
      body: formData,
    });
    const resData = await res.json();
    console.log(resData);
    return resData.IpfsHash
  } catch (error) {
    console.log(error);
  }
}
