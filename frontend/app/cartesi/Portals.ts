import { ethers, JsonRpcApiProvider, parseEther, toBigInt, toBeHex, BytesLike, toUtf8Bytes } from "ethers";
import { RollupsContracts } from "../cartesi/hooks/useRollups";
import {
  IERC1155__factory,
  IERC20__factory,
  IERC721__factory,
} from "../cartesi/generated/rollups";
import { successAlert, errorAlert } from "../utils/customAlert";
import { DAPP_ADDRESS } from "../utils/constants";
import { Hex } from "viem";

export const sendAddress = async (rollups: RollupsContracts | undefined, setDappRelayedAddress: Function) => {
  if (rollups) {
    try {
    const relayTx =  await rollups.relayContract.relayDAppAddress(DAPP_ADDRESS);
      setDappRelayedAddress(true);
      const tx = await relayTx.wait(1) 
      successAlert(tx!.hash)
      return tx?.hash
    } catch (e) {
      console.log(`${e}`);
      errorAlert(e)
    }
  }
};

export const addInput = async (
  rollups: RollupsContracts | undefined, 
  jsonPayload: string
 ) => {
  if (rollups) {
      try {
        let payload = ethers.toUtf8Bytes(jsonPayload);
        const tx = await rollups.inputContract.addInput(DAPP_ADDRESS, payload);
        const receipt = await tx?.wait()
        successAlert(receipt?.hash)
        console.log(receipt?.hash)
        return receipt?.hash
      } catch (e) {
        errorAlert(e)
        console.log(`${e}`);
      }
  }
};

export const depositEtherToPortal = async (rollups: RollupsContracts | undefined, 
  provider: JsonRpcApiProvider | undefined, setLoadEther: Function, amount: number) => {
  try {
    if (rollups && provider) {
      setLoadEther(true)
      const data = ethers.toUtf8Bytes(`Deposited (${amount}) ether.`);
      const txOverrides = { value: parseEther(`${amount}`) };
      console.log("Ether to deposit: ", txOverrides);

    const tx =  await rollups.etherPortalContract.depositEther(
        DAPP_ADDRESS,
        data,
        txOverrides
      );
      setLoadEther(false)
      const receipt = await tx.wait(1)
      successAlert(receipt!.hash)
      return receipt!.hash
    }
  } catch (e: any) {
    setLoadEther(false)
    console.log(`${e}`);
    errorAlert(e)
  }
};

export const depositErc20ToPortal = async (rollups: RollupsContracts | undefined, 
  provider: JsonRpcApiProvider | undefined,
  token: string, amount: number) => {
  try {
    if (rollups && provider) {
      const data = ethers.toUtf8Bytes(
        `Deposited (${amount}) of ERC20 (${token}).`
      );
      const signer =  await provider.getSigner();
      const signerAddress = (await signer).address;

      const erc20PortalAddress =  await rollups.erc20PortalContract.getAddress();
      const tokenContract = signer
        ? IERC20__factory.connect(token, signer)
        : IERC20__factory.connect(token, provider);

      // query current allowance
      const currentAllowance = await tokenContract.allowance(
        signerAddress!,
        erc20PortalAddress
      );
      if (parseEther(`${amount}`) > currentAllowance) {
        // Allow portal to withdraw `amount` tokens from signer
        const tx = await tokenContract.approve(
          erc20PortalAddress,
          parseEther(`${amount}`)
        );
        const receipt = await tx.wait(1);
        const event = (
          await tokenContract.queryFilter(
            tokenContract.filters.Approval(),
            receipt?.blockHash
          )
        ).pop();
        if (!event) {
          throw Error(
            `could not approve ${amount} tokens for DAppERC20Portal(${erc20PortalAddress})  (signer: ${signerAddress}, tx: ${receipt?.hash})`
          );
        }
      }

     const deposit = await rollups.erc20PortalContract.depositERC20Tokens(
        token,
        DAPP_ADDRESS,
        ethers.parseEther(`${amount}`),
        data
      );
      // const transReceipt = await deposit.wait(1);
      // successAlert(transReceipt!.hash)
      successAlert("Transaction successful")
      return deposit
    }
  } catch (e) {
    console.log(`Error occured ${e}`);
    errorAlert(`Error occured ${e}`)
  }

//   if (rollups && provider) {
    
//     const data = toUtf8Bytes(
//       `Deposited (${amount}) of ERC20 (${token}).`
//     );
//     //const data = `Deposited ${args.amount} tokens (${args.token}) for DAppERC20Portal(${portalAddress}) (signer: ${address})`;
//     const signer = await provider.getSigner();
//     const signerAddress = await signer.getAddress()
    
//     const erc20PortalAddress = await rollups.erc20PortalContract.getAddress();
//     const tokenContract = signer
//     ? IERC20__factory.connect(token, signer)
//     : IERC20__factory.connect(token, provider);
    
//     // query current allowance
//     const currentAllowance = await tokenContract.allowance(
//       signerAddress.toLowerCase(),
//       erc20PortalAddress.toLowerCase()
//       );
 
//     // if (true) {
//     if (parseEther(`${amount}`) > currentAllowance) {

//       console.log('amount ', parseEther(`${amount}`))
//       // Allow portal to withdraw `amount` tokens from signer
//       try {
//         const tx = await tokenContract.approve(
//           erc20PortalAddress,
//           parseEther(`${amount}`)
//         );
//         const receipt = await tx.wait(1);
//       const event = (
//         await tokenContract.queryFilter(
//           tokenContract.filters.Approval(),
//           receipt?.blockHash
//         )
//       ).pop();
//       if (!event) {
//         throw Error(
//           `could not approve ${amount} tokens for DAppERC20Portal(${erc20PortalAddress})  (signer: ${signerAddress}, tx: ${tx.hash})`
//         );
//       }
//       } catch (error) {
//         console.log('error from transfering ', error)
//       }
    
//     }

//     return await rollups.erc20PortalContract.depositERC20Tokens(
//       token,
//       DAPP_ADDRESS,
//       parseEther(`${amount}`),
//       data
//     );
//   }
// } catch (e) {
//   console.log(`${e}`);
// }
 };

