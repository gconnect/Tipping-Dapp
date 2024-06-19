// const JWT = "YOUR_PINATA_JWT";
import fs from "fs"
import { createReadStream } from "fs";
import axios from "axios"
const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK({ pinataJWTKey: process.env.NEXT_PUBLIC_PINATA_JWT as string});

export const pinFileToIPFS = async (profilePix: string |File | undefined) => {
  try {
    const formData = new FormData();
    // const src = profilePix;
    
    formData.append('file', profilePix!)
    // const file: any = createReadStream(src);
    // formData.append("file", file);

    const pinataMetadata = JSON.stringify({
      name: "Dtipify",
    });
    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", pinataOptions);
    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: Infinity,
      headers: {
        // 'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT as string}`
      }
    });
    // const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT as string}`,
    //   },
    //   body: formData,
    // });
    // const resData = await res.json();
    // console.log(resData.IpfsHash);
    console.log(res.data)
    return res.data.IpfsHash
  } catch (error) {
    console.log(error);
  }
}


  
// export const uploadImageToPinata = async (profilePix : string) => {
//   const stream = fs.createReadStream(profilePix);
//   const res = await pinata.pinFileToIPFS(stream)
//   console.log(res)
//   return res
// }

// const JWT = process.env.NEXT_PUBLIC_PINATA_JWT as string

// export async function pinFileToIPFS(profilePix: string) {
//   try {
//     const text = profilePix;
//     const blob = new Blob([text], { type: "text/plain" });
//     const file = new File([blob], "hello-world.txt")
//     const data = new FormData();
//     data.append("file", file);

//     const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", { 
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${JWT}`,
//       },
//       body: data,
//     });
//     const resData = await res.json();
//     console.log(resData.IpfsHash);
//     return resData.IpfsHash
//   } catch (error) {
//     console.log(error);
//   }
// };
