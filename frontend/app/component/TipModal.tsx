"use client"
import { useState } from "react"
import { Button, Modal, ModalBody, ModalOverlay,Input,
   ModalHeader, ModalContent, ModalCloseButton, ModalFooter, 
   Textarea} from "@chakra-ui/react"
import { depositErc20ToPortal, addInput, transferErc20 } from "../cartesi/Portals"
import { errorAlert } from "../utils/customAlert"
import { DAPP_ADDRESS, TEST_TOKEN } from "../utils/constants"
import { useRollups } from "../cartesi/hooks/useRollups"
import { useEthersSigner } from "../utils/useEtherSigner"
import { toBeHex } from "ethers"
import { useAccount } from "wagmi"
  interface Props {
    isOpen: boolean
    onClose: () => void
   }
export const TipModal = ({ isOpen, onClose }: Props) => {
  const [amount, setAmount] = useState("")
  const [creatorAddress, setCreatorAddress] = useState("")
  const [creatorId, setCreatorId] = useState(0)
  const [loading, setLoading] = useState(false)
  const { address } = useAccount()
  const rollups = useRollups(DAPP_ADDRESS)
  const signer = useEthersSigner()
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)
  const handleWalletAddress = (e: React.ChangeEvent<HTMLInputElement>) => setCreatorAddress(e.target.value)

  const to = "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc"

  const payload = {
    "method": "send_tip",
    "args": {
      // "to": to,
      "amount": amount,
      "token": TEST_TOKEN,
      "creatorId": 0,
    }
  }
  const handleSendTip = async () => {
    try{
      const provider = signer?.provider
      // if(!address) return errorAlert("Please connect your wallet")
      if(!amount) return errorAlert("Field should be filled")
      setLoading(true)
      await depositErc20ToPortal(rollups, provider, TEST_TOKEN, Number(amount))
      // await transferErc20(rollups, provider, address, to, TEST_TOKEN,  Number(amount))
      // await addInput(rollups, JSON.stringify(payload))
      setLoading(false)
    }catch(error){
      setLoading(false)
      console.log("error Ui", error)
      errorAlert(error)
    }
  }
  
  return (
    <>
      <Modal  isOpen={isOpen} size={"xl"} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="bg-blue-200 rounded-t ">Send Tip to gconnect</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="bg-blue-200 ">
            <Input borderColor="blue.700" className='mt-2' placeholder='Amount' type='number' value={amount} onChange={handleAmountChange} />
            <Input borderColor="blue.700" className='mt-2' disabled placeholder='Wallet Address' type="text" value={address} />
          </ModalBody>
          <ModalFooter className="bg-blue-200 rounded-b">
            <Button className="full" colorScheme='blue' mr={3} onClick={handleSendTip}>
              {loading ? "Sending Please wait..." : "Send tip"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