export const withdrawEther = async (rollups: RollupsContracts | undefined, 
  provider: JsonRpcApiProvider | undefined, setLoadWithdrawEther: Function, amount: number) => {
  try {
    if (rollups && provider) {
      setLoadWithdrawEther(true)
      let ether_amount = parseEther(String(amount)).toString();
      console.log("ether after parsing: ", ether_amount);
      const input_obj = {
        method: "ether_withdraw",
        args: {
          amount: ether_amount
        },
      };
      const data = JSON.stringify(input_obj);
      let payload = ethers.toUtf8Bytes(data);
      const tx = await rollups.inputContract.addInput(DAPP_ADDRESS, payload);
      const receipt = await tx.wait(1)
      setLoadWithdrawEther(false)
      successAlert(receipt!.hash)
      return receipt!.hash
    }
  } catch (e) {
    setLoadWithdrawEther(false)
    console.log(e);
    errorAlert(e)
  }
};

export const withdrawErc20 = async (rollups: RollupsContracts | undefined, 
    provider: JsonRpcApiProvider | undefined, setLoadWithdrawERC20: Function,
   amount: number, address: String) => {
  try {
    if (rollups && provider) {
      setLoadWithdrawERC20(true)
      let erc20_amount = parseEther(String(amount)).toString();
      console.log("erc20 after parsing: ", erc20_amount);
      const input_obj = {
        method: "erc20_withdraw",
        args: {
          erc20: address,
          amount: erc20_amount,
        },
      };
      const data = JSON.stringify(input_obj);
      let payload = ethers.toUtf8Bytes(data);
      const tx =  await rollups.inputContract.addInput(DAPP_ADDRESS, payload);
      const receipt = await tx.wait(1)
      setLoadWithdrawERC20(false)
      successAlert(receipt?.hash)
      return receipt?.hash
    }
  } catch (e) {
    setLoadWithdrawERC20(false)
    console.log(e);
    errorAlert(e)
  }
};

export const withdrawErc721 = async (rollups: RollupsContracts | undefined, 
  provider: JsonRpcApiProvider | undefined,
  setLoadWithdrawERC721: Function, address: String, id: number) => {
  try {
    if (rollups && provider) {
      setLoadWithdrawERC721(true)
      let erc721_id = String(id);
      console.log("erc721 after parsing: ", erc721_id);
      const input_obj = {
        method: "erc721_withdrawal",
        args: {
          erc721: address,
          token_id: id,
        },
      };
      const data = JSON.stringify(input_obj);
      let payload = ethers.toUtf8Bytes(data);
      const tx = await rollups.inputContract.addInput(DAPP_ADDRESS, payload);
      const receipt = await tx.wait(1)
      setLoadWithdrawERC721(false)
      successAlert(receipt?.hash)
      return receipt?.hash
    }
  } catch (e) {
    setLoadWithdrawERC721(false)
    console.log(e);
    errorAlert(e)
  }
};

