import { parseUnits } from "ethers"
import {  addInput } from "../cartesi/Portals"
import { RollupsContracts } from "../cartesi/hooks/useRollups"
import { Chain } from "viem"
import { getERC20L2Balance } from "./getBalance"
import { errorAlert } from "../utils/customAlert"

  export const withdrawERC20 = async (sender: `0x${string}`, erc20: `0x${string}`, 
    amount: number, rollups: RollupsContracts, chain: Chain) => {
    const payload = {
      "method": "erc20_withdraw",
      "args":{
          "account": sender,
          "erc20": erc20,
          "amount": Number(parseUnits(amount.toString(), 18))
      },
    }
    try{
      const erc20balance = await getERC20L2Balance(erc20, sender, chain)
      console.log(erc20balance)
      if(erc20balance < parseUnits(amount.toString(), 18)){
        return errorAlert("Insufficient withdraw amount")
      }else{
        await addInput(rollups, JSON.stringify(payload))
      }
    }catch(error){
      console.log(error)
    }
  }