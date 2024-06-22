"use client"
import { useEffect, useState } from "react"
import { Button, Modal, ModalBody, ModalOverlay,Input,
   ModalHeader, ModalContent, ModalCloseButton, ModalFooter, 
   } from "@chakra-ui/react"
import { errorAlert, successAlert } from "../utils/customAlert"
import { DAPP_ADDRESS, TEST_TOKEN } from "../utils/constants"
import { useRollups } from "../cartesi/hooks/useRollups"
import { useEthersSigner } from "../utils/useEtherSigner"
import { useAccount } from "wagmi"
import toast from "react-hot-toast"
import { getERC20L2Balance } from "../helpers/getBalance"
import { parseEther, toBigInt } from "ethers"
import { withdrawERC20 } from "../helpers/withdraw_erc20"
import { createUrqlClient, getVouchers, getVoucherWithProof } from './../cartesi/VoucherService';

import { getCreatorVouchers } from "../helpers/getCreatorVouchers"
import { Voucher } from "../cartesi/generated/graphql"
import { finalWithraw } from "../helpers/excuteVoucher"

  interface Props {
    creatorId: number
    creatorWalletAddress: string
    creatorUsername: string
    isOpen: boolean
    onClose: () => void
   }

export const WithdrawModal = ({ isOpen, onClose, creatorId, creatorWalletAddress, creatorUsername }: Props) => {
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const { address, chain } = useAccount()
  const rollups = useRollups(DAPP_ADDRESS)
  const signer = useEthersSigner()
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)
  const client = createUrqlClient();
  const [creatorVouchers, setCreatorVouchers] = useState<any[]>([])
  const [executed, setExecuted] = useState(false)


  // const withdraw = async (index: number, inputIndex: number) => {

  //   const voucherExecuted = await rollups?.dappContract.wasVoucherExecuted(
  //     BigInt(inputIndex),
  //     BigInt(index)
  //   )
  //   console.log("execution status", voucherExecuted)
  //   if (voucherExecuted) return errorAlert('Fund has already been withrawn')

  //   setLoading(true)

  //   try {
  //     const voucherWithProof = await  getVoucherWithProof(
  //       client,
  //       index,
  //       inputIndex
  //     )
  //     if (voucherWithProof) {
  //       await executeVoucher(voucherWithProof)
  //     }
  //   } catch (error) {
  //     setLoading(false)
  //   }
  // }

  // const executeVoucher = async (voucher: any) => {
  //   if (rollups && !!voucher.proof) {
  //     const newVoucherToExecute = { ...voucher }
  //     try {
  //       const tx = await rollups.dappContract.executeVoucher(
  //         voucher.destination,
  //         voucher.payload,
  //         voucher.proof
  //       )
  //       const receipt = await tx.wait()
  //       if (receipt) {
  //         console.log('voucher receipt ', receipt)

  //         toast.success('Congratulation! Fund successfully withdrawn')
  //         onClose()
  //       }
  //       setLoading(false)
  //       console.log("newVoucherToExecute", newVoucherToExecute)
  //     } catch (e) {

  //       console.log(`COULD NOT EXECUTE VOUCHER: ${JSON.stringify(e)}`)
  //       setLoading(false)
  //       onClose()
  //       toast.error('Fund not withrawn')
  //     }
  //     setExecuted(true)
  //     setLoading(false)
  //   }
  // }

  // const fetchData = async () => {
   
  //   if (address) {
  //     const vouchers = await getVouchers(client)
  //     if (!vouchers.length) return errorAlert("No vouchers found");
  //     if (vouchers.length) {
  //       const creatorVouchersData = await getCreatorVouchers(
  //         address,
  //         vouchers
  //       )
  //       // Check execution status for initial data
  //       const updatedVouchers = await Promise.all(
  //         creatorVouchersData.map(async (voucher: any) => {
  //           if (rollups) {
  //             const isExecuted = await rollups.dappContract.wasVoucherExecuted(
  //               BigInt(voucher.input.index),
  //               BigInt(voucher.index)
  //             )
  //             return { ...voucher, executed: isExecuted }
  //           } else {
  //             return voucher
  //           }
  //         })
  //       )
  //       console.log('creators vouchers ', updatedVouchers)
  //       setCreatorVouchers(updatedVouchers)
  //     }
  //   }
  // }

  // console.log("creatorVouchers", creatorVouchers)

  // const finalVoucherWithdraw = () => {
  //   setLoading(true)
  //   creatorVouchers.filter((voucher) => voucher.executed !== true).map((voucher, index) => withdraw(voucher.index, voucher.input.index))
  //   setLoading(false)
  // }

  const handleWithdraw = async () => {
    try{
      if(!amount) return errorAlert("Please enter an amount")
      setLoading(true)
      await withdrawERC20(address!, TEST_TOKEN, Number(amount),rollups!, chain!)
      setLoading(false)
    }catch(error){
      setLoading(false)
      console.log(error)
      errorAlert(error)
    }
  }




  // useEffect(() =>{
  //   fetchData()
  // }, [])
  return (
    <>
      <Modal  isOpen={isOpen} size={"xl"} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="bg-blue-200 rounded-t ">{`Withdraw`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="bg-blue-200 ">
            <Input borderColor="blue.700" className='mt-2' placeholder='Amount' type='number' value={amount} onChange={handleAmountChange} />
            <Input borderColor="blue.700" className='mt-2' disabled placeholder='Wallet Address' type="text" value={creatorWalletAddress} />
          </ModalBody>
          <ModalFooter className="bg-blue-200 rounded-b">
            <Button className="full" colorScheme='blue' mr={3} onClick={handleWithdraw}>
              {loading ? "Withdrawing..." : "Withdraw"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