export const transferErc20 = async (rollups: RollupsContracts | undefined, 
  provider: JsonRpcApiProvider | undefined,
  sender: `0x${string}`| undefined, 
  to: `0x${string}`| undefined,
  erc20token: string,
  amount: number, 
  ) => {
  try {
  if (rollups && provider) {
    let erc20_amount = parseEther(String(amount)).toString();
    console.log("erc20 after parsing: ", erc20_amount);

    // account: Address, to: Address, erc20: Address, amount: bigint
    const input_obj = {
      method: "erc20_transfer",
      args: {
        account: sender,
        to: to,
        erc20: erc20token,
        amount: erc20_amount,
      },
    };
    const data = JSON.stringify(input_obj);
    let payload = ethers.toUtf8Bytes(data);
    const tx =  await rollups.inputContract.addInput(DAPP_ADDRESS, payload);
    const receipt = await tx.wait(1)
    successAlert(receipt?.hash)
    return receipt?.hash
  }
} catch (e) {
  console.log(e);
  errorAlert(e)
}
};

export const transferNftToPortal = async (
  rollups: RollupsContracts | undefined, 
  provider: JsonRpcApiProvider | undefined,
  setLoadTransferNFT: Function, 
  contractAddress: string,
  nftid: number
) => {
  try {
    if (rollups && provider) {
      setLoadTransferNFT(true)
      const data = ethers.toUtf8Bytes(
        `Deposited (${nftid}) of ERC721 (${contractAddress}).`
      );
      //const data = `Deposited ${args.amount} tokens (${args.token}) for DAppERC20Portal(${portalAddress}) (signer: ${address})`;
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();

      const erc721PortalAddress = await rollups.erc721PortalContract.getAddress();

      const tokenContract = signer
        ? IERC721__factory.connect(contractAddress, signer)
        : IERC721__factory.connect(contractAddress, signer);

      // query current approval
      const currentApproval = await tokenContract.getApproved(nftid);
      if (currentApproval !== erc721PortalAddress) {
        // Allow portal to withdraw `amount` tokens from signer
        const tx = await tokenContract.approve(erc721PortalAddress, nftid);      
        const receipt = await tx.wait(1);
        const event = (
          await tokenContract.queryFilter(
            tokenContract.filters.Approval(),
            receipt?.hash
          )
        ).pop();
        if (!event) {
          throw Error(
            `could not approve ${nftid} for DAppERC721Portal(${erc721PortalAddress})  (signer: ${signerAddress}, tx: ${tx.hash})`
          );
        }
      }

      // Transfer
      const tx = await rollups.erc721PortalContract.depositERC721Token(
        contractAddress,
        DAPP_ADDRESS,
        nftid,
        "0x",
        data
      );

      const receipt = await tx.wait(1)
      setLoadTransferNFT(false)
      successAlert(receipt?.hash)
      return receipt?.hash
    }
  } catch (e) {
    setLoadTransferNFT(false)
    console.log(`${e}`);
    errorAlert(e)
  }
};


export const transferErc1155SingleToPortal = async (
  rollups: RollupsContracts | undefined, 
  provider: JsonRpcApiProvider | undefined,
  setLoadERC1155: Function,
  contractAddress: string, id: number, amount: number) => {
  try {
      if (rollups && provider) {
        setLoadERC1155(true)
          const data = ethers.toUtf8Bytes(`Deposited (${amount}) tokens from id (${id}) of ERC1155 (${contractAddress}).`);
          //const data = `Deposited ${args.amount} tokens (${args.token}) for DAppERC20Portal(${portalAddress}) (signer: ${address})`;
          const signer = await provider.getSigner();
          const signerAddress = await signer.getAddress()

          const erc1155SinglePortalAddress = await rollups.erc1155SinglePortalContract.getAddress();

          const tokenContract = signer ? IERC1155__factory.connect(contractAddress, signer) : IERC1155__factory.connect(contractAddress, signer);

          // query current approval
          const currentApproval = await tokenContract.isApprovedForAll(signerAddress,erc1155SinglePortalAddress);
          if (!currentApproval) {
              // Allow portal to withdraw `amount` tokens from signer
              const tx = await tokenContract.setApprovalForAll(erc1155SinglePortalAddress,true);
              const receipt = await tx.wait(1);
              const event = (await tokenContract.queryFilter(tokenContract.filters.ApprovalForAll(), receipt?.blockHash)).pop();
              if (!event) {
                  throw Error(`could set approval for DAppERC1155Portal(${erc1155SinglePortalAddress})  (signer: ${signerAddress}, tx: ${tx.hash})`);
              }
          }

          // Transfer
        const tx =  await rollups.erc1155SinglePortalContract.depositSingleERC1155Token(contractAddress,DAPP_ADDRESS, id, amount, "0x", data);
        const receipt = await tx.wait(1)
        setLoadERC1155(false)
        successAlert(receipt?.hash)
        return receipt?.hash
      }
  } catch (e) {
    setLoadERC1155(false)
    errorAlert(e)
    console.log(`${e}`);
  }
};

