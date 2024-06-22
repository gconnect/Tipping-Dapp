import { ethers, toUtf8String } from "ethers";

export const getCreatorVouchers = (address: string, vouchers: any) => {

  return vouchers.map((node: any) => {

      const n = node.node;
      console.log('n ', node)
      let inputPayload = n?.input.payload;
      if (inputPayload) {
          try {
              inputPayload = toUtf8String(inputPayload);
          } catch (e) {
              inputPayload = inputPayload + " (hex)";
          }
      } else {
          inputPayload = "(empty)";
      }
      let payload = n?.payload;
      const decoder = new ethers.AbiCoder();
      const selector = decoder.decode(["bytes4"], payload)[0]
      payload = ethers.dataSlice(payload,4)

      if (selector === '0xa9059cbb') {
        const decoded = decoder.decode(["address","uint256"], payload)
        const decodedAddress = decoded[0]

        if (decodedAddress.toLowerCase() === address.toLowerCase()) {
          return {
          index: parseInt(n?.index),
          payload: `${payload}`,
          input: n ? {index: n.input.index, payload: JSON.parse(inputPayload)} : {},
          proof: null,
          executed: null,
      };
        }
        return null
      }
    
  })
  .filter((node: any) => node !== null)
  .sort((b: any, a: any) => {
      if (a.input.index === b.input.index) {
          return b.index - a.index;
      } else {
          return b.input.index - a.input.index;
      }
  });
}