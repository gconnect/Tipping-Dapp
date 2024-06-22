import { JsonRpcSigner, parseUnits } from "ethers"
import { depositErc20ToPortal, addInput } from "../cartesi/Portals"
import { RollupsContracts } from "../cartesi/hooks/useRollups"
import { Chain } from "viem"
import { getERC20L2Balance } from "./getBalance"
import { parseEther } from "ethers"

  export const sendTip = async (sender: `0x${string}`, to: string, erc20: `0x${string}`, 
    amount: number, creatorId: number, signer: JsonRpcSigner, rollups: RollupsContracts, chain: Chain) => {
    const payload = {
      "method": "send_tip",
      // "args":{
      //     "account": sender,
      //     "to": to,
      //     "erc20": erc20,
      //     "amount": Number(parseUnits(amount.toString(), 18))
      // },
      "args": {
        // "to": to,
        "amount": Number(parseUnits(amount.toString(), 18)),
        "token": erc20,
        "creatorId": creatorId,
      }
    }
    try{
      const provider = signer?.provider
        const erc20balance = await getERC20L2Balance(erc20, sender, chain)
        console.log(erc20balance)
      if(erc20balance < parseUnits(amount.toString(), 18)){
       const res = await depositErc20ToPortal(rollups, provider, erc20, Number(amount), sender)
       if(!res?.hash) return
        await addInput(rollups, JSON.stringify(payload))
      }else{
        await addInput(rollups, JSON.stringify(payload))
      }
    }catch(error){
      console.log(error)
    }
  }