export const transferErc1155BatchToPortal = async ( 
  rollups: RollupsContracts | undefined, 
  provider: JsonRpcApiProvider | undefined,
  setLoadERC1155Batch: Function,
  contractAddress: string, 
  ids: number[], 
  amounts: number[]
) => {
  try {
      if (rollups && provider) {
          setLoadERC1155Batch(true)
          const data = ethers.toUtf8Bytes(`Deposited (${amounts}) tokens from ids (${ids}) of ERC1155 (${contractAddress}).`);
          //const data = `Deposited ${args.amount} tokens (${args.token}) for DAppERC20Portal(${portalAddress}) (signer: ${address})`;
          const signer = await provider.getSigner();
          const signerAddress = await signer.getAddress()

          const erc1155BatchPortalAddress = await rollups.erc1155BatchPortalContract.getAddress();

          const tokenContract = signer ? IERC1155__factory.connect(contractAddress, signer) : IERC1155__factory.connect(contractAddress, signer);

          // query current approval
          const currentApproval = await tokenContract.isApprovedForAll(signerAddress,erc1155BatchPortalAddress);
          if (!currentApproval) {
              // Allow portal to withdraw `amount` tokens from signer
              const trans = await tokenContract.setApprovalForAll(erc1155BatchPortalAddress,true);
              const tx = await signer.sendTransaction(trans)
              const receipt = await tx.wait(1);
              const event = (await tokenContract.queryFilter(tokenContract.filters.ApprovalForAll(), receipt?.blockHash)).pop();
              if (!event) {
                  throw Error(`could set approval for DAppERC1155Portal(${erc1155BatchPortalAddress})  (signer: ${signerAddress}, tx: ${tx.hash})`);
              }
          }

          // Transfer
         const tx = await rollups.erc1155BatchPortalContract.depositBatchERC1155Token(contractAddress,DAPP_ADDRESS, ids, amounts, "0x", data);        
         const receipt = await tx.wait()
         setLoadERC1155Batch(false)
         successAlert(receipt?.hash)
         return receipt?.hash

      }
  } catch (e) {
      setLoadERC1155Batch(false)
      errorAlert(e)
      console.log(`${e}`);
  }
};

export const executeVoucher = async (
  rollups: RollupsContracts | undefined, 
  setVoucherToExecute: Function,
  voucher: any
  ) => {
  if (rollups && !!voucher.proof) {

      const newVoucherToExecute = {...voucher};
      try {
          const tx = await rollups.dappContract.executeVoucher( voucher.destination,voucher.payload,voucher.proof);
          const receipt = await tx?.wait(1);
          newVoucherToExecute.msg = `voucher executed! (tx="${receipt?.hash}")`;
          const event = (await rollups.dappContract.queryFilter(rollups.dappContract.filters.VoucherExecuted(), receipt?.blockHash)).pop();
          if (event) {
              newVoucherToExecute.msg = `${newVoucherToExecute.msg} - resulting events: ${JSON.stringify(receipt?.hash)}`;
              newVoucherToExecute.executed = await rollups.dappContract.wasVoucherExecuted(toBigInt(voucher.input.index),toBigInt(voucher.index));
          }
      } catch (e) {
          newVoucherToExecute.msg = `COULD NOT EXECUTE VOUCHER: ${JSON.stringify(e)}`;
          console.log(`COULD NOT EXECUTE VOUCHER: ${JSON.stringify(e)}`);
      }
      setVoucherToExecute(newVoucherToExecute);
  }
}