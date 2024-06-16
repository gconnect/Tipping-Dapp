import { useState } from "react"
import { Button, Modal, ModalBody, ModalOverlay,Input,
   ModalHeader, ModalContent, ModalCloseButton, ModalFooter, 
   Textarea} from "@chakra-ui/react"

   interface Props {
    isOpen: boolean
    onClose: () => void
   }
export const TipModal = ({ isOpen, onClose }: Props) => {
  const [input, setInput] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)

  const sendTip = () => {

  }
  
  return (
    <>
      <Modal  isOpen={isOpen} size={"xl"} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="bg-blue-200 rounded-t ">Send Tip to gconnect</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="bg-blue-200 ">
            <Input borderColor="blue.700" className='mt-2' placeholder='Amount' type='text' value={input} onChange={handleInputChange} />
            <Textarea borderColor="blue.700" className='mt-2' placeholder='Short thank you note optional' type='text' value={input} onChange={handleInputChange} />
          </ModalBody>
          <ModalFooter className="bg-blue-200 rounded-b">
            <Button className="full" colorScheme='blue' mr={3} onClick={sendTip}>
              Send Tip
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
