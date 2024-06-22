"use client"
import { useState } from "react"
import { Button, Modal, ModalBody, ModalOverlay,Input,
   ModalHeader, ModalContent, ModalCloseButton, ModalFooter, 
   } from "@chakra-ui/react"
import { errorAlert, successAlert } from "../utils/customAlert"
import { DAPP_ADDRESS, TEST_TOKEN } from "../utils/constants"
import { useRollups } from "../cartesi/hooks/useRollups"
import { useEthersSigner } from "../utils/useEtherSigner"
import { useAccount } from "wagmi"
import { sendTip } from "../helpers/send_tip"
import toast from "react-hot-toast"
import { getERC20L2Balance } from "../helpers/getBalance"
import { parseEther, toBigInt } from "ethers"
  interface Props {
    creatorId: number
    creatorWalletAddress: string
    creatorUsername: string
    isOpen: boolean
    onClose: () => void
   }

export const TipModal = ({ isOpen, onClose, creatorId, creatorWalletAddress, creatorUsername }: Props) => {
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const { address, chain } = useAccount()
  const rollups = useRollups(DAPP_ADDRESS)
  const signer = useEthersSigner()
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)

  console.log(creatorId)
  console.log(creatorWalletAddress)

  const handleSendtip = async () => {
    try{
      if(!amount) return errorAlert("Please enter an amount")
      setLoading(true)
      await sendTip(address!,creatorWalletAddress, TEST_TOKEN, Number(amount), creatorId, signer!,rollups!,chain!)
      setLoading(false)
      // successAlert("Tip sent successfully")
    }catch(error){
      console.log(error)
      errorAlert(error)
    }
  }

  // const checkBalance =async  () => {
  //   await getERC20L2Balance(TEST_TOKEN, address!, chain!)
  // }

  
  return (
    <>
      <Modal  isOpen={isOpen} size={"xl"} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="bg-blue-200 rounded-t ">{`Send Tip to ${creatorUsername}`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="bg-blue-200 ">
            <Input borderColor="blue.700" className='mt-2' placeholder='Amount' type='number' value={amount} onChange={handleAmountChange} />
            <Input borderColor="blue.700" className='mt-2' disabled placeholder='Wallet Address' type="text" value={creatorWalletAddress} />
          </ModalBody>
          <ModalFooter className="bg-blue-200 rounded-b">
            <Button className="full" colorScheme='blue' mr={3} onClick={handleSendtip}>
              {loading ? "Sending Please wait..." : "Send tip"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
