import { JsonRpcSigner } from "ethers";
import {
  IERC20__factory,
} from "../cartesi/generated/rollups";
import { inspectCall } from "./inspectCall";
import { TEST_TOKEN } from "../utils/constants";
import { Chain } from "viem";

export const getL1Balance = async (signer: JsonRpcSigner, token: `0x${string}`, sender: `0x${string}`, chain: Chain) => {

  const provider = signer.provider
  const tokenContract =  signer
        ? IERC20__factory.connect(token, signer)
        : IERC20__factory.connect(token, provider);

     return tokenContract.balanceOf(sender)
}


export const getERC20L2Balance = async ( token: `0x${string}`, sender: `0x${string}`, chain: Chain) => {
  try{
    const reports = await inspectCall(
      `balance/${sender}`,
      chain!
    )
    if(reports[0].erc20.length > 0){
      const erc20 = reports[0].erc20[0].find((item: any) => item === token)
      console.log(erc20)
      if(erc20){
        console.log(reports[0].erc20[0][1])
        return reports[0].erc20[0][1]
      }
    }else {
      console.log('Balance is zero')
      return 0
    }
  }catch(error){
    console.log(error)
  }
}